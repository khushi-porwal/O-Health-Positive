
import { useState, useEffect } from "react";
import "./Hero.css";

import bannerOne from "../../../assets/hero-banner1.png";
import bannerTwo from "../../../assets/hero-banner-2.png";
import { Link } from "react-router-dom";

const banners = [bannerOne, bannerTwo];

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % banners.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + banners.length) % banners.length
    );
  };

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="hero-slider"
      id="home"
      aria-label="O Positive Health Foundation highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Horizontal sliding track */}
      <div
        className="hero-slider-track"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div className="hero-slide" key={banner}>
            <img
              src={banner}
              alt={
                index === 0
                  ? "O Positive Health Foundation - Care Beyond Boundaries"
                  : "O Positive Health Foundation - Healthcare Beyond Hospitals"
              }
              className="hero-slide-image"
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable="false"
            />

            {/* Donate button only on the second image */}
            {index === 1 && (
              <Link
                to="/explore"
                className="hero-donate-button"
                tabIndex={activeIndex === index ? 0 : -1}
              >
                Donate Now <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Previous arrow */}
      <button
        type="button"
        className="hero-slider-arrow hero-slider-prev"
        onClick={prevSlide}
        aria-label="Previous banner"
      >
        ‹
      </button>

      {/* Next arrow */}
      <button
        type="button"
        className="hero-slider-arrow hero-slider-next"
        onClick={nextSlide}
        aria-label="Next banner"
      >
        ›
      </button>

      {/* Slide indicators */}
      <div className="hero-slider-dots">
        {banners.map((_, index) => (
          <button
            type="button"
            key={index}
            className={`hero-slider-dot ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show banner ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
