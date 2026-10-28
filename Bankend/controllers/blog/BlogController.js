
const Blog = require("../../models/blog/Blog");

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author,
      readingTime,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    if (
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !coverImage ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required blog fields.",
      });
    }

    const existingBlog = await Blog.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists.",
      });
    }

    const blog = await Blog.create({
      title,
      slug: slug.trim().toLowerCase(),
      excerpt,
      content,
      coverImage,
      category,
      author,
      readingTime,
      status,
      publishedAt:
        status === "published" ? new Date() : null,
      metaTitle,
      metaDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create blog.",
    });
  }
};

// GET ALL PUBLISHED BLOGS (PUBLIC)
const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Get published blogs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch blogs.",
    });
  }
};

// GET SINGLE PUBLISHED BLOG BY SLUG (PUBLIC)
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Get blog error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch blog.",
    });
  }
};

// GET ALL BLOGS (ADMIN)
const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Admin get blogs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin blogs.",
    });
  }
};

// UPDATE BLOG (ADMIN)
const updateBlog = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Never allow clients to change MongoDB-managed fields.
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.slug !== undefined) {
      updates.slug = updates.slug.trim().toLowerCase();

      if (!updates.slug) {
        return res.status(400).json({
          success: false,
          message: "Slug cannot be empty.",
        });
      }
    }

    const allowedFields = [
      "title",
      "slug",
      "excerpt",
      "content",
      "coverImage",
      "category",
      "author",
      "readingTime",
      "status",
      "publishedAt",
      "metaTitle",
      "metaDescription",
    ];

    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields.",
        fields: invalidFields,
      });
    }

    const currentBlog = await Blog.findById(req.params.id);

    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (
      updates.status === "published" &&
      currentBlog.status !== "published" &&
      !updates.publishedAt
    ) {
      updates.publishedAt = new Date();
    }

    if (updates.status === "draft") {
      updates.publishedAt = null;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog data or blog ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update blog.",
    });
  }
};

// DELETE BLOG (ADMIN)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Delete blog error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete blog.",
    });
  }
};

module.exports = {
  createBlog,
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
};
