
import "./HowItWorks.css";

const journeyStages = [
  {
    number: "01",
    stage: "Pre-OPD",
    subtitle: "Before consultation",
    icon: "📋",
    points: [
      "Assigned medical coordinator (SPOC)",
      "Information about disease and treatment",
      "Personalized patient support",
      "Anxiety-handling assistance",
    ],
  },
  {
    number: "02",
    stage: "OPD & Diagnostics",
    subtitle: "Consultation and tests",
    icon: "🩺",
    points: [
      "Specialist and experienced doctors",
      "Priority booking",
      "Detailed prescription",
      "Diagnostic discounts",
    ],
  },
  {
    number: "03",
    stage: "Pre-IPD",
    subtitle: "Before admission",
    icon: "🤝",
    points: [
      "Cab and admission assistance",
      "Private-room coordination",
      "Insurance assistance",
      "Financial support guidance",
    ],
  },
  {
    number: "04",
    stage: "IPD",
    subtitle: "Hospital treatment",
    icon: "🏥",
    points: [
      "Priority booking",
      "Specialist surgeon coordination",
      "Advanced treatment procedures",
      "Hospital care coordination",
    ],
  },
  {
    number: "05",
    stage: "Post-IPD",
    subtitle: "Recovery and follow-up",
    icon: "💚",
    points: [
      "Diet plan and exercise chart",
      "Assisted discharge",
      "Follow-up consultation",
      "Reimbursement assistance",
    ],
  },
];

function HowItWorks() {
  return (
    <section className="journey-section" id="how-it-works">
      <div className="journey-container">
        <div className="journey-heading">
          <p className="journey-eyebrow">YOUR CARE JOURNEY</p>

          <h2>
            Support Through Every
            <span> Stage of Treatment</span>
          </h2>

          <p>
            From the first consultation to recovery, our healthcare
            coordination process is designed to help patients navigate
            each stage with guidance and support.
          </p>
        </div>

        <div className="journey-timeline">
          {journeyStages.map((item) => (
            <article className="journey-card" key={item.number}>
              <div className="journey-card-top">
                <span className="journey-number">{item.number}</span>
                <span className="journey-icon" aria-hidden="true">
                  {item.icon}
                </span>
              </div>

              <h3>{item.stage}</h3>
              <p className="journey-subtitle">{item.subtitle}</p>

              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="journey-note">
          Support and services may vary depending on the patient's
          treatment needs and applicable arrangements.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;
