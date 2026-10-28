
import { useEffect, useState } from "react";
import "./CampaignCategories.css";
import DonateNowButton from "../../common/donateButton/DonateNowButton";
import { getCampaigns } from "../../../services/campaignService";

const categories = [
  { name: "Urgent", icon: "❤️" },
  { name: "Children", icon: "👶" },
  { name: "Animals", icon: "🐾" },
  { name: "Disability", icon: "♿" },
  { name: "Disaster Relief", icon: "🏠" },
  { name: "Education", icon: "🎓" },
  { name: "Elderly", icon: "👵" },
  { name: "Faith", icon: "♡" },
  { name: "Hunger", icon: "🍲" },
  { name: "Medical", icon: "✚" },
  { name: "DIY", icon: "🛠" },
  { name: "Women", icon: "♀" },
];

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function CampaignCategories() {
  const [activeCategory, setActiveCategory] = useState("Urgent");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCampaigns();

        const data = Array.isArray(response)
          ? response
          : response?.campaigns || response?.data?.campaigns;

        if (!Array.isArray(data)) {
          throw new Error("Invalid campaigns response from server.");
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

  // Normalize backend data while preserving the existing UI.
  const normalizedCampaigns = campaigns.map((campaign) => ({
    ...campaign,
    id: campaign._id || campaign.id,
    category: campaign.category || "Urgent",
    title: campaign.title || campaign.name || "Untitled Campaign",
    image: campaign.image || "",
    goal: Number(campaign.goalAmount ?? campaign.goal) || 0,
    raised: Number(campaign.raisedAmount ?? campaign.raised) || 0,
    donors: Number(campaign.donorCount ?? campaign.donors) || 0,
  }));

  // Urgent displays all campaigns, as in the original design.
  const visibleCampaigns =
    activeCategory === "Urgent"
      ? normalizedCampaigns
      : normalizedCampaigns.filter(
          (campaign) =>
            campaign.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <section className="campaign-section" id="campaigns">
      <div className="campaign-heading">
        <div className="campaign-heading-mark" aria-hidden="true">
          O+
        </div>

        <div className="campaign-heading-content">
          <span className="campaign-eyebrow">OUR CAMPAIGNS</span>
          <h2>
            Behind Every Need,
            <br />
            There Is a Life Worth Caring For.
          </h2>
          <p>
            Together, we can bring healthcare, dignity and hope
            to every life.
          </p>
        </div>

        <div className="campaign-heart" aria-hidden="true">
          ♥
        </div>
      </div>

      <div
        className="campaign-category-nav"
        role="group"
        aria-label="Filter campaigns by category"
      >
        {categories.map((category) => (
          <button
            type="button"
            key={category.name}
            className={`campaign-category ${
              activeCategory === category.name ? "selected" : ""
            }`}
            onClick={() => setActiveCategory(category.name)}
            aria-pressed={activeCategory === category.name}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

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
              className="campaign-donate-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : visibleCampaigns.length > 0 ? (
          visibleCampaigns.slice(0, 4).map((campaign) => {
            const progress =
              campaign.goal > 0
                ? Math.min(
                    Math.round(
                      (campaign.raised / campaign.goal) * 100
                    ),
                    100
                  )
                : 0;

            return (
              <article
                className="campaign-card"
                key={campaign.id}
              >
                <div className="campaign-image-wrap">
                  {campaign.image ? (
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="campaign-image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div
                      className="campaign-image"
                      role="img"
                      aria-label="Campaign image unavailable"
                    />
                  )}

                  <span className="campaign-benefit-tag">
                    MAKE AN IMPACT
                  </span>
                </div>

                <div className="campaign-card-content">
                  <span className="campaign-card-category">
                    {campaign.category}
                  </span>

                  <h3>{campaign.title}</h3>

                  {campaign.description && (
                    <p className="campaign-description">
                      {campaign.description}
                    </p>
                  )}

                  <div
                    className="campaign-progress-track"
                    role="progressbar"
                    aria-label="Fundraising progress"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="campaign-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="campaign-progress-label">
                    <span>{progress}% funded</span>
                    <span>{formatAmount(campaign.goal)} goal</span>
                  </div>

                  <div className="campaign-stats">
                    <div>
                      <span className="campaign-stat-icon">◎</span>
                      <div>
                        <small>Goal</small>
                        <strong>{formatAmount(campaign.goal)}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="campaign-stat-icon">♥</span>
                      <div>
                        <small>Raised</small>
                        <strong>{formatAmount(campaign.raised)}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="campaign-stat-icon">♙</span>
                      <div>
                        <small>Donors</small>
                        <strong>
                          {campaign.donors.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="campaign-card-footer">
                    <div className="campaign-socials">
                      <button
                        type="button"
                        aria-label="Share campaign on Facebook"
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href + "#campaigns"
                            )}`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        f
                      </button>

                      <button
                        type="button"
                        aria-label="Share campaign on LinkedIn"
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                              window.location.href + "#campaigns"
                            )}`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        in
                      </button>
                    </div>

                    <DonateNowButton />
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="no-campaigns">
            <div className="no-campaign-icon">❤️</div>
            <h2>
              No {activeCategory} campaigns yet
            </h2>
            <p>
              Campaigns for this category will appear here soon.
              Please explore another category.
            </p>
          </div>
        )}
      </div>

      <div className="campaign-view-all">
        <a href="/explore">
          View All Campaigns <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export default CampaignCategories;
