
import { useCallback, useEffect, useState } from "react";
import {
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../../services/blogService";
import "./BlogManagement.css";

const INITIAL_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Health Awareness",
  author: "O Positive Health Team",
  readingTime: 3,
  status: "draft",
  metaTitle: "",
  metaDescription: "",
};

const CATEGORIES = [
  "Health Awareness",
  "Healthcare",
  "Community Impact",
  "NGO Stories",
  "News & Updates",
  "Other",
];

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminBlogs();
      setBlogs(Array.isArray(result?.blogs) ? result.blogs : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load blogs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleTitleChange = (event) => {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      ...(!slugManuallyEdited ? { slug: makeSlug(title) } : {}),
      ...(!current.metaTitle ? { metaTitle: title.slice(0, 60) } : {}),
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setForm((current) => ({
      ...current,
      [name]: name === "readingTime" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setSlugManuallyEdited(false);
  };

  const handleEdit = (blog) => {
    setForm({
      ...INITIAL_FORM,
      ...blog,
      readingTime: blog.readingTime || 3,
      status: blog.status || "draft",
      publishedAt: undefined,
    });

    setEditingId(blog._id);
    setSlugManuallyEdited(true);
    setError("");
    setSuccess("");

    document
      .getElementById("blog-editor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event, requestedStatus) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      slug: makeSlug(form.slug),
      status: requestedStatus,
      readingTime: Number(form.readingTime),
    };

    if (!payload.slug) {
      setError("Please enter a valid blog title or slug.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateBlog(editingId, payload);
        setSuccess(
          requestedStatus === "published"
            ? "Blog updated and published successfully!"
            : "Blog updated and saved as draft."
        );
      } else {
        await createBlog(payload);
        setSuccess(
          requestedStatus === "published"
            ? "Blog published successfully!"
            : "Blog saved as draft successfully!"
        );
      }

      resetForm();
      await loadBlogs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save blog. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Delete "${blog.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(blog._id);
    setError("");
    setSuccess("");

    try {
      await deleteBlog(blog._id);

      setBlogs((current) =>
        current.filter((item) => item._id !== blog._id)
      );

      if (editingId === blog._id) {
        resetForm();
      }

      setSuccess("Blog deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete blog."
      );
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not published";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="blog-management">
      <header className="blog-management-header">
        <div>
          <span className="blog-eyebrow">
            O POSITIVE HEALTH · CONTENT
          </span>
          <h1>Blog Management</h1>
          <p>Create, edit and publish healthcare articles.</p>
        </div>

        <button
          type="button"
          className="blog-refresh-btn"
          onClick={loadBlogs}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      <div className="blog-summary-grid">
        <article className="blog-summary-card">
          <span>Total blogs</span>
          <strong>{blogs.length}</strong>
        </article>

        <article className="blog-summary-card">
          <span>Published</span>
          <strong>
            {blogs.filter((blog) => blog.status === "published").length}
          </strong>
        </article>

        <article className="blog-summary-card">
          <span>Drafts</span>
          <strong>
            {blogs.filter((blog) => blog.status === "draft").length}
          </strong>
        </article>
      </div>

      {error && (
        <div className="blog-alert blog-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="blog-alert blog-alert-success" role="status">
          {success}
        </div>
      )}

      <section className="blog-editor-card" id="blog-editor">
        <div className="blog-section-heading">
          <div>
            <h2>{editingId ? "Edit Blog" : "Create New Blog"}</h2>
            <p>
              Add your article details below. Required fields are marked *.
            </p>
          </div>
        </div>

        <form
          className="blog-editor-form"
          onSubmit={(event) => handleSubmit(event, "draft")}
        >
          <div className="blog-form-grid">
            <label className="blog-field blog-field-full">
              Blog title *
              <input
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                maxLength={150}
                required
                placeholder="e.g. Understanding Preventive Healthcare"
              />
            </label>

            <label className="blog-field blog-field-full">
              URL slug *
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="understanding-preventive-healthcare"
              />
              <small>Used in the blog URL. Use letters, numbers and hyphens.</small>
            </label>

            <label className="blog-field">
              Category *
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="blog-field">
              Author
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                maxLength={100}
              />
            </label>

            <label className="blog-field blog-field-full">
              Cover image URL *
              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                required
                placeholder="https://example.com/blog-cover.jpg"
              />
            </label>

            {form.coverImage && (
              <div className="blog-image-preview blog-field-full">
                <img
                  src={form.coverImage}
                  alt="Blog cover preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}

            <label className="blog-field blog-field-full">
              Short description / Excerpt *
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                maxLength={300}
                rows={3}
                required
                placeholder="A short summary shown on the blog card..."
              />
              <small>{form.excerpt.length}/300 characters</small>
            </label>

            <label className="blog-field blog-field-full">
              Full article content *
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={10}
                required
                placeholder="Write the complete blog article here..."
              />
            </label>

            <label className="blog-field">
              Reading time (minutes)
              <input
                type="number"
                name="readingTime"
                value={form.readingTime}
                onChange={handleChange}
                min={1}
                required
              />
            </label>

            <label className="blog-field">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <small>
                Choose Published below to publish immediately.
              </small>
            </label>

            <label className="blog-field">
              SEO meta title
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                maxLength={60}
                placeholder="SEO title (up to 60 characters)"
              />
            </label>

            <label className="blog-field">
              SEO meta description
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                placeholder="Brief search result description"
              />
            </label>
          </div>

          <div className="blog-form-actions">
            {editingId && (
              <button
                type="button"
                className="blog-cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="blog-draft-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Save Changes as Draft"
                : "Save Draft"}
            </button>

            <button
              type="button"
              className="blog-publish-btn"
              disabled={saving}
              onClick={(event) => handleSubmit(event, "published")}
            >
              {saving
                ? "Please wait..."
                : editingId
                ? "Update & Publish"
                : "Publish Blog"}
            </button>
          </div>
        </form>
      </section>

      <section className="blog-list-card">
        <div className="blog-section-heading">
          <div>
            <h2>All Blogs</h2>
            <p>Manage your saved drafts and published articles.</p>
          </div>
          <span className="blog-count-badge">{blogs.length} total</span>
        </div>

        {loading ? (
          <div className="blog-empty-state">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="blog-empty-state">
            <span aria-hidden="true">✎</span>
            <h3>No blogs yet</h3>
            <p>Create your first blog using the form above.</p>
          </div>
        ) : (
          <div className="blog-table-wrapper">
            <table className="blog-table">
              <thead>
                <tr>
                  <th>Blog</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <div className="blog-table-title">
                        <strong>{blog.title}</strong>
                        <span>/{blog.slug}</span>
                      </div>
                    </td>

                    <td>{blog.category}</td>

                    <td>
                      <span
                        className={`blog-status ${
                          blog.status === "published"
                            ? "is-published"
                            : "is-draft"
                        }`}
                      >
                        {blog.status || "draft"}
                      </span>
                    </td>

                    <td>{formatDate(blog.publishedAt)}</td>

                    <td>
                      <div className="blog-row-actions">
                        <button
                          type="button"
                          className="blog-edit-btn"
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="blog-delete-btn"
                          onClick={() => handleDelete(blog)}
                          disabled={deletingId === blog._id}
                        >
                          {deletingId === blog._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default BlogManagement;
