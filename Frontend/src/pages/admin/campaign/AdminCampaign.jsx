
import React, { useEffect, useState } from "react";
import {
  createCampaign,
  getAdminCampaigns,
  deleteCampaign,
  updateCampaign,
} from "../../../services/campaignService";
import "./AdminCampaign.css"
const categories = [
  "Urgent",
  "Children",
  "Animals",
  "Disability",
  "Disaster Relief",
  "Education",
  "Elderly",
  "Faith",
  "Hunger",
  "Medical",
  "DIY",
  "Women",
  "Temples",
  "Community",
];

const initialForm = {
  title: "",
  description: "",
  category: "Urgent",
  image: "",
  goalAmount: "",
};

export default function AdminCampaigns() {
  const [form, setForm] = useState(initialForm);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCampaigns();
      setCampaigns(response.campaigns || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Campaigns load nahi ho paayi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (Number(form.goalAmount) <= 0) {
      setError("Goal amount zero se zyada hona chahiye.");
      return;
    }

    try {
      setSaving(true);

      await createCampaign({
        ...form,
        goalAmount: Number(form.goalAmount),
      });

      setForm(initialForm);
      setSuccess("Campaign successfully create ho gayi!");

      await loadCampaigns();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Campaign create nahi ho paayi."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (campaign) => {
    setError("");
    setSuccess("");

    const newStatus =
      campaign.status === "active" ? "paused" : "active";

    try {
      await updateCampaign(campaign._id, {
        status: newStatus,
      });

      setSuccess(`Campaign ${newStatus} ho gayi.`);
      await loadCampaigns();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Campaign status update nahi hua."
      );
    }
  };

  const handleDelete = async (campaign) => {
    const confirmed = window.confirm(
      `Delete "${campaign.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteCampaign(campaign._id);
      setSuccess("Campaign delete ho gayi.");
      await loadCampaigns();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Campaign delete nahi ho paayi."
      );
    }
  };

  return (
    <section className="admin-campaigns">
      <h1>Manage Campaigns</h1>
      <p>Create and manage campaigns for your website.</p>

      {error && <p role="alert" className="campaign-error">{error}</p>}
      {success && <p role="status" className="campaign-success">{success}</p>}

      <form onSubmit={handleSubmit} className="admin-campaign-form">
        <label htmlFor="title">Campaign title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter campaign title"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the campaign"
          rows={4}
          required
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="image">Campaign image URL</label>
        <input
          id="image"
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/campaign.jpg"
          required
        />

        {form.image && (
          <img
            src={form.image}
            alt="Campaign preview"
            style={{
              width: "180px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            onLoad={(event) => {
              event.currentTarget.style.display = "block";
            }}
          />
        )}

        <label htmlFor="goalAmount">Goal amount (₹)</label>
        <input
          id="goalAmount"
          name="goalAmount"
          type="number"
          min="1"
          step="1"
          value={form.goalAmount}
          onChange={handleChange}
          placeholder="50000"
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Campaign"}
        </button>
      </form>

      <div className="admin-campaign-list">
        <div className="admin-campaign-list-header">
          <h2>All Campaigns</h2>
          <button type="button" onClick={loadCampaigns}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p>No campaigns created yet.</p>
        ) : (
          campaigns.map((campaign) => (
            <article
              key={campaign._id}
              className="admin-campaign-item"
            >
              <div>
                <h3>{campaign.title}</h3>
                <p>{campaign.category}</p>
                <p>
                  Goal: ₹
                  {Number(campaign.goalAmount).toLocaleString("en-IN")}
                </p>
                <p>Status: {campaign.status}</p>
              </div>

              <div className="admin-campaign-actions">
                <button
                  type="button"
                  onClick={() => handleStatusChange(campaign)}
                >
                  {campaign.status === "active" ? "Pause" : "Activate"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(campaign)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
