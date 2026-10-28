
import { useEffect, useState } from "react";
import "./MedicalEmergency.css";
import DonateNowButton from "../../common/donateButton/DonateNowButton";
import { getCampaigns } from "../../../services/campaignService";

const formatMoney = (amount) => {
  const value = Number(amount) || 0;

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${(value / 1000).toFixed(
    value % 1000 === 0 ? 0 : 1
  )}K`;
};

function MedicalEmergency() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchUrgentCampaigns = async () => {
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

        // Show only Urgent campaigns
        const urgentCampaigns = data.filter(
          (campaign) =>
            campaign.category?.trim().toLowerCase() === "urgent" &&
            campaign.status?.toLowerCase() !== "inactive"
        );

        if (!cancelled) {
          setCampaigns(urgentCampaigns);
        }
      } catch (err) {
        console.error("Medical emergency campaigns error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load emergency campaigns."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUrgentCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="medical-emergency" id="medical-emergency">
      <header className="medical-emergency-header">
        <span className="medical-emergency-eyebrow">
          <span className="emergency-green-dot" />
          EMERGENCY SUPPORT
        </span>

        <h2>Medical Emergency</h2>

        <p>
          When every second counts, your support can save lives.
          Help patients get urgent treatment, critical care, and
          life-saving procedures without delay.
        </p>
      </header>

      {loading ? (
        <p role="status">Loading emergency campaigns...</p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : campaigns.length === 0 ? (
        <p>No urgent campaigns are available right now.</p>
      ) : (
        <div className="medical-campaign-grid">
          {campaigns.map((campaign) => {
            const goal = Number(campaign.goalAmount) || 0;
            const raised = Number(campaign.raisedAmount) || 0;

            const progress =
              goal > 0
                ? Math.min(Math.round((raised / goal) * 100), 100)
                : 0;

            return (
              <article
                className="medical-campaign-card"
                key={campaign._id || campaign.id}
              >
                <div className="medical-campaign-image-wrap">
                  <img
                    className="medical-campaign-image"
                    src={campaign.image}
                    alt={campaign.title}
                    loading="lazy"
                  />

                  <span className="medical-tax-badge">
                    Tax Benefit
                  </span>
                </div>

                <h3 className="medical-campaign-title">
                  {campaign.title}
                </h3>

                <div
                  className="medical-progress"
                  role="progressbar"
                  aria-label={`Fundraising progress for ${campaign.title}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="medical-progress-fill"
                    style={{ width: `${progress}%` }}
                  />

                  <span
                    className="medical-progress-label"
                    style={{
                      left: `${Math.max(
                        8,
                        Math.min(progress, 92)
                      )}%`,
                    }}
                  >
                    {progress}%
                  </span>
                </div>

                <div className="medical-campaign-stats">
                  <div className="medical-stat">
                    <span className="medical-stat-icon">◎</span>
                    <div>
                      <span className="medical-stat-label">Goal</span>
                      <strong>{formatMoney(goal)}</strong>
                    </div>
                  </div>

                  <div className="medical-stat">
                    <span className="medical-stat-icon">₹</span>
                    <div>
                      <span className="medical-stat-label">Raised</span>
                      <strong>{formatMoney(raised)}</strong>
                    </div>
                  </div>

                  <div className="medical-stat">
                    <span className="medical-stat-icon">♟</span>
                    <div>
                      <span className="medical-stat-label">Donors</span>
                      <strong>
                        {(
                          Number(campaign.donorCount) || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="medical-campaign-footer">
                  <div className="medical-social-links">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.origin
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share on Facebook"
                    >
                      f
                    </a>

                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      in
                    </a>

                    <a
                      href="https://x.com/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="X"
                    >
                      𝕏
                    </a>
                  </div>

                  <div className="medical-campaign-donate">
                    <DonateNowButton />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MedicalEmergency;
