
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
          We Are A Purpose-Driven Giving
          Platform Committed To Turning
          Compassion Into Meaningful Change
        </h2>

        <p>
          Welcome to O Positive Health Foundation, a heartfelt
          initiative dedicated to transforming lives through
          timely financial support and community-driven care.
          Rooted in compassion, our foundation is committed to
          extending a helping hand to those in need.
        </p>

        <p>
          At O Positive Health Foundation, we recognize that
          financial hardships can feel overwhelming — whether
          it is urgent medical treatment, a child's education,
          shelter needs, animal welfare, or unexpected
          emergencies. Our mission is to bridge this gap by
          bringing compassionate people together and turning
          collective kindness into real, life-changing support.
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
