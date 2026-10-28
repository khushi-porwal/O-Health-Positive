
import api from "./api";

// Get all blogs, including drafts (admin only)
export const getAdminBlogs = async () => {
  const response = await api.get("/blogs/admin/all");
  return response.data;
};

// Create a new blog
export const createBlog = async (blogData) => {
  const response = await api.post("/blogs", blogData);
  return response.data;
};

// Update an existing blog
export const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blogs/${id}`, blogData);
  return response.data;
};

// Delete a blog
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

// Get published blogs (public website)
export const getPublishedBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

// Get one published blog by slug
export const getBlogBySlug = async (slug) => {
  const response = await api.get(
    `/blogs/${encodeURIComponent(slug)}`
  );
  return response.data;
};
