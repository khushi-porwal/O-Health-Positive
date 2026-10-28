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
            At True Hope Foundation, we envision a world where financial
            barriers do not hinder individuals from accessing essential
            resources for social and medical needs. We strive to be a beacon
            of hope for those who find themselves unable to fund crucial
            aspects of their lives, whether it be addressing pressing social
            issues or overcoming medical challenges.
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