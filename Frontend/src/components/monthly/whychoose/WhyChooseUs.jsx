import React from "react";
import "./WhyChooseUs.css";

const features = [
  {
    title: "Long Term - Impact",
    text: "Your contributions go beyond immediate relief, creating sustainable programs that transform lives over time.",
    icon: "◷",
    color: "blue",
  },
  {
    title: "Transparent Impact",
    text: "We maintain complete transparency, ensuring every rupee is spent effectively. You’ll always know exactly how your support helps.",
    icon: "♡",
    color: "green",
  },
  {
    title: "Monthly Updates",
    text: "Get regular updates on the children and communities you support, seeing your generosity come to life every month.",
    icon: "▣",
    color: "red",
  },
  {
    title: "Avail Tax Benefits",
    text: "Your kindness not only changes lives but also offers you tax benefits. Giving back becomes even more rewarding with financial relief.",
    icon: "▤",
    color: "purple",
  },
  {
    title: "Spread Smiles every month",
    text: "Consistent support from you means consistent care for those in need. Every month, your donations bring hope and happiness.",
    icon: "☺",
    color: "blue",
  },
  {
    title: "Rewards",
    text: "We celebrate your generosity with recognition and rewards. Each contribution is a step toward a world where your kindness brings change.",
    icon: "✧",
    color: "purple",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section">

      {/* Heading */}
      <div className="why-header">

        <div className="why-label">
          <span></span>
          WHY CHOOSE US
        </div>

        <h1>
          Why To Choose O Positive Health Foundation
        </h1>

        <p>
          O Positive Health Foundation's Social Investment Plans are
          designed to create lasting impact through transparent,
          well-managed initiatives. Your contributions go directly
          towards education, healthcare, and community development,
          ensuring every rupee you invest brings meaningful change.
        </p>

      </div>


      {/* Feature Cards */}
      <div className="why-grid">

        {features.map((feature, index) => (

          <div
            className={`why-card ${feature.color}`}
            key={index}
          >

            {/* Icon */}
            <div className="why-icon">
              {feature.icon}
            </div>

            {/* Content */}
            <div className="why-content">

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default WhyChooseUs;