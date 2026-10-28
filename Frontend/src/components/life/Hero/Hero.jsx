
import "./Hero.css";
import heroImage from "../../../assets/life.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="medical-hero">
      <img
        src={heroImage}
        alt="O Positive Health Foundation helping elderly patients"
        className="medical-hero-image"
      />

      <div className="medical-hero-overlay">
        <h1>
          Most Promising
          <br />
          Platform To Raise Funds
          <br />
          Medical Needs
        </h1>

        <p>
          Hundreds of people successfully raised funds
          <br className="desktop-break" />
          on O Positive Health Foundation for their cause.
        </p>

        <Link to="/explore" className="medical-donate-btn">
          Donate Now
        </Link>
      </div>
    </section>
  );
}

export default Hero;
