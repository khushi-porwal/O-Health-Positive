
import React, { useEffect, useState } from "react";
import "./Campaigns.css";
import DonateNowButton from "../../common/donateButton/DonateNowButton";
import { getCampaigns } from "../../../services/campaignService";

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

function Campaigns() {
  const [activeCategory, setActiveCategory] = useState("Urgent");
  const [selectedImage, setSelectedImage] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch campaigns from backend
  useEffect(() => {
    let cancelled = false;

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCampaigns();

        const data = Array.isArray(response)
          ? response
          : response?.campaigns;

        if (!Array.isArray(data)) {
          throw new Error("Invalid campaigns response from server");
        }

        if (!cancelled) {
          setCampaigns(data);
        }
      } catch (err) {
        console.error("Campaign fetch error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load campaigns. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter campaigns by category
  const filteredCampaigns = campaigns.filter(
    (campaign) => campaign.category === activeCategory
  );

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleImageClick = (image) => {
    if (image) {
      setSelectedImage(image);
    }
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="campaign-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {categories.map((category, index) => (
          <div
            key={category}
            className={`category ${
              activeCategory === category ? "active-category" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCategoryClick(category);
              }
            }}
          >
            <span className="category-icon">
              {index === 0
                ? "♧"
                : index === 1
                ? "♙"
                : index === 2
                ? "♧"
                : "○"}
            </span>

            <span>{category}</span>
          </div>
        ))}
      </aside>

      {/* CAMPAIGN AREA */}
      <main className="campaign-content">
        <div className="campaign-grid">
          {loading ? (
            <div className="no-campaigns">
              <h2>Loading campaigns...</h2>
              <p>Please wait while we fetch the latest campaigns.</p>
            </div>
          ) : error ? (
            <div className="no-campaigns">
              <h2>Unable to load campaigns</h2>
              <p role="alert">{error}</p>

              <button
                type="button"
                className="donate-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => {
              const goal = Number(campaign.goalAmount) || 0;
              const raised = Number(campaign.raisedAmount) || 0;

              const percent =
                goal > 0
                  ? Math.min(
                      100,
                      Math.round((raised / goal) * 100)
                    )
                  : 0;

              return (
                <div
                  className="campaign-card"
                  key={campaign._id}
                >
                  {/* IMAGE */}
                  <div
                    className="campaign-image"
                    onClick={() => handleImageClick(campaign.image)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        campaign.image
                      ) {
                        handleImageClick(campaign.image);
                      }
                    }}
                  >
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />

                    <span className="tax-badge">
                      Tax Benefit
                    </span>

                    <div className="image-overlay">
                      <span>🔍</span>
                      <span>View Image</span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h2>{campaign.title}</h2>

                  {/* DESCRIPTION */}
                  {campaign.description && (
                    <p className="campaign-description">
                      {campaign.description}
                    </p>
                  )}

                  {/* PROGRESS */}
                  <div className="progress-area">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span
                      className="percentage"
                      style={{ left: `${percent}%` }}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* CAMPAIGN STATS */}
                  <div className="stats">
                    <div className="stat">
                      <div className="stat-icon">🎯</div>

                      <div>
                        <small>Goal</small>
                        <strong>{formatCurrency(goal)}</strong>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-icon">₹</div>

                      <div>
                        <small>Raised</small>
                        <strong>{formatCurrency(raised)}</strong>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-icon">👥</div>

                      <div>
                        <small>Donors</small>
                        <strong>
                          {Number(campaign.donorCount) || 0}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* EXISTING DONATION BUTTON */}
                  <div className="donate-bt">
                    <DonateNowButton />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-campaigns">
              <div className="no-campaign-icon">❤️</div>

              <h2>No {activeCategory} campaigns yet</h2>

              <p>
                Campaigns for this category will appear here soon.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={closeImage}
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeImage}
              aria-label="Close image"
            >
              ×
            </button>

            <img src={selectedImage} alt="Campaign" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;
