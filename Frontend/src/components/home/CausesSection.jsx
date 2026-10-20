
import "./CausesSection.css";

const specialties = [
  {
    icon: "🦴",
    title: "Orthopedics",
    description:
      "Healthcare coordination for orthopedic conditions and related surgical care.",
  },
  {
    icon: "❤️",
    title: "Cardiology",
    description:
      "Support in navigating hospital and specialist coordination for cardiac care.",
  },
  {
    icon: "🧠",
    title: "Neurosurgery",
    description:
      "Coordination support for patients seeking specialized neurosurgical care.",
  },
  {
    icon: "🩺",
    title: "Nephrology & Urology",
    description:
      "Assistance navigating specialist consultations and related treatment pathways.",
  },
  {
    icon: "🫀",
    title: "Organ Transplants",
    description:
      "Hospital and specialist coordination for kidney and liver transplant care.",
  },
  {
    icon: "🎗️",
    title: "Oncology",
    description:
      "Support coordinating hospitals and specialists for cancer-related treatment.",
  },
  {
    icon: "🏥",
    title: "Bariatric Surgery",
    description:
      "Guidance with hospital coordination for bariatric surgical treatment.",
  },
];

function CausesSection() {
  return (
    <section className="specialties-section" id="specialties">
      <div className="specialties-container">
        <div className="specialties-heading">
          <p className="specialties-eyebrow">OUR AREAS OF COORDINATION</p>

          <h2>
            Specialized Care,
            <span> Better Coordinated</span>
          </h2>

          <p>
            O Positive Health facilitates patient care coordination
            across a range of medical specialties through its hospital
            and doctor network.
          </p>
        </div>

        <div className="specialties-grid">
          {specialties.map((specialty) => (
            <article
              className="specialty-card"
              key={specialty.title}
            >
              <div className="specialty-icon" aria-hidden="true">
                {specialty.icon}
              </div>

              <h3>{specialty.title}</h3>

              <p>{specialty.description}</p>

              <a href="#contact" className="specialty-link">
                Enquire Now <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

        <p className="specialties-note">
          Treatment availability and coordination depend on individual
          requirements and participating healthcare providers.
        </p>
      </div>
    </section>
  );
}

export default CausesSection;
