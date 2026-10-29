
const crypto = require("crypto");
const Donation = require("../../models/donate/Donation");

let phonePeClientPromise;

const getPhonePeClient = async () => {
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION);
  const environment = process.env.PHONEPE_ENV || "SANDBOX";

  if (
    !clientId ||
    !clientSecret ||
    !Number.isInteger(clientVersion) ||
    clientVersion <= 0
  ) {
    throw new Error("PhonePe credentials or client version are missing.");
  }

  const { StandardCheckoutClient, Env } = await import(
    "@phonepe-pg/pg-sdk-node"
  );

  const env =
    environment === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

  return StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env
  );
};

// Initiate PhonePe checkout and save a pending donation.
const createOrder = async (req, res) => {
  let donation;

  try {
    const {
      donorName,
      email,
      phone = "",
      amount,
      donationType,
    } = req.body;

    const idempotencyKey = req.get("Idempotency-Key");

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

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      typeof phone !== "string" ||
      phone.trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

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

    // Recurring payments require a separate AutoPay setup.
    if (donationType !== "once") {
      return res.status(400).json({
        success: false,
        message:
          "Monthly recurring donations are not enabled yet. Please select Give Once.",
      });
    }

    // Prevent duplicate donation creation for a repeated request.
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

    const client = await getPhonePeClient();

    const frontendUrl = process.env.CLIENT_URL;
    const redirectPath =
      process.env.PHONEPE_REDIRECT_PATH || "/donation/payment-result";

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured.");
    }

    // Unique merchant order ID generated on the server.
    const merchantOrderId = `DON_${crypto.randomUUID()}`;

    const redirectUrl = new URL(redirectPath, frontendUrl);
    redirectUrl.searchParams.set("merchantOrderId", merchantOrderId);

    // Store the donation before contacting the gateway.
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

    const { StandardCheckoutPayRequest } = await import(
      "@phonepe-pg/pg-sdk-node"
    );

    // PhonePe expects the amount in paise, not rupees.
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100)
      .redirectUrl(redirectUrl.toString())
      .build();

    const paymentResponse = await client.pay(request);

    if (!paymentResponse || !paymentResponse.redirectUrl) {
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
    console.error("PhonePe create order error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This donation request already exists. Please retry with a new payment attempt.",
      });
    }

    // Do not leave an unusable pending record if initiation failed.
    // A network error can be ambiguous, so check PhonePe status before
    // retrying a payment if the order may have been created.
    if (donation && donation.paymentOrderId) {
      try {
        const client = await getPhonePeClient();
        const status = await client.getOrderStatus(
          donation.paymentOrderId
        );

        if (status.state === "COMPLETED") {
          console.error(
            "PhonePe order may have completed; reconcile donation:",
            donation._id.toString()
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
      message:
        "Unable to initiate payment. Check the payment status before retrying.",
    });
  }
};

// Verify payment using PhonePe's server-side order status.
const verifyPayment = async (req, res) => {
  try {
    const merchantOrderId =
      req.body.merchantOrderId || req.body.orderId;

    if (
      typeof merchantOrderId !== "string" ||
      !/^DON_[a-f0-9-]{36}$/i.test(merchantOrderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid merchant order ID.",
      });
    }

    const donation = await Donation.findOne({
      $or: [
        { merchantOrderId },
        { paymentOrderId: merchantOrderId },
      ],
      paymentProvider: "phonepe",
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation order not found.",
      });
    }

    // Check PhonePe directly; do not trust the browser's success message.
    const client = await getPhonePeClient();
    const orderStatus = await client.getOrderStatus(merchantOrderId);

    const state = String(orderStatus.state || "").toUpperCase();

    if (state === "COMPLETED") {
      // Check the amount if PhonePe returns it.
      if (
        orderStatus.amount != null &&
        Number(orderStatus.amount) !== donation.amount * 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment amount does not match the donation.",
        });
      }

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

      const transactionId =
        orderStatus.paymentDetails?.find(
          (item) => item.transactionId
        )?.transactionId || merchantOrderId;

      const updated = await Donation.findOneAndUpdate(
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
          runValidators: true,
        }
      );

      if (!updated) {
        const current = await Donation.findById(donation._id);

        if (current?.status === "completed") {
          return res.status(200).json({
            success: true,
            message: "Payment was already verified.",
            donationId: current._id,
            status: current.status,
          });
        }

        return res.status(409).json({
          success: false,
          message: "Donation status changed. Please check again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully. Thank you for donating!",
        donationId: updated._id,
        amount: updated.amount,
        status: updated.status,
        paidAt: updated.paidAt,
      });
    }

    if (state === "FAILED") {
      // Never overwrite a completed donation with a failed status.
      if (donation.status === "completed") {
        return res.status(200).json({
          success: true,
          message: "Payment was already completed.",
          donationId: donation._id,
          status: "completed",
        });
      }

      await Donation.updateOne(
        { _id: donation._id, status: "pending" },
        { $set: { status: "failed" } }
      );

      return res.status(200).json({
        success: false,
        message: "PhonePe reports that the payment failed.",
        donationId: donation._id,
        status: "failed",
      });
    }

    // PENDING or any unrecognized state must not be marked successful.
    return res.status(202).json({
      success: false,
      message: "Payment is still being processed. Please check again.",
      donationId: donation._id,
      status: "pending",
      paymentState: state || "UNKNOWN",
    });
  } catch (error) {
    console.error("PhonePe verify payment error:", error.message);

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
