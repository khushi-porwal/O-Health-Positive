
import React from "react";
import "./WhoWeAre.css";
import live from  "../../../assets/live.png"
const WhoWeAre = () => {
  return (
    <section className="who-we-are">
      <div className="who-content">
        <div className="who-label">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="5" r="3" />
            <circle cx="5" cy="9" r="3" />
            <circle cx="19" cy="9" r="3" />
            <circle cx="7" cy="17" r="3" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
          <span>Who we are</span>
        </div>

        <h2>
          A Foundation Built on Care, Compassion & Commitment
        </h2>

        <p>
          O Positive Health Foundation is a healthcare-focused non-profit organization 
          committed to supporting economically disadvantaged individuals and underserved communities.
          We recognize that thousands of families face difficulties in accessing healthcare due to financial challenges, 
          limited awareness, and inadequate medical resources
        </p>

        <p>
          Our Foundation aims to address these challenges by connecting people with healthcare resources, promoting medical awareness, encouraging community participation, and developing sustainable healthcare support initiatives.

We believe that meaningful change begins when individuals, organizations, and communities come together for a common purpos
        </p>

        <a href="/donate" className="who-donate-btn">
          Donate Now
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="who-visual">
        <div className="who-brush" />

        <div className="who-photo who-photo-main">
          <img
            src={live}
            alt="Volunteer supporting an elderly person"
          />
        </div>

        <div className="who-photo who-photo-top">
          <img
            src={live}
            alt="Children receiving educational support"
          />
        </div>

        <div className="who-photo who-photo-bottom">
          <img
            src={live}
            alt="Volunteer helping a community member"
          />
        </div>

        <div className="who-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
