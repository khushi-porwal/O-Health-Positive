
const express = require("express");
const router = express.Router();

const {
  createBlog,
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blog/BlogController");

const { protectAdmin } = require("../../middleware/auth/authMiddleware");

// Public routes
router.get("/", getPublishedBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.get("/admin/all", protectAdmin, getAllBlogsAdmin);
router.post("/", protectAdmin, createBlog);
router.put("/:id", protectAdmin, updateBlog);
router.delete("/:id", protectAdmin, deleteBlog);

module.exports = router;
