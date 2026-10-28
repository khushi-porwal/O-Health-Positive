import { useState } from "react";
import "./DonationSection.css";

const presetAmounts = [500, 1000, 2000, 5000];

export default function DonationSection() {
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAmount =
    customAmount.trim() !== ""
      ? Number(customAmount)
      : amount;

  const handleDonate = async () => {
    setError("");

    if (
      !Number.isFinite(selectedAmount) ||
      selectedAmount < 500 ||
      !Number.isInteger(selectedAmount)
    ) {
      setError("Donation amount must be at least ₹500.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/donations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: selectedAmount,
            frequency,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to initiate donation."
        );
      }

      // Connect the payment gateway checkout here.
      console.log("Donation initiated:", data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="donation-section" id="donate">
      <div className="donation-intro">
        <h2>Make a Difference Today</h2>
        <p>
          Your support helps us provide care and create
          a healthier future for everyone.
        </p>
      </div>

      <div className="donation-panel">
        <div className="donation-tabs">
          <button
            className={frequency === "once" ? "active" : ""}
            onClick={() => setFrequency("once")}
            type="button"
          >
            Give Once
          </button>

          <button
            className={frequency === "monthly" ? "active" : ""}
            onClick={() => setFrequency("monthly")}
            type="button"
          >
            Give Monthly
          </button>
        </div>

        <p className="donation-label">
          Choose your donation amount
        </p>

        <div className="donation-amounts">
          {presetAmounts.map((value) => (
            <button
              type="button"
              key={value}
              className={
                !customAmount && amount === value
                  ? "selected"
                  : ""
              }
              onClick={() => {
                setAmount(value);
                setCustomAmount("");
                setError("");
              }}
            >
              ₹{value.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        <label htmlFor="custom-donation">
          Custom donation amount (minimum ₹500)
        </label>

        <input
          id="custom-donation"
          type="number"
          min="500"
          step="1"
          value={customAmount}
          placeholder="Enter amount in ₹"
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setError("");
          }}
        />

        {error && (
          <p className="donation-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="donate-button"
          type="button"
          onClick={handleDonate}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : frequency === "monthly"
              ? "Start Monthly Donation"
              : "Donate Now"}
        </button>
      </div>
    </section>
  );
}