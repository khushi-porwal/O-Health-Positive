
import "./CampaignSection.css";
import { Link } from "react-router-dom";

const services = [
  {
    icon: "🏥",
    title: "Surgical Coordination",
    description:
      "Support with hospital coordination and navigating planned or emergency surgical care.",
    path: "/assistance/surgical",
  },
  {
    icon: "🛡️",
    title: "Insurance Assistance",
    description:
      "Guidance with insurance workflows, treatment approvals and reimbursement processes.",
    path: "/assistance/insurance",
  },
  {
    icon: "👩‍⚕️",
    title: "Patient Care Coordination",
    description:
      "Care coordination support to help patients navigate the different stages of treatment.",
    path: "/contact",
  },
  {
    icon: "🚑",
    title: "Ambulance Support",
    description:
      "Assistance with ambulance coordination as part of the patient's healthcare journey.",
    path: "/contact",
  },
  {
    icon: "💊",
    title: "Pharmacy & Diagnostics",
    description:
      "Coordination support for medicines and diagnostic services based on patient needs.",
    path: "/contact",
  },
  {
    icon: "🤝",
    title: "Financial Assistance",
    description:
      "Guidance on available treatment-financing options for patients facing financial difficulties.",
    path: "/contact",
  },
];

function CampaignSection() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-heading">
          <p className="services-eyebrow">
            HOW WE SUPPORT YOU
          </p>

          <h2>
            Healthcare Support,
            <span> Every Step of the Way</span>
          </h2>

          <p className="services-intro">
            From surgical coordination to insurance guidance,
            we help patients navigate their healthcare journey
            with greater clarity and support.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article
              className="service-card"
              key={service.title}
            >
              <div
                className="service-icon"
                aria-hidden="true"
              >
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <Link
                to={service.path}
                className="service-link"
              >
                Get Assistance{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="services-bottom">
          <p>
            Need help navigating your healthcare journey?
          </p>

          <Link to="/contact" className="services-cta">
            Talk to Our Team →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CampaignSection;
