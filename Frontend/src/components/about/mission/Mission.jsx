import React from "react";
import "./Mission.css";
import live from "../../../assets/live.png"
import DonateNowButton from "../../common/donateButton/DonateNowButton";
const Mission = () => {
  return (
    <section className="mission-section">
      <div className="mission-content">

        {/* Left Content */}
        <div className="mission-text">
          <div className="mission-label">
            <span className="mission-icon">✣</span>
            Our Mission
          </div>

          <h2>
            Our Mission is To Transform Ideas
            <br />
            Into Experiences That Enrich Lives.
          </h2>

          <p>
            O Positive Health Foundation is dedicated to preventing tragedies
            that result from financial constraints. Whether it’s a life-saving
            medical treatment or urgent support during a crisis, our mission is
            to ensure that no one loses their life due to a lack of funds.
            Every contribution on our platform is a step toward preserving
            lives and offering hope.
          </p>

          <p>
            Recognizing the tireless efforts of individuals and NGOs making a
            positive impact on communities, O Positive Health Foundation
            stands by those who selflessly serve others. Our mission is to
            ensure that these changemakers do not face undue hardships due to
            financial constraints.
          </p>

          {/* <button className="donate-btn">
            Donate Now <span>↗</span>
          </button> */}
          <DonateNowButton/>
        </div>

        {/* Right Image */}
        <div className="mission-image-wrapper">
          <div className="paint-shape"></div>

          <img
            src={live}
            alt="O Positive Health Foundation Mission"
            className="mission-image"
          />
        </div>

      </div>
    </section>
  );
};

export default Mission;