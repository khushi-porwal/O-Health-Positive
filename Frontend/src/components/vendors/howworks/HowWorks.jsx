import React from "react";
import "./HowWorks.css";
import collect from "../../../assets/collect.png"

function HowItWorks() {
  return (
    <section className="how-it-works">

      {/* Heading */}
      <div className="section-label">
        <span></span>
        HOW IT WORKS
      </div>

      <h2>How Can Buying From Small Vendors Help?</h2>

      <p className="section-description">
        A simple purchase creates a chain of goodness — supporting the
        vendor's livelihood while donating products to NGOs serving those in need.
      </p>

      <div className="works-container">

        {/* LEFT TOP */}
        <div className="work-card card-left">
          <div className="number-box">1</div>

          <h3>We Feature Vendors</h3>

          <p>
            Our team identifies and verifies hardworking small street vendors
            and features their story and products on our platform.
          </p>
        </div>

        {/* CENTER IMAGE */}
        <div className="vendor-image-card">

          <div className="image-decoration"></div>

          <div className="heart heart-one">♥</div>
          <div className="heart heart-two">♥</div>

          <img
            src={collect}
            alt="Small vendor"
          />

        </div>

        {/* RIGHT TOP */}
        <div className="work-card card-right">
          <div className="number-box">3</div>

          <h3>Products Go to NGOs</h3>

          <p>
            The products you buy are distributed to our partner NGOs —
            orphanages, old age homes, shelters, and community kitchens.
          </p>
        </div>

        {/* LEFT BOTTOM */}
        <div className="work-card card-left">
          <div className="number-box">2</div>

          <h3>You Buy Their Products</h3>

          <p>
            Browse vendor profiles, watch their story video, and purchase
            their products directly through our secure payment gateway.
          </p>
        </div>

        {/* RIGHT BOTTOM */}
        <div className="work-card card-right">
          <div className="number-box">4</div>

          <h3>Double The Impact</h3>

          <p>
            The vendor earns a fair income and the NGO receives essential
            products. Both benefit from a single act of kindness.
          </p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;