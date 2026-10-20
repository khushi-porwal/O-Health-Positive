
const Volunteer = require("../../models/volunteer/Volunteer");
const sendEmail = require("../../utils/sendEmail");

const ALLOWED_STATUSES = ["Pending", "Approved", "Rejected"];

// Public: Register a volunteer
const registerVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      interest,
      motivation,
    } = req.body;

    // 1. Validate required fields
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !interest ||
      !motivation?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // 2. Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 3. Save volunteer in MongoDB
    const volunteer = await Volunteer.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      interest,
      motivation: motivation.trim(),
    });

    // 4. Send email notification to admin
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is missing in .env");
      }

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Volunteer Registration - O Positive Health",
        text: [
          "A new volunteer application has been submitted.",
          "",
          `Name: ${volunteer.fullName}`,
          `Email: ${volunteer.email}`,
          `Phone: ${volunteer.phone}`,
          `City: ${volunteer.city}`,
          `Area of Interest: ${volunteer.interest}`,
          "",
          "Motivation:",
          volunteer.motivation,
          "",
          `Volunteer ID: ${volunteer._id}`,
          `Status: ${volunteer.status || "Pending"}`,
          `Submitted: ${volunteer.createdAt || new Date().toISOString()}`,
          "",
          "Please review this application in the admin dashboard.",
        ].join("\n"),
      });

      console.log(
        "Volunteer registration notification email sent successfully"
      );
    } catch (emailError) {
      // Email fail hone par bhi registration saved rahega
      console.error(
        "Volunteer notification email failed:",
        emailError.message
      );
    }

    // 5. Respond to visitor
    return res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully!",
      data: volunteer,
    });
  } catch (error) {
    console.error("Volunteer registration error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit your application. Please try again.",
    });
  }
};


// Admin: Get all volunteer applications
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    console.error("Get volunteers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch volunteer applications.",
    });
  }
};

// Admin: Update application status
const updateVolunteerStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Pending, Approved or Rejected.",
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Volunteer status updated successfully.",
      data: volunteer,
    });
  } catch (error) {
   
    console.error("Update volunteer status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update volunteer status.",
    });
  }
};

// Admin: Delete a volunteer application
const deleteVolunteer = async (req, res) => {
  try {
    const id = req.params.id;
    const volunteer = await Volunteer.findByIdAndDelete(
      id
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Volunteer application deleted successfully.",
    });
  } catch (error) {

    console.error("Delete volunteer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete volunteer application.",
    });
  }
};

module.exports = {
  registerVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
};
