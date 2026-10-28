
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },

    coverImage: {
      type: String,
      required: [true, "Blog cover image is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
      enum: [
        "Health Awareness",
        "Healthcare",
        "Community Impact",
        "NGO Stories",
        "News & Updates",
        "Other",
      ],
    },

    author: {
      type: String,
      default: "O Positive Health Team",
      trim: true,
    },

    readingTime: {
      type: Number,
      default: 1,
      min: [1, "Reading time must be at least 1 minute"],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Blog", blogSchema);
