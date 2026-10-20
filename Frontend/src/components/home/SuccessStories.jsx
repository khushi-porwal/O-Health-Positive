
import "./SuccessStories.css";
import {Link} from "react-router-dom"
const patientSupport = [
  {
    number: "01",
    title: "Personalized Care",
    description:
      "A dedicated coordination approach designed around each patient's healthcare needs.",
  },
  {
    number: "02",
    title: "Guidance Through Treatment",
    description:
      "Support in navigating consultations, diagnostics, admission, and treatment-related processes.",
  },
  {
    number: "03",
    title: "Support Beyond Treatment",
    description:
      "Coordination for discharge, follow-up consultations, and post-treatment assistance.",
  },
];

function SuccessStories() {
  return (
    <section className="success-section" id="patient-care">
      <div className="success-container">
        <div className="success-heading">
          <span className="success-label">PATIENT-CENTRED CARE</span>

          <h2>
            Our Patients Hold Us in <span>High Esteem</span>
          </h2>

          <p>
            Healthcare is more than treatment. It is about guiding patients
            through every stage of their journey with care and coordination.
          </p>
        </div>

        <div className="success-grid">
          {patientSupport.map((item) => (
            <article className="success-card" key={item.number}>
              <span className="success-number">{item.number}</span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="success-bottom">
          <h3>Your Healthcare Journey Matters</h3>

          <p>
            Connect with our team to learn more about available
            patient-support and coordination services.
          </p>

          <Link to="/contact" className="success-button">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SuccessStories;
