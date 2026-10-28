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
            Our mission is to reduce barriers to healthcare access by developing meaningful partnerships, supporting vulnerable communities, and promoting awareness about preventive and essential medical care.

          </p>

          <p>
           We strive to:

- Improve access to essential healthcare services.
- Support financially vulnerable patients in navigating healthcare challenges.
- Promote preventive healthcare and medical awareness.
- Build partnerships with hospitals and healthcare professionals.
- Encourage volunteering, social responsibility, and community participation.
- Develop sustainable initiatives that create long-term social impact.
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