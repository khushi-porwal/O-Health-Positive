import {Link} from "react-router-dom"
import React from "react";
import "./StartCampaign.css";
import doctor from "../../../assets/doctor.png"
const benefits = [
  "Support Ongoing Campaigns",
  "Emergency relief for flood victims.",
  "Food kits, shelter, medical help required.",
  "Support Brings Hope",
];

function StartCampaign() {
  return (
    <section className="start-campaign-section" id="start-campaign">
      <div className="start-campaign-image-area">
        <div className="start-campaign-image-frame">
          <img
            src={doctor}
            alt="Healthcare professionals providing compassionate care"
            className="start-campaign-image"
            loading="lazy"
          />
        </div>

        <span className="start-campaign-decoration decoration-top">
          ✣ ✣
        </span>

        <span className="start-campaign-decoration decoration-bottom">
          ✣<br />✣ ✣<br />✣ ✣<br />✣
        </span>
      </div>

      <div className="start-campaign-content">
        <div className="start-campaign-eyebrow">
          <span>Start New Campaign</span>
          <span className="eyebrow-line" />
        </div>

        <h2>
          Create Your Campaign.
          <br className="desktop-break" /> Help Those in Need
          Get Support.
        </h2>

        <p className="start-campaign-description">
          We run meaningful campaigns to help people in urgent need.
          From healthcare and medical assistance to food, shelter and
          emergency relief, every campaign brings us closer to a
          healthier, more hopeful world.
        </p>

        <div className="start-campaign-benefits">
          {benefits.map((benefit) => (
            <div className="start-campaign-benefit" key={benefit}>
              <span className="benefit-check" aria-hidden="true">
                ✓
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <Link to="/campaign" className="start-campaign-button">
          Start Campaign
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <span className="start-campaign-heart" aria-hidden="true">
        ♥
      </span>
    </section>
  );
}

export default StartCampaign;
