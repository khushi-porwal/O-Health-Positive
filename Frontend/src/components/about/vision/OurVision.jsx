import React from "react";
import "./OurVision.css";
import live from "../../../assets/live.png"
import DonateNowButton from "../../common/donateButton/DonateNowButton";
const OurVision = () => {
  return (
    <section className="vision-section">
      <div className="vision-container">

        {/* LEFT SIDE */}
        <div className="vision-left">

          {/* Top Image */}
          <div className="vision-image top-image">
            <img
              src={live}
              alt="Community support"
            />
          </div>

          {/* Top Stat */}
          <div className="stat-card top-stat">
            <h2>3k+</h2>
            <p>Communities Reached</p>

            <div className="stat-icon green-icon">
              <span>♧</span>
            </div>
          </div>

          {/* Bottom Stat */}
          <div className="stat-card bottom-stat">
            <h2>3k+</h2>
            <p>Communities Reached</p>

            <div className="stat-icon purple-icon">
              <span>♧</span>
            </div>
          </div>

          {/* Bottom Image */}
          <div className="vision-image bottom-image">
            <img
              src={live}
              alt="Community care"
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="vision-content">

          <div className="vision-label">
            <span className="vision-label-icon">✤</span>
            <span>Our Vision</span>
          </div>

          <div className="label-line"></div>

          <h1>
            Our Vision Is To Set New Standards
            <br />
            Through Integrity,{" "}
            <span className="green-text">Compassion</span>,
            <br />
            <span className="blue-text">Innovation</span>, And{" "}
            <span className="purple-text">Impact</span>
          </h1>

          <p>
           To create a society where every individual, regardless of financial or social background, has access to essential healthcare services, medical guidance, and opportunities for a healthier life.

We envision a future where healthcare is not a privilege but an accessible necessity for all.
          </p>

          <p>
            Our primary motive is to provide a helping hand to those in need,
            fostering a global community that cares. Through the transformative
            power, we aim to bridge the gap between compassion and action,
            enabling people from all walks of life to contribute towards
            creating a positive impact.
          </p>

          {/* <button className="donate-btn">
            Donate Now
            <span>↗</span>
          </button> */}
          <DonateNowButton/>

        </div>

      </div>
    </section>
  );
};

export default OurVision;