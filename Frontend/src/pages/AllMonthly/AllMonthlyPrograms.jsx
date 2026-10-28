
import React, { useEffect, useState } from "react";
import { getMonthlyPrograms } from "../../services/donationformservice";
import DonateNowButton from "../../components/common/donateButton/DonateNowButton";
import "../../components/home/monthly/MonthlyDonation.css";
import Footer from "../../components/layout/Footer/Footer"
import Navbar from "../../components/layout/Navbar/Navbar"
import MainHeader from "../../components/layout/Header/Header"
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
const AllMonthlyPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMonthlyPrograms();

        if (response.success === false) {
          throw new Error(
            response.message || "Unable to load monthly programs."
          );
        }

        const data =
          response.programs ||
          response.data?.programs ||
          response.data ||
          [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid monthly programs response.");
        }

        if (!cancelled) {
          setPrograms(
            data.filter((program) => program.isActive !== false)
          );
        }
      } catch (err) {
        console.error("All monthly programs error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load monthly programs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = (program) => {
    sessionStorage.setItem(
      "monthlyDonationSelection",
      JSON.stringify({
        campaignId: program._id || program.id,
        campaignName: program.title,
        donationType: "monthly",
      })
    );

    window.location.href = "/donate-form?type=monthly";
  };

  return (
    <>
    <Navbar/>
    <CrowdfundingHeader/>
    <MainHeader/>
    <section className="monthly-section" id="all-monthly-programs">
      <header className="monthly-header">
        <span className="monthly-eyebrow">
          <span className="monthly-eyebrow-dot" />
          JOIN MONTHLY
        </span>

        <h2>All Monthly Donation Programs</h2>

        <p>
          Explore our monthly programs and help us bring consistent
          care, compassion and hope to those who need it most.
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

      {!loading && !error && programs.length === 0 && (
        <p className="monthly-message">
          No monthly programs are available right now.
        </p>
      )}

      {!loading && !error && programs.length > 0 && (
        <div className="monthly-grid">
          {programs.map((program) => (
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

                {program.description && (
                  <p>{program.description}</p>
                )}

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
    </section>
    <Footer/>
    </>
  );
};

export default AllMonthlyPrograms;
