
import { useState } from "react";
import "./MedicalFundraiser.css";

import medicalImage from "../../../assets/medical-1.png";

function MedicalFundraiser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    status: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect this form to your backend API.
    setMessage(
      "Your details are ready. Please connect the fundraiser API to submit your request."
    );
  };

  return (
    <section className="medical-fundraiser-section">
      <div className="fundraiser-left">
        <span className="fundraiser-eyebrow">
          <span className="fundraiser-dot" />
          MEDICAL FUNDRAISING
        </span>

        <h2>
          Start A FREE Medical Fundraiser &amp;
          <br className="fundraiser-desktop-break" />
          Raise Funds For Medical Treatment
        </h2>

        <p className="fundraiser-description">
          Emergency Support helps patients and families during
          critical moments. Your contribution can fund urgent
          treatment, hospital care, medicines, and life-saving
          procedures when every second matters.
        </p>

        <div className="fundraiser-image-card">
          <img
            src={medicalImage}
            alt="Child who needs medical care and support"
            loading="lazy"
          />

          <div className="fundraiser-image-caption">
            <h3>
              Need Funds to Pay For a Medical Emergency or Social Cause?
            </h3>
            <p>
              O Positive Health Foundation helps connect people
              with support for essential medical needs.
            </p>
          </div>
        </div>
      </div>

      <div className="fundraiser-form-card">
        <div className="fundraiser-form-heading">
          <span className="fundraiser-star" aria-hidden="true">
            ✦
          </span>
          <h3>Need Money Urgently</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fundraiser-field">
            <label htmlFor="fundraiser-name">Name</label>
            <input
              id="fundraiser-name"
              name="name"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fundraiser-form-row">
            <div className="fundraiser-field">
              <label htmlFor="fundraiser-email">Email ID</label>
              <input
                id="fundraiser-email"
                name="email"
                type="email"
                placeholder="Enter Email ID"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fundraiser-field">
              <label htmlFor="fundraiser-phone">Phone Number</label>
              <input
                id="fundraiser-phone"
                name="phone"
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fundraiser-field">
            <label htmlFor="fundraiser-purpose">
              What will the funds be used for?
            </label>

            <select
              id="fundraiser-purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="medical-treatment">
                Medical Treatment
              </option>
              <option value="hospital-expenses">
                Hospital Expenses
              </option>
              <option value="medicines">
                Medicines and Surgery
              </option>
              <option value="emergency">
                Medical Emergency
              </option>
              <option value="other">Other Social Cause</option>
            </select>
          </div>

          <div className="fundraiser-field">
            <label htmlFor="fundraiser-status">
              Hospitalization Status
            </label>

            <select
              id="fundraiser-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="currently-hospitalized">
                Currently Hospitalized
              </option>
              <option value="treatment-at-home">
                Treatment at Home
              </option>
              <option value="surgery-required">
                Surgery Required
              </option>
              <option value="treatment-planned">
                Treatment Planned
              </option>
            </select>
          </div>

          <p className="fundraiser-activity">
            <span>●</span> Every request deserves compassionate care.
          </p>

          <button type="submit" className="fundraiser-submit-btn">
            Start a Fundraiser
          </button>

          {message && (
            <p className="fundraiser-message" role="status">
              {message}
            </p>
          )}
        </form>

        <div className="fundraiser-hand-decoration" aria-hidden="true">
          🖐️
        </div>
      </div>
    </section>
  );
}

export default MedicalFundraiser;
