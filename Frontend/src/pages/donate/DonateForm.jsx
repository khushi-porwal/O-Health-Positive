
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
const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const initialAmount = (searchParams) => {
  const amountFromUrl = Number(searchParams.get("amount"));

  return Number.isSafeInteger(amountFromUrl) &&
    amountFromUrl >= MIN_AMOUNT
    ? amountFromUrl
    : 5000;
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

  // Reuse the key for a retry of the same donation.
  const idempotencyKeyRef = useRef("");

  const amount = Number(form.amount);

  const isValidAmount =
    Number.isSafeInteger(amount) && amount >= MIN_AMOUNT;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // A changed form represents a new donation attempt.
    idempotencyKeyRef.current = "";
    setMessage("");
    setMessageType("");
  };

  const handleAmountSelect = (selectedAmount) => {
    setForm((previous) => ({
      ...previous,
      amount: selectedAmount,
    }));

    idempotencyKeyRef.current = "";
    setMessage("");
    setMessageType("");
  };

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (loading) return;

  //   const donorName = form.donorName.trim();
  //   const email = form.email.trim().toLowerCase();
  //   const phone = form.phone.trim();

  //   if (donorName.length < 2 || donorName.length > 100) {
  //     showMessage("Please enter your full name.");
  //     return;
  //   }

  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     showMessage("Please enter a valid email address.");
  //     return;
  //   }

  //   if (!isValidAmount) {
  //     showMessage(`Minimum donation amount is ₹${MIN_AMOUNT}.`);
  //     return;
  //   }

  //   if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
  //     showMessage("Please enter a valid phone number.");
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage("");
  //   setMessageType("");

  //   try {
  //     if (!idempotencyKeyRef.current) {
  //       idempotencyKeyRef.current =
  //         window.crypto?.randomUUID?.() ||
  //         `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  //     }

  //     // Create a pending donation and initiate PhonePe checkout.
  //     const orderResponse = await createPaymentOrder(
  //       {
  //         donorName,
  //         email,
  //         phone,
  //         amount,
  //         donationType: "once",
  //       },
  //       idempotencyKeyRef.current
  //     );

  //     if (!orderResponse?.success || !orderResponse?.checkoutUrl) {
  //       throw new Error(
  //         orderResponse?.message ||
  //           "Unable to start PhonePe checkout."
  //       );
  //     }

  //     // Redirect the donor to the PhonePe checkout page.
  //     window.location.assign(orderResponse.checkoutUrl);
  //   } catch (error) {
  //     console.error("PhonePe checkout error:", error);

  //     showMessage(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Unable to start payment. Please try again.",
  //       "error"
  //     );

  //     setLoading(false);
  //   }
  // };


  
const handleSubmit = async (event) => {
  event.preventDefault();

  if (loading) return;

  const donorName = form.donorName.trim();
  const email = form.email.trim().toLowerCase();
  const phone = form.phone.trim();
  const amount = Number(form.amount);

  if (donorName.length < 2 || donorName.length > 100) {
    showMessage("Please enter your full name.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }

  if (!Number.isSafeInteger(amount) || amount < MIN_AMOUNT) {
    showMessage(`Minimum donation amount is ₹${MIN_AMOUNT}.`);
    return;
  }

  if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    showMessage("Please enter a valid phone number.");
    return;
  }

  setLoading(true);
  setMessage("");
  setMessageType("");

  try {
    // Reuse the same key for this attempt.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        window.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const donationPayload = {
      donorName,
      email,
      phone,
      amount,
      donationType: "once",
    };

    const orderResponse = await createPaymentOrder(
      donationPayload,
      idempotencyKeyRef.current
    );

    if (!orderResponse?.success || !orderResponse?.checkoutUrl) {
      showMessage(
        orderResponse?.message || "Unable to start PhonePe checkout."
      );
      return;
    }

    // Redirect only after the backend returns a checkout URL.
    window.location.assign(orderResponse.checkoutUrl);
  } catch (error) {
    console.error("PhonePe checkout error:", {
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    });

    const status = error.response?.status;
    const response = error.response?.data;

    if (status === 409) {
      showMessage(
        "A donation attempt already exists and is pending. Please check its PhonePe payment status before starting another payment."
      );
    } else {
      showMessage(
        response?.message ||
          "Unable to start payment. Please check the server logs and try again."
      );
    }
  } finally {
    setLoading(false);
  }
};


  const handleMonthlyClick = () => {
    showMessage(
      "Monthly donations will be available once PhonePe recurring payments are configured.",
      "info"
    );
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
              Your contribution can help people access healthcare,
              treatment and support when they need it most.
            </p>

            <div className="donate-form-impact">
              <div className="donate-impact-item">
                <span className="donate-impact-icon">❤️</span>
                <div>
                  <h3>Your Support Matters</h3>
                  <p>Every contribution can make a difference.</p>
                </div>
              </div>

              <div className="donate-impact-item">
                <span className="donate-impact-icon">🤝</span>
                <div>
                  <h3>Help People in Need</h3>
                  <p>Support healthcare initiatives and communities.</p>
                </div>
              </div>

              <div className="donate-impact-item">
                <span className="donate-impact-icon">🔒</span>
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
              {/* Donation frequency */}
              <div className="donate-frequency">
                <button
                  type="button"
                  className="donate-frequency-btn active"
                  aria-pressed="true"
                >
                  Give Once
                </button>

                <button
                  type="button"
                  className="donate-frequency-btn"
                  onClick={handleMonthlyClick}
                  aria-pressed="false"
                >
                  Give Monthly
                </button>
              </div>

              {/* Amount presets */}
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
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <label
                  htmlFor="donation-amount"
                  className="donate-field-label"
                >
                  Or enter a custom amount (minimum ₹99)
                </label>

                <div className="donate-amount-input-wrap">
                  <span>₹</span>

                  <input
                    id="donation-amount"
                    type="number"
                    name="amount"
                    min={MIN_AMOUNT}
                    step="1"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Donation summary */}
              <div className="donate-summary">
                <span>Your donation</span>
                <strong>
                  ₹
                  {(
                    Number.isFinite(amount) && amount >= 0 ? amount : 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* Donor information */}
              <div className="donate-personal-details">
                <label
                  htmlFor="donorName"
                  className="donate-field-label"
                >
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
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="donate-submit-btn"
                disabled={loading || !isValidAmount}
              >
                {loading
                  ? "Redirecting to PhonePe..."
                  : `Donate ₹${
                      Number.isFinite(amount) && amount >= 0
                        ? amount.toLocaleString("en-IN")
                        : "0"
                    }`}
              </button>

              <p className="donate-secure-note">
                <span>🔒</span> Secure payment powered by PhonePe.
                Your payment will be verified by our server.
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
