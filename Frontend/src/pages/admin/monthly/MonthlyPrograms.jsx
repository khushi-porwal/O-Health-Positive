
import { useCallback, useEffect, useState } from "react";
import api from "../../../services/api";
import "./MonthlyPrograms.css";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  image: "",
};

function MonthlyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeCount = programs.filter((p) => p.isActive).length;

  // Fetch saved programs from the backend
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/monthly-programs");
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || "Unable to load programs.");
      }

      setPrograms(Array.isArray(data.programs) ? data.programs : []);
    } catch (err) {
      console.error("Fetch monthly programs error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load monthly programs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (program) => {
    setForm({
      title: program.title || "",
      category: program.category || "",
      description: program.description || "",
      image: program.image || "",
    });
    setEditingId(program._id || program.id);
    setError("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  // Create or update in MongoDB
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.image.trim()
    ) {
      setError("Please fill in the title, category and image URL.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
      };

      const response = editingId
        ? await api.patch(
            `/admin/monthly-programs/${editingId}`,
            payload
          )
        : await api.post("/admin/monthly-programs", payload);

      if (response.data.success === false) {
        throw new Error(
          response.data.message || "Unable to save program."
        );
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      // Reload the persisted data rather than relying on local state
      await fetchPrograms();
    } catch (err) {
      console.error("Save monthly program error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save monthly program."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleProgram = async (program) => {
    const id = program._id || program.id;

    try {
      setError("");

      const response = await api.patch(
        `/admin/monthly-programs/${id}`,
        { isActive: !program.isActive }
      );

      if (response.data.success === false) {
        throw new Error(response.data.message || "Unable to update program.");
      }

      await fetchPrograms();
    } catch (err) {
      console.error("Toggle program error:", err);
      setError(
        err.response?.data?.message || "Unable to update program."
      );
    }
  };

  const deleteProgram = async (program) => {
    if (!window.confirm(`Deactivate "${program.title}"?`)) {
      return;
    }

    try {
      setError("");

      const id = program._id || program.id;
      const response = await api.delete(
        `/admin/monthly-programs/${id}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message || "Unable to deactivate program.");
      }

      await fetchPrograms();
    } catch (err) {
      console.error("Deactivate program error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to deactivate program."
      );
    }
  };

  return (
    <div className="mp-page">
      <header className="mp-header">
        <div>
          <span className="mp-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Monthly Programs</h1>
          <p>
            Create and manage the monthly donation programs
            displayed on your website.
          </p>
        </div>

        <button
          type="button"
          className="mp-primary-btn"
          onClick={openAddForm}
        >
          <span aria-hidden="true">＋</span> Add Program
        </button>
      </header>

      {error && (
        <p className="mp-error" role="alert">
          {error}
          <button type="button" onClick={fetchPrograms}>
            Retry
          </button>
        </p>
      )}

      <div className="mp-stats">
        <article className="mp-stat-card">
          <span>Total Programs</span>
          <strong>{programs.length}</strong>
        </article>
        <article className="mp-stat-card">
          <span>Active Programs</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="mp-stat-card">
          <span>Inactive Programs</span>
          <strong>{programs.length - activeCount}</strong>
        </article>
      </div>

      {showForm && (
        <section className="mp-form-panel">
          <div className="mp-panel-heading">
            <div>
              <h2>{editingId ? "Edit Program" : "Add New Program"}</h2>
              <p>Enter the details you want visitors to see.</p>
            </div>

            <button
              type="button"
              className="mp-close-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mp-form">
            <div className="mp-field">
              <label htmlFor="mp-title">Program Title *</label>
              <input
                id="mp-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g. Save Our Stray Dogs"
                required
              />
            </div>

            <div className="mp-field">
              <label htmlFor="mp-category">Category *</label>
              <input
                id="mp-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                maxLength={80}
                placeholder="e.g. Animal Healthcare"
                required
              />
            </div>

            <div className="mp-field mp-field-full">
              <label htmlFor="mp-image">Image URL *</label>
              <input
                id="mp-image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>

            {form.image.trim() && (
              <div className="mp-image-preview">
                <span>Image preview</span>
                <img
                  src={form.image}
                  alt="Program preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}

            <div className="mp-field mp-field-full">
              <label htmlFor="mp-description">Description</label>
              <textarea
                id="mp-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={2000}
                rows={4}
                placeholder="Describe this program..."
              />
            </div>

            <div className="mp-form-actions">
              <button
                type="button"
                className="mp-secondary-btn"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mp-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Program"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mp-list-panel">
        <div className="mp-list-heading">
          <div>
            <h2>All Programs</h2>
            <p>Manage the programs shown on your public website.</p>
          </div>
          <span className="mp-count">
            {programs.length} programs
          </span>
        </div>

        {loading ? (
          <div className="mp-empty">
            <p>Loading monthly programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="mp-empty">
            <div className="mp-empty-icon">♡</div>
            <h3>No programs added yet</h3>
            <p>
              Create your first monthly donation program to get started.
            </p>
            <button
              type="button"
              className="mp-primary-btn"
              onClick={openAddForm}
            >
              ＋ Create First Program
            </button>
          </div>
        ) : (
          <div className="mp-grid">
            {programs.map((program) => {
              const id = program._id || program.id;

              return (
                <article className="mp-card" key={id}>
                  <div className="mp-card-image">
                    <img
                      src={program.image}
                      alt={program.title}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span
                      className={`mp-status ${
                        program.isActive ? "is-active" : "is-inactive"
                      }`}
                    >
                      {program.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mp-card-content">
                    <span className="mp-category">
                      {program.category}
                    </span>
                    <h3>{program.title}</h3>
                    <p className="mp-description">
                      {program.description || "No description added."}
                    </p>

                    <div className="mp-card-actions">
                      <button
                        type="button"
                        className="mp-secondary-btn"
                        onClick={() => openEditForm(program)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="mp-secondary-btn"
                        onClick={() => toggleProgram(program)}
                      >
                        {program.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        className="mp-delete-btn"
                        onClick={() => deleteProgram(program)}
                      >
                        Deactivate / Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default MonthlyPrograms;
