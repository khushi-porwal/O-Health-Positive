
import React from "react";
import "./VendorHero.css";
import healthcareImage from "../../../assets/healthcareimage.png";

const VendorHero = () => {
  const handleExploreVendors = () => {
    document.getElementById("vendors")?.scrollIntoView({
      behavior: "smooth",
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
          className="vendor-hero-button"
          onClick={handleExploreVendors}
        >
          Explore Vendors
          <span className="button-arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default VendorHero;
