
const mongoose = require("mongoose");
const Vendor = require("../../models/vendor/Vendor");
const VendorNomination = require("../../models/vendor/VendorNomination");

// Helpers
const isValidId = (id) => mongoose.isValidObjectId(id);

const parseBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return fallback;
};

const validateProducts = (items) => {
  if (!Array.isArray(items)) {
    return { error: "Items must be an array" };
  }

  const normalized = [];

  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { error: "Each product must be an object" };
    }

    const name =
      typeof item.name === "string" ? item.name.trim() : "";

    const description =
      typeof item.description === "string"
        ? item.description.trim()
        : "";

    const image =
      typeof item.image === "string" ? item.image.trim() : "";

    const price = Number(item.price);
    const stock = Number(item.stock ?? 0);

    if (!name) {
      return { error: "Every product needs a name" };
    }

    if (!Number.isFinite(price) || price < 0) {
      return { error: `Invalid price for product: ${name}` };
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return { error: `Invalid stock for product: ${name}` };
    }

    normalized.push({
      name,
      description,
      price,
      image,
      stock,
      isActive: parseBoolean(item.isActive, true),
    });
  }

  return { items: normalized };
};

const validateAmount = (value, fieldName) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return { error: `Invalid ${fieldName}` };
  }

  return { value: amount };
};

// GET: Featured vendors for public website
exports.getFeaturedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      status: "approved",
      isFeatured: true,
    })
      .select("-items")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("Get featured vendors:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch featured vendors",
    });
  }
};

// GET: Public products for one approved vendor
// Route: GET /api/vendors/:id/products
exports.getVendorProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const vendor = await Vendor.findOne({
      _id: id,
      status: "approved",
    })
      .select("name title city category image items")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const items = (vendor.items || []).filter(
      (item) => item.isActive !== false
    );

    return res.status(200).json({
      success: true,
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        title: vendor.title,
        city: vendor.city,
        category: vendor.category,
        image: vendor.image,
      },
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get vendor products:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch vendor products",
    });
  }
};

// POST: Submit vendor nomination
exports.createNomination = async (req, res) => {
  try {
    const {
      vendorName,
      nominatorName,
      phoneNumber,
      vendorPhone,
      vendorLocation,
      productCategory,
      productsSold,
      description,
    } = req.body;

    const requiredFields = {
      vendorName,
      nominatorName,
      phoneNumber,
      vendorLocation,
      productCategory,
      productsSold,
      description,
    };

    const missing = Object.entries(requiredFields).some(
      ([, value]) =>
        typeof value !== "string" || !value.trim()
    );

    if (missing) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number",
      });
    }

    const nomination = await VendorNomination.create({
      vendorName: vendorName.trim(),
      nominatorName: nominatorName.trim(),
      phoneNumber: phoneNumber.trim(),
      vendorPhone:
        typeof vendorPhone === "string"
          ? vendorPhone.trim()
          : "",
      vendorLocation: vendorLocation.trim(),
      productCategory: productCategory.trim(),
      productsSold: productsSold.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Vendor nominated successfully",
      nominationId: nomination._id,
    });
  } catch (error) {
    console.error("Create nomination:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit nomination",
    });
  }
};

// GET: Admin views all nominations
exports.getAllNominations = async (req, res) => {
  try {
    const nominations = await VendorNomination.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      nominations,
    });
  } catch (error) {
    console.error("Get nominations:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch nominations",
    });
  }
};

// PATCH: Admin updates nomination status
exports.updateNominationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid nomination status",
      });
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid nomination ID",
      });
    }

    const nomination = await VendorNomination.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: "Nomination not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nomination status updated",
      nomination,
    });
  } catch (error) {
    console.error("Update nomination status:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update nomination",
    });
  }
};

// ADMIN: Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("Get all vendors:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch vendors",
    });
  }
};

// ADMIN: Create vendor with multiple products
exports.createVendor = async (req, res) => {
  try {
    const {
      name,
      title,
      story,
      image,
      city,
      category,
      products,
      items,
      goalAmount,
      raisedAmount,
      supportersCount,
      isFeatured,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof story !== "string" ||
      !story.trim() ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, title, story, city and category are required",
      });
    }

    if (
      image !== undefined &&
      typeof image !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Image must be a string URL",
      });
    }

    if (
      products !== undefined &&
      (!Array.isArray(products) ||
        !products.every(
          (product) => typeof product === "string"
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Products must be an array of tag strings",
      });
    }

    const goalResult = validateAmount(
      goalAmount ?? 0,
      "goal amount"
    );
    const raisedResult = validateAmount(
      raisedAmount ?? 0,
      "raised amount"
    );
    const supportersResult = validateAmount(
      supportersCount ?? 0,
      "supporters count"
    );

    if (
      goalResult.error ||
      raisedResult.error ||
      supportersResult.error ||
      !Number.isInteger(supportersResult.value)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid fundraising values",
      });
    }

    const productResult =
      items === undefined
        ? { items: [] }
        : validateProducts(items);

    if (productResult.error) {
      return res.status(400).json({
        success: false,
        message: productResult.error,
      });
    }

    const featured = parseBoolean(isFeatured);

    const vendor = await Vendor.create({
      name: name.trim(),
      title: title.trim(),
      story: story.trim(),
      image: image?.trim() || "",
      city: city.trim(),
      category: category.trim(),
      products: products || [],
      items: productResult.items,
      goalAmount: goalResult.value,
      raisedAmount: raisedResult.value,
      supportersCount: supportersResult.value,
      isFeatured: featured,
      status: featured ? "approved" : "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Vendor and products created successfully",
      vendor,
    });
  } catch (error) {
    console.error("Create vendor:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create vendor",
    });
  }
};

// ADMIN: Update vendor details and/or products
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const allowedFields = [
      "name",
      "title",
      "story",
      "image",
      "city",
      "category",
      "products",
      "goalAmount",
      "raisedAmount",
      "supportersCount",
      "isFeatured",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    // Validate product updates separately
    if (Object.prototype.hasOwnProperty.call(req.body, "items")) {
      const result = validateProducts(req.body.items);

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      updates.items = result.items;
    }

    for (const field of [
      "name",
      "title",
      "story",
      "city",
      "category",
    ]) {
      if (
        updates[field] !== undefined &&
        (typeof updates[field] !== "string" ||
          !updates[field].trim())
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} cannot be empty`,
        });
      }

      if (typeof updates[field] === "string") {
        updates[field] = updates[field].trim();
      }
    }

    if (
      updates.image !== undefined &&
      typeof updates.image !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Image must be a string URL",
      });
    }

    if (
      updates.products !== undefined &&
      (!Array.isArray(updates.products) ||
        !updates.products.every(
          (product) => typeof product === "string"
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Products must be an array of tag strings",
      });
    }

    for (const field of [
      "goalAmount",
      "raisedAmount",
      "supportersCount",
    ]) {
      if (updates[field] !== undefined) {
        const result = validateAmount(updates[field], field);

        if (
          result.error ||
          (field === "supportersCount" &&
            !Number.isInteger(result.value))
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${field}`,
          });
        }

        updates[field] = result.value;
      }
    }

    if (updates.isFeatured !== undefined) {
      if (
        typeof updates.isFeatured !== "boolean" &&
        !["true", "false", "1", "0", 1, 0].includes(
          updates.isFeatured
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid featured value",
        });
      }

      updates.isFeatured = parseBoolean(updates.isFeatured);
    }

    if (
      updates.status !== undefined &&
      !["pending", "approved", "rejected"].includes(
        updates.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor status",
      });
    }

    if (updates.isFeatured === true) {
      updates.status = "approved";
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor,
    });
  } catch (error) {
    console.error("Update vendor:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update vendor",
    });
  }
};

// ADMIN: Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID",
      });
    }

    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Delete vendor:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete vendor",
    });
  }
};
