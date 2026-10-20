
const Contact = require("../../models/contact/Contact");
const sendEmail = require("../../utils/sendEmail");

// 1. Public: Create contact enquiry

const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, subject and message are required",
      });
    }

    // 2. Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // 3. Save enquiry in MongoDB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // 4. Send email notification to admin
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is missing in .env");
      }

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Enquiry - O Positive Health",
        text: [
          "A new contact enquiry has been submitted.",
          "",
          `Name: ${contact.name}`,
          `Email: ${contact.email}`,
          `Phone: ${contact.phone}`,
          `Subject: ${contact.subject}`,
          `Message: ${contact.message}`,
          "",
          `Enquiry ID: ${contact._id}`,
          `Submitted: ${contact.createdAt}`,
          "",
          "Please review this enquiry in the admin dashboard.",
        ].join("\n"),
      });

      console.log("Admin notification email sent successfully");
    } catch (emailError) {
      // Email fail hone par bhi enquiry saved rahegi
      console.error(
        "Admin notification email failed:",
        emailError.message
      );
    }

    // 5. Send success response to visitor
    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully",
      data: {
        id: contact._id,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error("Contact API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry right now",
    });
  }
};


// 2. Admin: Get all contact enquiries
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Contacts fetched successfully",
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Get contacts error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact enquiries"
        });
    }
};

// 3. Admin: Get a contact enquiry by ID
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact fetched successfully",
            data: contact
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        console.error("Get contact by ID error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact enquiry"
        });
    }
};

// 4. Admin: Update contact status
const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact status"
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact status updated successfully",
            data: contact
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        console.error("Update contact status error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update contact status"
        });
    }
};

// 5. Admin: Delete contact enquiry
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            data: contact
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        console.error("Delete contact error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete contact enquiry"
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
