
const Volunteer = require("../../models/volunteer/Volunteer");

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

    const volunteer = await Volunteer.create({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      interest,
      motivation: motivation.trim(),
    });

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
