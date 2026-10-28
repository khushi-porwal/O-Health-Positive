
import React from "react";
import "./VendorHero.css";
import healthcareImage from "../../../assets/healthcareimage.png";

const VendorHero = () => {
  const handleExploreVendors = () => {
    document.getElementById("vendors")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="vendor-hero">
      <div className="vendor-hero-image-wrap">
        <img
          src={healthcareImage}
          alt="O Positive Health Foundation caregiver assisting an elderly patient"
          className="vendor-hero-image"
        />

        <button
          type="button"
          className="vendor-hero-button"
          onClick={handleExploreVendors}
        >
          <span>Explore Vendors</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
};

export default VendorHero;
