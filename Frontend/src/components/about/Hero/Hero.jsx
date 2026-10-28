import about from "../../../assets/about.png";
import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="about-us-section">
      <img
        src={about}
        alt="O Positive Health Foundation - Our story, trust, innovation and lasting impact"
        className="about-us-image"
      />
    </section>
  );
};

export default Hero;
