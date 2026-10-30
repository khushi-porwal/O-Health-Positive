


// const Donation = require("../../models/donate/Donation");

// const createDonation = async (req, res) => {
//   try {
//     const {
//       donorName,
//       email,
//       phone,
//       amount,
//       donationType,
//     } = req.body;

//     // 1. Required fields validation
//     if (
//       !donorName ||
//       !email ||
//       amount === undefined ||
//       amount === null ||
//       !donationType
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, email, amount and donation type are required.",
//       });
//     }

//     // 2. Validate donor name
//     if (
//       typeof donorName !== "string" ||
//       donorName.trim().length < 2 ||
//       donorName.trim().length > 100
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid name.",
//       });
//     }

//     // 3. Validate email
//     if (
//       typeof email !== "string" ||
//       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//     }

//     // 4. Validate phone (optional)
//     if (
//       phone !== undefined &&
//       phone !== null &&
//       typeof phone !== "string"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid phone number.",
//       });
//     }

//     if (typeof phone === "string" && phone.trim().length > 20) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number cannot exceed 20 characters.",
//       });
//     }

//     // 5. Validate donation amount
//     if (
//       typeof amount !== "number" ||
//       !Number.isSafeInteger(amount) ||
//       amount < 500
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Donation amount must be an integer of at least ₹500.",
//       });
//     }

//     // 6. Validate donation type
//     if (!["once", "monthly"].includes(donationType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Donation type must be once or monthly.",
//       });
//     }

//     // 7. Save donation request
//     // Payment integration will be added later.
//     const donation = await Donation.create({
//       donorName: donorName.trim(),
//       email: email.trim().toLowerCase(),
//       phone: typeof phone === "string" ? phone.trim() : "",
//       amount,
//       donationType,
//       status: "pending",
//     });

//     // 8. Send response
//     return res.status(201).json({
//       success: true,
//       message:
//         donationType === "monthly"
//           ? "Monthly donation request saved successfully. Payment is pending."
//           : "Donation request saved successfully. Payment is pending.",
//       donation: {
//         id: donation._id,
//         donorName: donation.donorName,
//         email: donation.email,
//         phone: donation.phone,
//         amount: donation.amount,
//         donationType: donation.donationType,
//         status: donation.status,
//         createdAt: donation.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Create donation error:", error);

//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid donation details.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Unable to create donation. Please try again.",
//     });
//   }
// };

// module.exports = { createDonation };




const Donation = require("../../models/donate/Donation");

const createDonation = async (req, res) => {
 
  console.log("⚠️ OLD CREATE DONATION CONTROLLER CALLED");

  // Existing code
  try {
    const {
      donorName,
      email,
      phone = "",
      amount,
      donationType,
    } = req.body;

    // 1. Required fields
    if (
      !donorName ||
      !email ||
      amount === undefined ||
      amount === null ||
      !donationType
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, amount and donation type are required.",
      });
    }

    // 2. Validate name
    if (
      typeof donorName !== "string" ||
      donorName.trim().length < 2 ||
      donorName.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name.",
      });
    }

    // 3. Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // 4. Validate optional phone
    if (
      typeof phone !== "string" ||
      phone.trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    // 5. Validate amount: minimum ₹99
    if (
      typeof amount !== "number" ||
      !Number.isSafeInteger(amount) ||
      amount < 99
    ) {
      return res.status(400).json({
        success: false,
        message: "Donation amount must be a whole number of at least ₹99.",
      });
    }

    // 6. Validate donation type
    if (!["once", "monthly"].includes(donationType)) {
      return res.status(400).json({
        success: false,
        message: "Donation type must be once or monthly.",
      });
    }

    // 7. Save as pending only.
    // Payment order creation and verification will be handled
    // by the dedicated payment controller.
    const donation = await Donation.create({
      donorName: donorName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      amount,
      donationType,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Donation record created. Payment is still pending.",
      donation: {
        id: donation._id,
        donorName: donation.donorName,
        email: donation.email,
        amount: donation.amount,
        donationType: donation.donationType,
        status: donation.status,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error("Create donation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid donation details.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create donation. Please try again.",
    });
  }
};

module.exports = { createDonation };
