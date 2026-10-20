import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Users,
  HandCoins,
  TrendingUp,
} from "lucide-react";
import "./DonateSection.css";

const donationStats = [
  {
    label: "Patients Supported",
    value: 250,
    icon: Users,
  },
  {
    label: "Donations Received",
    value: 180,
    icon: HandCoins,
  },
  {
    label: "People Contributing",
    value: 95,
    icon: Heart,
  },
  {
    label: "Support Initiatives",
    value: 40,
    icon: TrendingUp,
  },
];

function DonationCounter({ value, label, icon: Icon }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame;
    let startTime = null;
    const duration = 1800;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <article className="donation-stat" ref={counterRef}>
      <div className="donation-stat-icon">
        <Icon size={24} strokeWidth={1.8} />
      </div>

      <h3>{count.toLocaleString("en-IN")}+</h3>
      <p>{label}</p>

      <div
        className="donation-progress"
        role="progressbar"
        aria-label={`${label} counter animation`}
        aria-valuemin={0}
        aria-valuemax={value}
        aria-valuenow={count}
      >
        <span
          style={{
            width: `${value ? (count / value) * 100 : 0}%`,
          }}
        />
      </div>
    </article>
  );
}

function DonateSection() {
  return (
    <section className="donate-section" id="donate">
      <div className="donate-inner">
        <span className="donate-label">MAKE A DIFFERENCE</span>

        <h2>Your Contribution Can Bring Hope</h2>

        <p className="donate-description">
          Support patient guidance and healthcare coordination
          through the organisation's verified donation process.
        </p>

        <div className="donation-stats-grid">
          {donationStats.map((stat) => (
            <DonationCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="donate-bottom">
          <div>
            <h3>Every Helping Hand Matters</h3>
            <p>
              Contact our team to learn how you can contribute
              to patient support.
            </p>
          </div>

          <a href="#contact" className="donate-button">
            Donate Now <Heart size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default DonateSection;