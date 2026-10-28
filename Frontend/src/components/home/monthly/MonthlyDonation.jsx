
import React, { useEffect, useState } from "react";
import { getMonthlyPrograms } from "../../../services/donationformservice";
import "./MonthlyDonation.css";

const MonthlyDonation = () => {
  const [monthlyPrograms, setMonthlyPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMonthlyPrograms();

        const programs =
          response.programs ||
          response.data ||
          response.campaigns ||
          [];

        if (response.success === false) {
          throw new Error(
            response.message || "Unable to load monthly programs."
          );
        }

        setMonthlyPrograms(Array.isArray(programs) ? programs : []);
      } catch (err) {
        console.error("Monthly programs error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load monthly programs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  
const handleSubscribe = (program) => {
  const selection = {
    campaignId: program._id || program.id,
    campaignName: program.title,
    donationType: "monthly",
  };

  sessionStorage.setItem(
    "monthlyDonationSelection",
    JSON.stringify(selection)
  );

  window.location.href = "/donate-form";
};


  return (
    <section className="monthly-section" id="monthly-donations">
      <div className="monthly-decoration monthly-decoration-left">
        ✣<br />✣ ✣<br />✣ ✣<br />✣
      </div>

      <div className="monthly-decoration monthly-decoration-right">
        ♥
      </div>

      <header className="monthly-header">
        <span className="monthly-eyebrow">
          <span className="monthly-eyebrow-dot" />
          JOIN MONTHLY
        </span>

        <h2>Monthly Donation Programs</h2>

        <p>
          Your monthly support creates lasting change through
          consistent care, compassion and healthcare. Together,
          we can bring stability and hope to those who need it most.
        </p>
      </header>

      {loading && (
        <p className="monthly-message" role="status">
          Loading monthly programs...
        </p>
      )}

      {!loading && error && (
        <div className="monthly-message" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && monthlyPrograms.length === 0 && (
        <p className="monthly-message">
          No monthly programs are available right now.
        </p>
      )}

      {!loading && !error && monthlyPrograms.length > 0 && (
        <div className="monthly-grid">
          {monthlyPrograms.slice(0,4).map((program) => (
            <article
              className="monthly-card"
              key={program._id || program.id}
            >
              <div className="monthly-image-wrapper">
                <img
                  src={program.image}
                  alt={program.title}
                  className="monthly-image"
                  loading="lazy"
                />

                <span className="monthly-tax-badge">
                  CARE &amp; SUPPORT
                </span>
              </div>

              <div className="monthly-card-content">
                <span className="monthly-category">
                  {program.category || "Community Support"}
                </span>

                <h3>{program.title}</h3>

                <div className="monthly-supporters">
                  <span
                    className="monthly-supporters-icon"
                    aria-hidden="true"
                  >
                    ✿
                  </span>

                  <span>
                    <strong>
                      {program.supportersCount ??
                        program.supporters ??
                        0}
                    </strong>{" "}
                    people joined in this mission.
                  </span>
                </div>

                <button
                  type="button"
                  className="monthly-subscribe-btn"
                  onClick={() => handleSubscribe(program)}
                >
                  Subscribe Monthly
                  <span aria-hidden="true"> →</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="monthly-view-more">
  <a href="/monthly-programs">
    View More <span aria-hidden="true">↗</span>
  </a>
</div>
    </section>
  );
};

export default MonthlyDonation;
