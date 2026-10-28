
import React, { useEffect, useState } from "react";
import "./FeaturedVendors.css";
import impact from "../../../assets/impact.png";
import { getFeaturedVendors } from "../../../services/vendorApi";
import { useNavigate } from "react-router-dom";
const formatAmount = (amount = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(amount) || 0);
};

function FeaturedVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getFeaturedVendors();

        if (active) {
          setVendors(data.vendors || []);
        }
      } catch (err) {
        console.error("Featured vendors error:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load vendors. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchVendors();

    return () => {
      active = false;
    };
  }, []);

  const renderHeader = () => (
    <div className="vendors-header">
      <div className="section-label">
        <span></span>
        FEATURED VENDORS
      </div>

      <h1>Meet The Vendors Behind Every Product</h1>

      <p>
        Every vendor has a story. Buy their products and we'll distribute
        them to partner NGOs - empowering the vendor and supporting the
        community.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className="vendors-section">
        {renderHeader()}
        <p className="vendors-message">Loading featured vendors...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="vendors-section">
        {renderHeader()}
        <div className="vendors-message" role="alert">
          <p>{error}</p>
          <button
            className="buy-btn"
            onClick={() => window.location.reload()}
          >
            Try Again →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="vendors-section">
      {renderHeader()}

      {vendors.length === 0 ? (
        <div className="vendors-message">
          <h2>Our vendor stories are coming soon!</h2>
          <p>
            We are working to feature local vendors and their products.
            Please visit us again soon.
          </p>
        </div>
      ) : (
        <div className="vendors-grid">
          {vendors.map((vendor) => {
            const goal = Number(vendor.goalAmount) || 0;
            const raised = Number(vendor.raisedAmount) || 0;

            const percent =
              goal > 0
                ? Math.min(100, Math.round((raised / goal) * 100))
                : 0;

            const tags = [
              ...(vendor.products || []),
              ...(vendor.category ? [vendor.category] : []),
            ].filter(
              (tag, index, array) => array.indexOf(tag) === index
            );

            return (
              <div className="vendor-card" key={vendor._id}>
                {/* Vendor Image */}
                <div className="vendor-image">
                  <img
                    src={vendor.image || impact}
                    alt={vendor.name || "Featured vendor"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = impact;
                    }}
                  />

                  {/* Foundation Logo */}
                  <div className="vendor-logo">
                    <div className="logo-circle">
                      <span>O+</span>
                    </div>
                    <small>O POSITIVE</small>
                    <b>HEALTH FOUNDATION</b>
                  </div>

                  <div className="image-label">
                    {vendor.category || "Featured Vendor"}
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="vendor-content">
                  <h2>{vendor.title || vendor.name}</h2>

                  <div className="location">
                    <span>●</span>
                    {vendor.city || "India"}
                  </div>

                  <div className="tags">
                    {tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <p className="vendor-story">
                    {vendor.story}
                  </p>

                  {/* Fundraising Progress */}
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="progress-percent">
                      {percent}%
                    </span>
                  </div>

                  {/* Statistics */}
                  <div className="vendor-stats">
                    <div className="stat">
                      <div className="stat-icon">₹</div>
                      <div>
                        <small>Goal</small>
                        <strong>{formatAmount(goal)}</strong>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-icon">₹</div>
                      <div>
                        <small>Raised</small>
                        <strong>{formatAmount(raised)}</strong>
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-icon">♣</div>
                      <div>
                        <small>Supporters</small>
                        <strong>
                          {Number(vendor.supportersCount) || 0}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="vendor-bottom">
                    <div className="social-icons">
                      <button
                        type="button"
                        aria-label="Share on Facebook"
                        onClick={() => {
                          const url = encodeURIComponent(
                            window.location.href
                          );
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        f
                      </button>

                      <button
                        type="button"
                        aria-label="Share on LinkedIn"
                        onClick={() => {
                          const url = encodeURIComponent(
                            window.location.href
                          );
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        in
                      </button>

                      <button
                        type="button"
                        aria-label="Share on X"
                        onClick={() => {
                          const url = encodeURIComponent(
                            window.location.href
                          );
                          window.open(
                            `https://twitter.com/intent/tweet?url=${url}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        𝕏
                      </button>
                    </div>

                   <button
  type="button"
  className="buy-btn"
  onClick={() => {
    navigate(`/vendors/${vendor._id}/products`);
  }}
>
  Buy Now <span>→</span>
</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FeaturedVendors;
