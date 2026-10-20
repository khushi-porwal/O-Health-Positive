
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { registerVolunteer } from "../../services/volunteerService";
import "./Volunteer.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  interest: "",
  motivation: "",
};

function Volunteer() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await registerVolunteer(formData);

      setMessage(
        result.message || "Your volunteer application was submitted successfully!"
      );

      setFormData(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="volunteer-page">
        <section className="volunteer-hero">
          <div className="volunteer-hero-content">
            <span className="volunteer-eyebrow">
              BE PART OF THE CHANGE
            </span>

            <h1>
              Your Time Can Make
              <span> a Difference.</span>
            </h1>

            <p>
              Join O Positive Health and help patients and families
              navigate their healthcare journey with care, compassion
              and support.
            </p>

            <div className="volunteer-highlights">
              <div className="volunteer-highlight">
                <span className="volunteer-highlight-icon">♡</span>
                <div>
                  <strong>Make an impact</strong>
                  <span>Support people who need care.</span>
                </div>
              </div>

              <div className="volunteer-highlight">
                <span className="volunteer-highlight-icon">✚</span>
                <div>
                  <strong>Share your skills</strong>
                  <span>Contribute in your own way.</span>
                </div>
              </div>

              <div className="volunteer-highlight">
                <span className="volunteer-highlight-icon">✧</span>
                <div>
                  <strong>Be part of our community</strong>
                  <span>Help make healthcare journeys easier.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="volunteer-form-card">
            <div className="volunteer-form-heading">
              <span className="volunteer-form-label">
                JOIN OUR COMMUNITY
              </span>

              <h2>Volunteer Registration</h2>

              <p>
                Tell us a little about yourself. Our team will review
                your application.
              </p>
            </div>

            {message && (
              <div className="volunteer-alert success" role="status">
                <strong>Application submitted!</strong>
                <p>{message}</p>
              </div>
            )}

            {error && (
              <div className="volunteer-alert error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="volunteer-form-grid">
                <div className="volunteer-field">
                  <label htmlFor="volunteer-name">Full name *</label>
                  <input
                    id="volunteer-name"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="volunteer-field">
                  <label htmlFor="volunteer-email">Email address *</label>
                  <input
                    id="volunteer-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="volunteer-field">
                  <label htmlFor="volunteer-phone">Phone number *</label>
                  <input
                    id="volunteer-phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="volunteer-field">
                  <label htmlFor="volunteer-city">City *</label>
                  <input
                    id="volunteer-city"
                    type="text"
                    name="city"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div className="volunteer-field volunteer-field-full">
                  <label htmlFor="volunteer-interest">
                    Area of interest *
                  </label>

                  <select
                    id="volunteer-interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select your preferred area
                    </option>
                    <option value="Healthcare Support">
                      Healthcare Support
                    </option>
                    <option value="Community Outreach">
                      Community Outreach
                    </option>
                    <option value="Fundraising">Fundraising</option>
                    <option value="Awareness Campaigns">
                      Awareness Campaigns
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="volunteer-field volunteer-field-full">
                  <label htmlFor="volunteer-motivation">
                    Why would you like to volunteer? *
                  </label>

                  <textarea
                    id="volunteer-motivation"
                    name="motivation"
                    placeholder="Tell us how you would like to contribute..."
                    value={formData.motivation}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={4}
                    required
                  />

                  <span className="volunteer-character-count">
                    {formData.motivation.length}/1000 characters
                  </span>
                </div>
              </div>

              <button
                className="volunteer-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
                {!loading && <span aria-hidden="true"> →</span>}
              </button>

              <p className="volunteer-privacy-note">
                Your information will be used to review your volunteer
                application.
              </p>
            </form>
          </div>
        </section>

        <section className="volunteer-bottom-note">
          <span aria-hidden="true">♡</span>
          <p>
            Every helping hand matters. Thank you for considering
            volunteering with O Positive Health.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Volunteer;
