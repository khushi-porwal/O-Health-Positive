
const Donation = require("../../models/donate/Donation");

let phonePeClientPromise;

// ========================================
// PHONEPE CLIENT
// ========================================

const getPhonePeClient = async () => {
  if (!phonePeClientPromise) {
    phonePeClientPromise = (async () => {
      const {
        StandardCheckoutClient,
        Env,
      } = await import("@phonepe-pg/pg-sdk-node");

      const clientId = process.env.PHONEPE_CLIENT_ID;
      const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = Number(
        process.env.PHONEPE_CLIENT_VERSION
      );

      if (
        !clientId ||
        !clientSecret ||
        !Number.isInteger(clientVersion) ||
        clientVersion <= 0
      ) {
        throw new Error("PhonePe configuration is incomplete.");
      }

      const environment =
        process.env.PHONEPE_ENV === "PRODUCTION"
          ? Env.PRODUCTION
          : Env.SANDBOX;

      return StandardCheckoutClient.getInstance(
        clientId,
        clientSecret,
        clientVersion,
        environment
      );
    })().catch((error) => {
      phonePeClientPromise = null;
      throw error;
    });
  }

  return phonePeClientPromise;
};

// ========================================
// PHONEPE WEBHOOK
// ========================================

const phonePeWebhook = async (req, res) => {
  try {
    // 1. Check webhook credentials
    const username = process.env.PHONEPE_CALLBACK_USERNAME;
    const password = process.env.PHONEPE_CALLBACK_PASSWORD;

    if (!username || !password) {
      console.error("PhonePe webhook credentials are missing.");

      return res.status(500).json({
        success: false,
        message: "Webhook configuration error.",
      });
    }

    // 2. Check raw request body
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook body.",
      });
    }

    const responseBody = req.body.toString("utf8");

    let rawCallback;

    try {
      rawCallback = JSON.parse(responseBody);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid callback JSON.",
      });
    }

    // 3. Get authorization header
    const authorization = req.get("Authorization");

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Missing callback authorization.",
      });
    }

    const client = await getPhonePeClient();

    // 4. Authenticate callback using PhonePe SDK
    // Invalid callbacks throw an error.
    const callbackResponse = client.validateCallback(
      username,
      password,
      authorization,
      responseBody
    );

    // 5. Validate callback event
    const event =
      callbackResponse?.type || rawCallback?.type;

    const allowedEvents = [
      "PG_ORDER_COMPLETED",
      "PG_ORDER_FAILED",
    ];

    if (!allowedEvents.includes(event)) {
      console.error("Unsupported PhonePe callback event:", event);

      return res.status(400).json({
        success: false,
        message: "Unsupported webhook event.",
      });
    }

    // 6. Extract authenticated callback details
    const merchantOrderId =
      callbackResponse?.payload?.orderId;

    const callbackState = String(
      callbackResponse?.payload?.state || ""
    ).toUpperCase();

    if (
      typeof merchantOrderId !== "string" ||
      !merchantOrderId.trim() ||
      merchantOrderId.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid merchant order ID.",
      });
    }

    // 7. Event and state must match
    if (
      (event === "PG_ORDER_COMPLETED" &&
        callbackState !== "COMPLETED") ||
      (event === "PG_ORDER_FAILED" &&
        callbackState !== "FAILED")
    ) {
      return res.status(400).json({
        success: false,
        message: "Callback event and state mismatch.",
      });
    }

    // 8. Find original donation
    const donation = await Donation.findOne({
      merchantOrderId,
      paymentProvider: "phonepe",
    });

    if (!donation) {
      console.error(
        "PhonePe donation not found:",
        merchantOrderId
      );

      return res.status(404).json({
        success: false,
        message: "Donation record not found.",
      });
    }

    // 9. Verify payment directly with PhonePe
    const orderStatus = await client.getOrderStatus(
      merchantOrderId
    );

    const verifiedState = String(
      orderStatus?.state || ""
    ).toUpperCase();

    // 10. Verify amount in paise
    const expectedAmount = Number(donation.amount) * 100;
    const actualAmount = Number(orderStatus?.amount);

    if (
      !Number.isSafeInteger(expectedAmount) ||
      !Number.isSafeInteger(actualAmount) ||
      actualAmount !== expectedAmount
    ) {
      console.error(
        "PhonePe amount mismatch:",
        merchantOrderId
      );

      return res.status(400).json({
        success: false,
        message: "Payment amount verification failed.",
      });
    }

    // ========================================
    // 11. COMPLETED PAYMENT
    // ========================================

    if (verifiedState === "COMPLETED") {
      // Extract transaction reference
      const paymentDetails = Array.isArray(
        orderStatus?.paymentDetails
      )
        ? orderStatus.paymentDetails
        : [];

      const transactionId =
        paymentDetails.find(
          (item) =>
            item?.state === "COMPLETED" &&
            item?.transactionId
        )?.transactionId ||
        paymentDetails.find(
          (item) => item?.transactionId
        )?.transactionId;

      if (!transactionId) {
        console.error(
          "Transaction reference missing:",
          merchantOrderId
        );

        return res.status(503).json({
          success: false,
          message: "Payment reconciliation required.",
        });
      }

      // Handle duplicate completed callback
      if (donation.status === "completed") {
        if (donation.paymentReference !== transactionId) {
          console.error(
            "Payment reference mismatch:",
            merchantOrderId
          );

          return res.status(409).json({
            success: false,
            message: "Payment reference mismatch.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Payment already processed.",
        });
      }

      // Do not silently overwrite failed records
      if (donation.status !== "pending") {
        return res.status(409).json({
          success: false,
          message: "Donation requires reconciliation.",
        });
      }

      // Atomic update prevents duplicate processing
      const updatedDonation =
        await Donation.findOneAndUpdate(
          {
            _id: donation._id,
            status: "pending",
            paymentProvider: "phonepe",
          },
          {
            $set: {
              status: "completed",
              paymentReference: transactionId,
              paidAt: new Date(),
            },
          },
          {
            new: true,
          }
        );

      if (!updatedDonation) {
        const latestDonation = await Donation.findById(
          donation._id
        );

        if (
          latestDonation?.status === "completed" &&
          latestDonation?.paymentReference === transactionId
        ) {
          return res.status(200).json({
            success: true,
            message: "Payment already processed.",
          });
        }

        return res.status(409).json({
          success: false,
          message: "Donation status changed. Reconciliation required.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment completed and verified.",
      });
    }

    // ========================================
    // 12. FAILED PAYMENT
    // ========================================

    if (verifiedState === "FAILED") {
      if (donation.status === "completed") {
        return res.status(200).json({
          success: true,
          message: "Completed payment remains unchanged.",
        });
      }

      if (donation.status === "failed") {
        return res.status(200).json({
          success: true,
          message: "Failed payment already processed.",
        });
      }

      await Donation.updateOne(
        {
          _id: donation._id,
          status: "pending",
          paymentProvider: "phonepe",
        },
        {
          $set: {
            status: "failed",
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Failed payment verified.",
      });
    }

    // ========================================
    // 13. PENDING PAYMENT
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Payment is still processing.",
    });

  } catch (error) {
    console.error(
      "PhonePe webhook error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate payment reference.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to process PhonePe callback.",
    });
  }
};

module.exports = { phonePeWebhook };
