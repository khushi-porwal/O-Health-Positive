
import "./WhyChooseUs.css";
import {Link} from "react-router-dom";

const benefits = [
  {
    icon: "🤝",
    title: "End-to-End Patient Care",
    description:
      "Support and coordination throughout the patient's healthcare journey, from initial consultation to post-treatment follow-up.",
  },
  {
    icon: "🏥",
    title: "Hospital Network",
    description:
      "Coordination with hospitals and healthcare professionals to help patients navigate their treatment journey.",
  },
  {
    icon: "💳",
    title: "Insurance & Financial Guidance",
    description:
      "Assistance with insurance-related processes and guidance on available financial options.",
  },
  {
    icon: "🔎",
    title: "Cost Transparency",
    description:
      "Helping patients understand treatment-related costs and make more informed healthcare decisions.",
  },
  {
    icon: "📱",
    title: "Technology-Enabled Coordination",
    description:
      "A coordinated approach that uses technology to simplify healthcare processes and communication.",
  },
  {
    icon: "💙",
    title: "Patient-First Approach",
    description:
      "A focus on patient needs, personalized coordination, and a smoother healthcare experience.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-container">
        <div className="why-heading">
          <span className="why-label">WHY O POSITIVE HEALTH</span>

          <h2>
            Healthcare That Puts <span>You First</span>
          </h2>

          <p>
            Navigate your healthcare journey with coordinated support,
            clear guidance, and a patient-first approach.
          </p>
        </div>

        <div className="why-grid">
          {benefits.map((benefit, index) => (
            <article className="why-card" key={benefit.title}>
              <div className="why-icon">{benefit.icon}</div>

              <h3>{benefit.title}</h3>

              <p>{benefit.description}</p>
            </article>
          ))}
        </div>

        <div className="why-cta">
          <h3>Need help navigating your healthcare journey?</h3>
          <p>Connect with our team to explore the support you need.</p>
          <Link to="/contact" className="why-button">
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
