
import { useEffect, useRef, useState } from "react";
import "./OurImpact.css";

import patient1 from "../../assets/patient.png";
import patient2 from "../../assets/patient2.png";
import patient3 from "../../assets/patient3.png";

const patientImages = [
  {
    src: patient1,
    alt: "Patient receiving healthcare support",
  },
  {
    src: patient2,
    alt: "Patient care and assistance",
  },
  {
    src: patient3,
    alt: "Compassionate healthcare support",
  },
];

const impactAreas = [
  {
    icon: "♡",
    title: "Patient Support",
    description:
      "Helping patients navigate their healthcare journey with care and guidance.",
  },
  {
    icon: "✚",
    title: "Healthcare Coordination",
    description:
      "Guidance through hospital services, diagnostics, and treatment steps.",
  },
  {
    icon: "♧",
    title: "Financial Guidance",
    description:
      "Helping patients understand available financial assistance options.",
  },
  {
    icon: "✳",
    title: "Patient-First Care",
    description:
      "Putting patient needs, dignity, and informed decisions first.",
  },
];

// Demo values only. Replace with verified figures before publishing.
const floatingStats = [
  {
    target: 2500,
    label: "Patients Supported",
    icon: "♡",
    position: "stat-left-bottom",
  },
  {
    target: 1800,
    label: "Healthcare Guidance Sessions",
    icon: "✚",
    position: "stat-right-top",
  },
  {
    target: 950,
    label: "Care Coordination Cases",
    icon: "↗",
    position: "stat-right-bottom",
  },
];

function ImpactCounter({ target, label, icon, position }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  // Start counting when the card enters the viewport.
  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Existing smooth 2-second number animation.
  useEffect(() => {
    if (!started) return;

    let frameId;
    let startTime = null;
    const duration = 2000;

    function animate(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [started, target]);

  return (
    <article
      className={`impact-floating-stat ${position}`}
      ref={counterRef}
    >
      <div className="floating-stat-icon" aria-hidden="true">
        {icon}
      </div>

      <div className="floating-stat-content">
        <h3>{count.toLocaleString("en-IN")}+</h3>
        <p>{label}</p>
      </div>
    </article>
  );
}

function OurImpact() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage(
        (current) => (current + 1) % patientImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="our-impact" id="impact">
      <div className="impact-inner">
        {/* Section heading */}
        <div className="impact-heading">
          <span className="impact-label">CARE BEFORE CURE</span>

          <h2>Our Impact, Our Commitment</h2>

          <p>
            Every patient deserves guidance, dignity, and support
            throughout their healthcare journey.
          </p>
        </div>

        {/* Image slideshow and floating number cards */}
        <div className="impact-content">
          <div className="impact-image">
            {patientImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`impact-slide ${
                  activeImage === index ? "active" : ""
                }`}
                aria-hidden={activeImage !== index}
              />
            ))}

            {/* Three animated floating statistic rectangles */}
            {floatingStats.map((stat) => (
              <ImpactCounter
                key={stat.label}
                target={stat.target}
                label={stat.label}
                icon={stat.icon}
                position={stat.position}
              />
            ))}

            <div className="impact-image-overlay">
              <span>COMPASSIONATE CARE</span>
              <h3>Care that puts patients first.</h3>
            </div>

            <div className="impact-dots" aria-label="Choose an image">
              {patientImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`impact-dot ${
                    activeImage === index ? "active" : ""
                  }`}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Existing information cards remain unchanged */}
          <div className="impact-cards">
            {impactAreas.map((item, index) => (
              <article
                className="impact-card"
                key={item.title}
                style={{ "--card-index": index }}
              >
                <span className="impact-icon" aria-hidden="true">
                  {item.icon}
                </span>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Patient support CTA */}
        <div className="impact-cta">
          <div>
            <span className="impact-cta-label">
              WE ARE HERE TO HELP
            </span>
            <p>Need help navigating your healthcare journey?</p>
          </div>

          <a href="#contact">
            Get Patient Support <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default OurImpact;
