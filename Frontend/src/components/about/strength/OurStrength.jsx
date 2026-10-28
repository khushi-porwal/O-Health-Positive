import React from "react";
import "./OurStrength.css";

const cards = [
  {
    title: "We Understand",
    icon: "💡",
    color: "blue",
    text: `We hold campaigners in high regard, recognizing the difficulties they endure. We empathize with the challenges they face, particularly in the context of medical emergencies, and understand the profound value of financial assistance during these critical moments. Our commitment is rooted in the understanding of their plight, and we stand ready to offer support and aid to alleviate their burdens.`,
  },
  {
    title: "Receive Regular Updates",
    icon: "↻",
    color: "green",
    text: `We highly value your experience from the moment you decide to make a donation, throughout the process, and even after. As a token of our commitment to transparency, you will receive consistent updates from the campaign you supported. These updates will keep you informed about the journey of your donation, including details on delivery, distribution, and the impactful use of the products. Your connection with the cause remains a priority for us, and we want you to witness the positive change your generosity brings.`,
  },
  {
    title: "Safe and Transparent",
    icon: "♡",
    color: "blue",
    text: `We take pride in ensuring transparency in our donation process. All the items you contribute to are directly delivered to the designated NGOs by our team. There are no monetary transactions involved with the NGOs; you have clear visibility into the specific items you donate and their intended destination. Your generosity directly translates into tangible impact, and we are committed to providing you with a clear and direct channel to make a positive difference.`,
  },
  {
    title: "Verified Campaigner",
    icon: "📣",
    color: "purple",
    text: `Prior to featuring any campaign on our platform, our dedicated team conducts thorough assessments by physically visiting the locations of NGOs or individuals. This meticulous process involves verifying the authenticity of their work and confirming the genuine need for their campaign. Only after confirming the legitimacy of their efforts do we onboard them on our platform. This ensures that every campaign showcased on our platform is authentic and aligned with our commitment to supporting genuine causes.`,
  },
];

function OurStrength() {
  return (
    <section className="strength-section">
      <div className="strength-container">

        {/* Small Heading */}
        <div className="strength-label">
          <span className="label-icon">✣</span>
          <span>Our Strength</span>
        </div>

        {/* Main Heading */}
        <h2 className="strength-heading">
          Our Strength Is To Transform
          <br />
          <span className="green-text">Kindness</span>{" "}
          <span className="blue-text">Into Action, Hope,</span>{" "}
          <span className="purple-text">Healing,</span>
          <br />
          <span className="blue-text">And Dignity.</span>
        </h2>

        {/* Cards */}
        <div className="strength-grid">
          {cards.map((card, index) => (
            <div className="strength-card" key={index}>

              <div className={`icon-box ${card.color}`}>
                <span>{card.icon}</span>
              </div>

              <h3>{card.title}</h3>

              <p>{card.text}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default OurStrength;