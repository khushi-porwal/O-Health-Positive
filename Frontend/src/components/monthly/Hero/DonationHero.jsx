import React, { useState } from "react";
import "./DonationHero.css";
import live from "../../../assets/live.png"
import { Link } from "react-router-dom";
const amounts = [3000, 6000, 10000, 12000, 14000];

function DonationHero() {
  const [selectedAmount, setSelectedAmount] = useState(3000);

  return (
    <section className="donation-hero">

      {/* Background Image */}
      <img
        className="hero-image"
        src={live}
        alt="Helping elderly people"
      />

      {/* Dark/Blue Overlay */}
      <div className="hero-overlay"></div>

      {/* Decorative Logo Colors */}
      <div className="color-wave wave-top"></div>
      <div className="color-wave wave-bottom"></div>


      {/* Left Content */}
      <div className="hero-content">

        <h1>
          The Light You
          <br />
          Bring To Their
          <br />
          <span>World</span>
        </h1>

        <p>
          Your kindness shines bright, bringing hope and warmth
          to every life you touch.
        </p>

        <Link to="/explore" className="hero-donate-btn">
          <span>♡</span>
          Donate Monthly Now
        </Link>

      </div>


      {/* Donation Card */}
      <div className="donation-card">

        <h2>
          <span className="spark">✦</span>
          Save A Life <span>Every Month</span>
        </h2>


        {/* Cause */}
        <label>Select Cause</label>

        <select>
          <option>Select Cause</option>
          <option>Medical Treatment</option>
          <option>Children</option>
          <option>Elderly Care</option>
          <option>Education</option>
          <option>Food & Nutrition</option>
        </select>


        {/* Amount Buttons */}
        <div className="amount-grid">

          {amounts.map((amount) => (
            <button
              key={amount}
              className={
                selectedAmount === amount
                  ? "amount active"
                  : "amount"
              }
              onClick={() => setSelectedAmount(amount)}
            >
              ₹{amount.toLocaleString("en-IN")}
            </button>
          ))}

        </div>


        {/* Selected Amount */}
        <div className="selected-amount">
          <span>₹</span>

          <input
            type="text"
            value={selectedAmount.toLocaleString("en-IN")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              if (value) {
                setSelectedAmount(Number(value));
              }
            }}
          />
        </div>


        {/* Donate Button */}
        <button className="monthly-donate-btn">
          <span>♡</span>
          Donate Monthly
        </button>

      </div>

    </section>
  );
}

export default DonationHero;