
import "./Hero.css";
import hero from "../../assets/hero.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-eyebrow">
          O POSITIVE HEALTH · CARE BEFORE CURE
        </p>

        <h1>
          Your Healthcare Journey,
          <span> Coordinated With Care.</span>
        </h1>

        <p className="hero-description">
          We simplify patient journeys through hospital partnerships,
          operational expertise and technology-enabled healthcare
          coordination.
        </p>

        <div className="hero-buttons">
          <a href="#contact" className="hero-btn hero-btn-primary">
            Get Healthcare Assistance
          </a>

          <a href="#services" className="hero-btn hero-btn-secondary">
            Explore Our Services
          </a>
        </div>

        <div className="hero-trust">
          Healthcare Infrastructure &amp; Coordination Platform
        </div>
      </div>

      <div className="hero-image-wrapper">
        <img
          src={hero}
          alt="Healthcare professional supporting a patient"
          className="hero-image"
        />

        <div className="hero-image-card">
          <span className="hero-card-icon">♡</span>
          <div>
            <h3>Care Before Cure</h3>
            <p>Support throughout your healthcare journey</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
