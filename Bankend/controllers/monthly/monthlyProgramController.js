
const mongoose = require("mongoose");
const MonthlyProgram = require("../../models/monthly/MonthlyProgram");

// Public website: active programs
const getMonthlyPrograms = async (req, res) => {
  try {
    const programs = await MonthlyProgram.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
      console.log(
  "Public programs fetched:",
  programs.length,
  "Database:",
  mongoose.connection.name
);

    return res.status(200).json({ success: true, programs });
  } catch (error) {
    console.error("Get monthly programs error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch monthly programs.",
    });
  }
};

// Admin: all programs, including inactive ones
const getAllMonthlyPrograms = async (req, res) => {
  try {
    const programs = await MonthlyProgram.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, programs });
  } catch (error) {
    console.error("Get all monthly programs error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch programs.",
    });
  }
};

// Admin: create a program
const createMonthlyProgram = async (req, res) => {
  try {
    console.log("CREATE MONTHLY PROGRAM API HIT");
    console.log("Request body:", req.body);
    console.log("Database:", mongoose.connection.name);
    console.log("Collection:", MonthlyProgram.collection.name);

    const { title, category, image, description } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof category !== "string" || !category.trim() ||
      typeof image !== "string" || !image.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required.",
      });
    }

    const program = await MonthlyProgram.create({
      title: title.trim(),
      category: category.trim(),
      image: image.trim(),
      description:
        typeof description === "string" ? description.trim() : "",
      isActive: true,
    });

    console.log("PROGRAM SAVED SUCCESSFULLY:", program.toObject());

    return res.status(201).json({
      success: true,
      message: "Monthly program created successfully.",
      program,
    });
  } catch (error) {
    console.error("CREATE MONTHLY PROGRAM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create monthly program.",
    });
  }
};

// Admin: edit a program
const updateMonthlyProgram = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
    }

    const allowedFields = [
      "title",
      "category",
      "image",
      "description",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No program details provided to update.",
      });
    }

    for (const field of ["title", "category", "image"]) {
      if (field in updates) {
        if (
          typeof updates[field] !== "string" ||
          !updates[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} is required.`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    if (
      "description" in updates &&
      typeof updates.description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be text.",
      });
    }

    if ("description" in updates) {
      updates.description = updates.description.trim();
    }

    if (
      "isActive" in updates &&
      typeof updates.isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const program = await MonthlyProgram.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Monthly program not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monthly program updated successfully.",
      program,
    });
  } catch (error) {
    console.error("Update monthly program error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update monthly program.",
    });
  }
};

// Admin: deactivate instead of permanently deleting
const deleteMonthlyProgram = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
    }

    const program = await MonthlyProgram.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Monthly program not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monthly program deactivated successfully.",
      program,
    });
  } catch (error) {
    console.error("Deactivate monthly program error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate monthly program.",
    });
  }
};

module.exports = {
  getMonthlyPrograms,
  getAllMonthlyPrograms,
  createMonthlyProgram,
  updateMonthlyProgram,
  deleteMonthlyProgram,
};
