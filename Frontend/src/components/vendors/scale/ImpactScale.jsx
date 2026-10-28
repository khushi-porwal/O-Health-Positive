
import { useEffect, useRef, useState } from "react";
import "./ImpactScale.css";
import impactImage from "../../../assets/impact.png";
import { getImpactStats } from "../../../services/impactApi";

const initialStats = [
  {
    id: 1,
    key: "fundsRaised",
    value: 0,
    suffix: "Cr+",
    label: "Funds Raised",
    color: "green",
  },
  {
    id: 2,
    key: "successfulCampaigns",
    value: 0,
    suffix: "+",
    label: "Successful Campaigns",
    color: "blue",
  },
  {
    id: 3,
    key: "monthlyDonors",
    value: 0,
    suffix: "+",
    label: "Monthly Donors",
    color: "purple",
  },
  {
    id: 4,
    key: "livesImpacted",
    value: 0,
    suffix: "k+",
    label: "Lives Impacted",
    color: "red",
  },
];

function OurImpact() {
  const sectionRef = useRef(null);
  const [startCount, setStartCount] = useState(false);
  const [impactStats, setImpactStats] = useState(initialStats);

  // Fetch statistics from backend
  useEffect(() => {
    let isMounted = true;

    const fetchImpactStats = async () => {
      try {
        const result = await getImpactStats();

        if (!result?.success || !result?.data || !isMounted) {
          return;
        }

        setImpactStats((previousStats) =>
          previousStats.map((stat) => ({
            ...stat,
            value: Math.max(
              0,
              Number(result.data[stat.key]) || 0
            ),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch impact statistics:", error);
      }
    };

    fetchImpactStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Start animation when the section enters the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="impact-modern"
      id="our-impact"
      ref={sectionRef}
    >
      <div className="impact-modern-inner">
        <div className="impact-modern-heading">
          <span className="impact-kicker">
            <span className="impact-kicker-line" />
            OUR DIFFERENCE
          </span>

          <h2>
            Making a Difference,
            <br />
            <span>One Life at a Time.</span>
          </h2>

          <p>
            Discover the inspiring stories of individuals and
            communities transformed by our programs. Every act
            of kindness brings us closer to a healthier, more
            hopeful world.
          </p>
        </div>

        <div className="impact-modern-stats">
          {impactStats.map((stat) => (
            <article
              className="impact-modern-card"
              key={stat.id}
            >
              <div className={`impact-card-accent ${stat.color}`} />

              <span className="impact-card-index">
                {`0${stat.id}`}
              </span>

              <div className={`impact-modern-number ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  active={startCount}
                />
                <span>{stat.suffix}</span>
              </div>

              <p>{stat.label}</p>

              <div className="impact-card-bottom">
                <span />
                <span />
                <span />
              </div>
            </article>
          ))}
        </div>

        <div className="impact-modern-story">
          <div className="impact-story-image">
            <img
              src={impactImage}
              alt="Community members supported by our programs"
              loading="lazy"
            />

            <span className="impact-image-tag">
              CARE • COMPASSION • CHANGE
            </span>
          </div>

          <div className="impact-story-content">
            <span className="impact-story-label">
              OUR PURPOSE
            </span>

            <h3>Every life matters.</h3>

            <p>Together, we make every life count.</p>

            <div className="impact-story-decoration">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame;
    let startTime;

    const duration = 1600;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return <>{count.toLocaleString("en-IN")}</>;
}

export default OurImpact;
