import Navbar from "../../components/layout/Navbar/Navbar"
import MainHeader from "../../components/layout/Header/Header"
import Footer from "../../components/layout/Footer/Footer"
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { donationFormService } from "../../services/donationformservice";
import logo from "../../assets/logo.jpeg";
import "./DonateForm.css";

export default function DonateForm() {
  const [searchParams] = useSearchParams();
  const initialAmount = Number(searchParams.get("amount")) || 5000;

  const [form, setForm] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: initialAmount,
    donationType: "once",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const amount = Number(form.amount);
  const validAmount = Number.isSafeInteger(amount) && amount >= 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleAmountSelect = (value) => {
    setForm((prev) => ({ ...prev, amount: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!validAmount) {
      setError(true);
      setMessage("Minimum donation amount is ₹500 (whole rupees only).");
      return;
    }

    try {
      setLoading(true);

      const data = await donationFormService({
        ...form,
        amount,
      });

      if (!data.success) {
        throw new Error(data.message || "Unable to save donation.");
      }

      setMessage(
        `Donation details saved successfully! Reference ID: ${
          data.donation?.id || "Created"
        }. Payment has not been processed.`
      );

      setForm((prev) => ({
        ...prev,
        donorName: "",
        email: "",
        phone: "",
      }));
    } catch (err) {
      setError(true);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <MainHeader/>
    <main className="donation-page">
      <div className="donation-layout">
        {/* LEFT IMPACT PANEL */}
        <aside className="donation-impact">
          <div className="impact-decoration impact-decoration-top">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="impact-dots" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="impact-content">
            <img
              src={logo}
              alt="O Positive Health Foundation"
              className="impact-logo"
            />

            <p className="impact-eyebrow">O POSITIVE HEALTH FOUNDATION</p>
            <span className="impact-line" />

            <h1>
              Small Donations.
              <br />
              Big Changes.
            </h1>

            <p className="impact-description">
              Your kindness can bring healthcare, hope and a better tomorrow
              to people who need it most.
            </p>

            <div className="impact-message">
              <span className="impact-heart" aria-hidden="true">♡</span>
              <p>Every act of care makes a difference.</p>
            </div>
          </div>

          <div className="impact-bottom-art" aria-hidden="true">
            <div className="impact-orbit orbit-one" />
            <div className="impact-orbit orbit-two" />
            <div className="impact-orbit orbit-three" />

            <div className="impact-stat">
              <span className="impact-stat-icon">✚</span>
              <div>
                <strong>Care Before Cure</strong>
                <small>Compassion in every contribution</small>
              </div>
            </div>
          </div>

          <div className="impact-decoration impact-decoration-bottom">
            <span />
            <span />
            <span />
            <span />
          </div>
        </aside>

        {/* RIGHT DONATION FORM */}
        <section className="donation-form-panel">
          <header className="form-header">
            <div className="form-kicker">
              <span className="form-kicker-icon">✦</span>
              <span>MAKE A DONATION</span>
            </div>

            <h2>Your kindness matters!</h2>

            <p>
              Your contribution supports our mission to make healthcare and
              hope accessible to those in need.
            </p>
          </header>

          <form className="donation-form" onSubmit={handleSubmit}>
            {/* DONATION FREQUENCY */}
            <div className="frequency-switch">
              <button
                type="button"
                className={
                  form.donationType === "once" ? "frequency-active" : ""
                }
                onClick={() => {
                  setForm((prev) => ({ ...prev, donationType: "once" }));
                  setMessage("");
                }}
              >
                Give Once
              </button>

              <button
                type="button"
                className={
                  form.donationType === "monthly" ? "frequency-active" : ""
                }
                onClick={() => {
                  setForm((prev) => ({ ...prev, donationType: "monthly" }));
                  setMessage("");
                }}
              >
                Give Monthly
              </button>
            </div>

            {/* AMOUNT */}
            <div className="donation-field">
              <label htmlFor="amount">Choose your donation amount</label>

              <div className="amount-presets">
                {[500, 1000, 2000, 5000].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={
                      Number(form.amount) === value ? "amount-selected" : ""
                    }
                    onClick={() => handleAmountSelect(value)}
                  >
                    ₹{value.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              <div className="amount-input-wrap">
                <span>₹ INR</span>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="500"
                  step="1"
                  required
                  aria-describedby="amount-hint"
                />
              </div>

              <small id="amount-hint" className="field-hint">
                Minimum donation: ₹500
              </small>
            </div>

            {/* DONATION SUMMARY */}
            <div className="donation-summary">
              <div>
                <span>Donation amount</span>
                <strong>
                  ₹{(Number.isFinite(amount) && amount >= 0
                    ? amount
                    : 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="summary-total">
                <span>Total amount</span>
                <strong>
                  ₹{(Number.isFinite(amount) && amount >= 0
                    ? amount
                    : 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* DONOR DETAILS */}
            <div className="donor-details-heading">
              <h3>Your details</h3>
              <p>Please enter your contact information.</p>
            </div>

            <div className="donor-fields-grid">
              <div className="donation-field">
                <label htmlFor="donorName">
                  Full name <span>*</span>
                </label>
                <input
                  id="donorName"
                  name="donorName"
                  value={form.donorName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="donation-field">
                <label htmlFor="email">
                  Email address <span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="donation-field full-width-field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  maxLength={15}
                />
              </div>
            </div>

            <p className="donation-privacy">
              Your information will be used to manage your donation record.
            </p>

            <button
              type="submit"
              className="donation-submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : `Continue with ₹${(
                    Number.isFinite(amount) && amount >= 0 ? amount : 0
                  ).toLocaleString("en-IN")}`}
              {!loading && <span aria-hidden="true">→</span>}
            </button>

            {message && (
              <div
                className={error ? "donation-message error" : "donation-message success"}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <p className="donation-payment-note">
              <span aria-hidden="true">ⓘ</span>
              No payment will be collected at this stage.
            </p>
          </form>
        </section>
      </div>
    </main>
    <Footer/>
    </>
  );
}
