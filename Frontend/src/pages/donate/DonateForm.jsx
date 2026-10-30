import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

import logo from "../../assets/logo.jpeg";
import "./DonateForm.css";

import { createPaymentOrder } from "../../services/paymentService";

const MIN_AMOUNT = 99;
const PRESET_AMOUNTS = [99, 500, 1000, 2000];

const initialAmount = (searchParams) => {
  const amountFromUrl = Number(searchParams.get("amount"));

  return Number.isSafeInteger(amountFromUrl) && amountFromUrl >= MIN_AMOUNT
    ? amountFromUrl
    : MIN_AMOUNT;
};

const DonateForm = () => {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: initialAmount(searchParams),
    donationType: "once",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep the same key if the donor retries an unchanged one-time payment.
  const idempotencyKeyRef = useRef("");

  const amount = Number(form.amount);
  const isValidAmount =
    Number.isSafeInteger(amount) && amount >= MIN_AMOUNT;

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Any changed donor detail or amount represents a new payment attempt.
    idempotencyKeyRef.current = "";
    clearMessage();
  };

  const handleAmountSelect = (selectedAmount) => {
    setForm((previous) => ({
      ...previous,
      amount: String(selectedAmount),
    }));

    idempotencyKeyRef.current = "";
    clearMessage();
  };

  const handleFrequencySelect = (donationType) => {
    setForm((previous) => ({
      ...previous,
      donationType,
    }));

    clearMessage();

    if (donationType === "monthly") {
      showMessage(
        "Monthly donations are not active yet. PhonePe recurring payment setup is required. You can select Give Once to continue.",
        "info"
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    // Do not silently process a monthly selection as a one-time donation.
    if (form.donationType === "monthly") {
      showMessage(
        "Monthly donations are not available yet. Please select Give Once.",
        "info"
      );
      return;
    }

    const donorName = form.donorName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const donationAmount = Number(form.amount);

    if (donorName.length < 2 || donorName.length > 100) {
      showMessage("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    if (
      !Number.isSafeInteger(donationAmount) ||
      donationAmount < MIN_AMOUNT
    ) {
      showMessage(`Minimum donation amount is ₹${MIN_AMOUNT}.`);
      return;
    }

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      showMessage("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    clearMessage();

    try {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current =
          window.crypto?.randomUUID?.() ||
          `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }

      const donationPayload = {
        donorName,
        email,
        phone,
        amount: donationAmount,
        donationType: "once",
      };

      const orderResponse = await createPaymentOrder(
        donationPayload,
        idempotencyKeyRef.current
      );

      // The backend must return a real PhonePe checkout URL.
      if (
        !orderResponse?.success ||
        typeof orderResponse.checkoutUrl !== "string" ||
        !orderResponse.checkoutUrl.startsWith("https://")
      ) {
        console.error("Unexpected PhonePe order response:", orderResponse);
        showMessage(
          orderResponse?.message ||
            "PhonePe did not return a valid checkout URL. Please check the backend response and server logs."
        );
        return;
      }

      // PhonePe's hosted checkout page opens here. The QR code, if offered
      // for this order/payment method, is displayed by PhonePe on that page.
      window.location.assign(orderResponse.checkoutUrl);
    } catch (error) {
      console.error("PhonePe checkout error:", {
        status: error.response?.status,
        response: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 409) {
        showMessage(
          "A donation attempt already exists and is pending. Please check its PhonePe payment status before starting another payment."
        );
      } else {
        showMessage(
          error.response?.data?.message ||
            "Unable to start payment. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <MainHeader />
      <CrowdfundingHeader />

      <section className="donate-form-section">
        <div className="donate-form-container">
          {/* Left information panel */}
          <div className="donate-form-left">
            <img
              src={logo}
              alt="O Positive Health"
              className="donate-form-logo"
            />

            <p className="donate-form-eyebrow">
              O POSITIVE HEALTH · CARE BEFORE CURE
            </p>

            <h1>
              Small Donations.
              <br />
              Big Changes.
            </h1>

            <p className="donate-form-description">
              Your contribution can help people access healthcare, treatment
              and support when they need it most.
            </p>

            <div className="donate-form-impact">
              <div className="donate-impact-item">
                <span className="donate-impact-icon" aria-hidden="true">
                  ❤️
                </span>
                <div>
                  <h3>Your Support Matters</h3>
                  <p>Every contribution can make a difference.</p>
                </div>
              </div>

              <div className="donate-impact-item">
                <span className="donate-impact-icon" aria-hidden="true">
                  🤝
                </span>
                <div>
                  <h3>Help People in Need</h3>
                  <p>Support healthcare initiatives and communities.</p>
                </div>
              </div>

              <div className="donate-impact-item">
                <span className="donate-impact-icon" aria-hidden="true">
                  🔒
                </span>
                <div>
                  <h3>Secure Checkout</h3>
                  <p>Payments are processed through PhonePe.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right donation form */}
          <div className="donate-form-right">
            <div className="donate-form-heading">
              <h2>Make a Donation</h2>
              <p>Choose an amount and enter your details below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Donation frequency toggle */}
              <div className="donate-frequency">
                <button
                  type="button"
                  className={`donate-frequency-btn ${
                    form.donationType === "once" ? "active" : ""
                  }`}
                  onClick={() => handleFrequencySelect("once")}
                  aria-pressed={form.donationType === "once"}
                >
                  Give Once
                </button>

                <button
                  type="button"
                  className={`donate-frequency-btn ${
                    form.donationType === "monthly" ? "active" : ""
                  }`}
                  onClick={() => handleFrequencySelect("monthly")}
                  aria-pressed={form.donationType === "monthly"}
                >
                  Give Monthly
                </button>
              </div>

              {/* Donation amount */}
              <div className="donate-amount-section">
                <label className="donate-field-label">
                  Select Donation Amount
                </label>

                <div className="donate-amount-options">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`donate-amount-option ${
                        amount === preset ? "active" : ""
                      }`}
                      onClick={() => handleAmountSelect(preset)}
                      aria-pressed={amount === preset}
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <label
                  htmlFor="donation-amount"
                  className="donate-field-label"
                >
                  Or enter a custom amount (minimum ₹{MIN_AMOUNT})
                </label>

                <div className="donate-amount-input-wrap">
                  <span aria-hidden="true">₹</span>
                  <input
                    id="donation-amount"
                    type="number"
                    name="amount"
                    min={MIN_AMOUNT}
                    step="1"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    aria-describedby="donation-amount-help"
                  />
                </div>

                <small id="donation-amount-help">
                  Minimum donation amount is ₹{MIN_AMOUNT}.
                </small>
              </div>

              {/* Donation summary */}
              <div className="donate-summary">
                <span>
                  {form.donationType === "monthly"
                    ? "Monthly donation"
                    : "Your donation"}
                </span>
                <strong>
                  ₹
                  {Number.isFinite(amount) && amount >= 0
                    ? amount.toLocaleString("en-IN")
                    : "0"}
                </strong>
              </div>

              {/* Donor information */}
              <div className="donate-personal-details">
                <label htmlFor="donorName" className="donate-field-label">
                  Full Name
                </label>
                <input
                  id="donorName"
                  type="text"
                  name="donorName"
                  placeholder="Enter your full name"
                  value={form.donorName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
                />

                <label htmlFor="email" className="donate-field-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  required
                />

                <label htmlFor="phone" className="donate-field-label">
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  autoComplete="tel"
                />
              </div>

              {/* Status message */}
              {message && (
                <div
                  className={`donate-message ${messageType}`}
                  role={messageType === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  {message}
                </div>
              )}

              {/* Payment button */}
              <button
                type="submit"
                className="donate-submit-btn"
                disabled={
                  loading ||
                  !isValidAmount ||
                  form.donationType === "monthly"
                }
              >
                {loading
                  ? "Opening PhonePe..."
                  : `Donate Now ₹${
                      Number.isFinite(amount) && amount >= 0
                        ? amount.toLocaleString("en-IN")
                        : "0"
                    }`}
              </button>

              <p className="donate-secure-note">
                <span aria-hidden="true">🔒</span> Secure payment powered by
                PhonePe. Your payment will be verified by our server.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DonateForm;
