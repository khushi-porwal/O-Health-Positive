
const crypto = require("crypto");
const Donation = require("../../models/donate/Donation");

let phonePeClientPromise;

const getPhonePeClient = async () => {
  if (!phonePeClientPromise) {
    phonePeClientPromise = (async () => {
      const clientId = process.env.PHONEPE_CLIENT_ID;
      const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = Number(
        process.env.PHONEPE_CLIENT_VERSION
      );

      const { StandardCheckoutClient, Env } = await import(
        "@phonepe-pg/pg-sdk-node"
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
// Initiate PhonePe checkout and save a pending donation.

const createOrder = async (req, res) => {

   console.log("🔥 PHONEPE CREATE ORDER CONTROLLER CALLED");
  let donation = null;

  try {
    const {
      donorName,
      email,
      phone = "",
      amount,
      donationType,
    } = req.body;

    const idempotencyKey = req.get("Idempotency-Key");

    // Idempotency key validation
    if (
      typeof idempotencyKey !== "string" ||
      idempotencyKey.length < 8 ||
      idempotencyKey.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid Idempotency-Key header is required.",
      });
    }

    // Name validation
    if (
      typeof donorName !== "string" ||
      donorName.trim().length < 2 ||
      donorName.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name.",
      });
    }

    // Email validation
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Phone validation
    if (
      typeof phone !== "string" ||
      phone.trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    // Amount validation
    if (
      typeof amount !== "number" ||
      !Number.isSafeInteger(amount) ||
      amount < 99
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum donation is ₹99 in whole rupees.",
      });
    }

    // Only one-time donations are supported
    if (donationType !== "once") {
      return res.status(400).json({
        success: false,
        message:
          "Monthly recurring donations are not enabled yet. Please select Give Once.",
      });
    }

    // Check duplicate request
    const existing = await Donation.findOne({ idempotencyKey });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "This donation request already exists. Please start a new payment attempt.",
        donationId: existing._id,
        status: existing.status,
      });
    }

    // Frontend URL
    const frontendUrl = process.env.CLIENT_URL;

    if (!frontendUrl) {
      throw new Error("CLIENT_URL is not configured.");
    }

    const redirectPath =
      process.env.PHONEPE_REDIRECT_PATH ||
      "/donation/payment-result";

    const redirectUrl = new URL(redirectPath, frontendUrl);

    console.log(
  "PHONEPE RETURN REDIRECT URL:",
  redirectUrl.toString()
);
    // Generate unique merchant order ID
    const merchantOrderId = `DON_${crypto.randomUUID()}`;

    redirectUrl.searchParams.set(
      "merchantOrderId",
      merchantOrderId
    );

    // Save donation before contacting PhonePe
    donation = await Donation.create({
      donorName: donorName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      amount,
      donationType,
      status: "pending",
      paymentProvider: "phonepe",
      paymentOrderId: merchantOrderId,
      merchantOrderId,
      currency: "INR",
      idempotencyKey,
    });

    // Initialize PhonePe client
    const client = await getPhonePeClient();

    const { StandardCheckoutPayRequest } = await import(
      "@phonepe-pg/pg-sdk-node"
    );

    // Create PhonePe checkout request (amount in paise)
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100)
      .redirectUrl(redirectUrl.toString())
      .build();

    const paymentResponse = await client.pay(request);

    if (!paymentResponse?.redirectUrl) {
      throw new Error("PhonePe did not return a checkout URL.");
    }

    return res.status(201).json({
      success: true,
      message: "PhonePe payment initiated successfully.",
      checkoutUrl: paymentResponse.redirectUrl,
      merchantOrderId,
      orderId: merchantOrderId,
      donationId: donation._id,
      amount: donation.amount,
      currency: "INR",
    });

  } catch (error) {
    console.error(
      "PhonePe create order error:",
      error.message
    );

    // Duplicate key handling
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    // Reconcile order if donation was already created
    if (donation?.merchantOrderId) {
      try {
        const client = await getPhonePeClient();

        const status = await client.getOrderStatus(
          donation.merchantOrderId
        );

        const state = String(
          status?.state || ""
        ).toUpperCase();

        if (state === "COMPLETED") {
          console.error(
            "Payment completed. Reconciliation required:",
            donation._id.toString()
          );
        } else if (state === "FAILED") {
          await Donation.updateOne(
            {
              _id: donation._id,
              status: "pending",
            },
            {
              $set: { status: "failed" },
            }
          );
        } else {
          console.log(
            "PhonePe order is still processing:",
            donation.merchantOrderId
          );
        }
      } catch (statusError) {
        console.error(
          "PhonePe status reconciliation error:",
          statusError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to initiate payment. Please try again.",
    });
  }
};


// Verify payment using PhonePe's server-side order status.

const verifyPayment = async (req, res) => {
  try {
    const merchantOrderId =
      req.body.merchantOrderId || req.body.orderId;

    // Validate merchant order ID
    if (
      typeof merchantOrderId !== "string" ||
      !/^DON_[a-f0-9-]{36}$/i.test(merchantOrderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid merchant order ID.",
      });
    }

    // Find donation
    const donation = await Donation.findOne({
      merchantOrderId,
      paymentProvider: "phonepe",
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation order not found.",
      });
    }

    // Already completed
    if (donation.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment was already verified.",
        donationId: donation._id,
        status: "completed",
      });
    }

    if (donation.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Donation is not awaiting payment.",
        status: donation.status,
      });
    }

    // Verify directly with PhonePe
    const client = await getPhonePeClient();

    const orderStatus = await client.getOrderStatus(
      merchantOrderId
    );

    const state = String(
      orderStatus?.state || ""
    ).toUpperCase();

    // COMPLETED PAYMENT
    if (state === "COMPLETED") {
      const expectedAmount = donation.amount * 100;

      // Amount must be present and must match
      if (
        orderStatus.amount == null ||
        Number(orderStatus.amount) !== expectedAmount
      ) {
        console.error(
          "PhonePe amount verification failed:",
          merchantOrderId
        );

        return res.status(400).json({
          success: false,
          message: "Payment amount verification failed.",
        });
      }

      // Find a completed transaction detail
      const completedPayment =
        orderStatus.paymentDetails?.find(
          (item) =>
            String(item.state || "").toUpperCase() ===
              "COMPLETED" &&
            item.transactionId
        );

      const transactionId =
        completedPayment?.transactionId;

      // Update only if donation is still pending
      const updateFields = {
        status: "completed",
        paidAt: new Date(),
      };

      // Store actual PhonePe transaction ID only
      if (transactionId) {
        updateFields.paymentReference = transactionId;
      }

      const updated = await Donation.findOneAndUpdate(
        {
          _id: donation._id,
          status: "pending",
          paymentProvider: "phonepe",
        },
        {
          $set: updateFields,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // Handle webhook / verification race condition
      if (!updated) {
        const current = await Donation.findById(
          donation._id
        );

        if (current?.status === "completed") {
          return res.status(200).json({
            success: true,
            message: "Payment was already verified.",
            donationId: current._id,
            status: "completed",
          });
        }

        return res.status(409).json({
          success: false,
          message: "Donation status changed. Please check again.",
          status: current?.status,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Payment verified successfully. Thank you for donating!",
        donationId: updated._id,
        amount: updated.amount,
        status: updated.status,
        paidAt: updated.paidAt,
      });
    }

    // FAILED PAYMENT
    if (state === "FAILED") {
      await Donation.updateOne(
        {
          _id: donation._id,
          status: "pending",
        },
        {
          $set: {
            status: "failed",
          },
        }
      );

      // Check latest status in case webhook updated it
      const current = await Donation.findById(
        donation._id
      );

      if (current?.status === "completed") {
        return res.status(200).json({
          success: true,
          message: "Payment was already completed.",
          donationId: current._id,
          status: "completed",
        });
      }

      return res.status(200).json({
        success: false,
        message: "PhonePe reports that the payment failed.",
        donationId: current._id,
        status: current.status,
      });
    }

    // PENDING / UNKNOWN
    return res.status(202).json({
      success: false,
      message:
        "Payment is still being processed. Please check again.",
      donationId: donation._id,
      status: "pending",
      paymentState: state || "UNKNOWN",
    });

  } catch (error) {
    console.error(
      "PhonePe verify payment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment right now. Please check again later.",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
