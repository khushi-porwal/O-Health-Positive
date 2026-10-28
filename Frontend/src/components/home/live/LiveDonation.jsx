
import { useState } from "react";
import "./LiveDonation.css";
import impactImage from "../../../assets/live.png";
import { Link } from "react-router-dom";

const donors = [
  { id: 1, name: "Community Supporter", amount: 560, time: "Just now" },
  { id: 2, name: "Healthcare Supporter", amount: 1680, time: "Just now" },
  { id: 3, name: "Anonymous Donor", amount: 560, time: "2 min ago" },
  { id: 4, name: "Community Donor", amount: 3360, time: "3 min ago" },
  { id: 5, name: "Kindness Supporter", amount: 1000, time: "5 min ago" },
  { id: 6, name: "Anonymous Donor", amount: 750, time: "8 min ago" },
];

function LiveDonations() {
  const [showDonationMessage, setShowDonationMessage] = useState(false);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="live-donations" id="live-donations">
      <div className="live-donations-image">
        <img
          src={impactImage}
          alt="Community members supporting one another"
          loading="lazy"
        />
        <div className="live-image-overlay" />
        <span className="live-image-label">
          O POSITIVE HEALTH FOUNDATION
        </span>
      </div>

      <div className="live-donations-content">
        <div className="live-donations-header">
          <div>
            <span className="live-eyebrow">TOGETHER WE CARE</span>
            <h2>Kind Hearts Giving Today</h2>
          </div>

          <span className="live-status">
            <span className="live-status-dot" />
            LIVE
          </span>
        </div>

        <p className="live-donations-description">
          Every act of kindness can change a life. Your support helps
          bring healthcare, essential resources and hope to people
          who need it most.
        </p>

        <div className="live-donation-summary">
          <div>
            <span className="live-summary-label">
              Community donation overview
            </span>
            <strong className="live-summary-amount">
              Support those in need
            </strong>
          </div>

          <Link to="/explore" className="live-donate-button">
            Donate Now <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="live-donor-panel">
          <div className="live-donor-panel-header">
            <h3>Our Community of Supporters</h3>
            <span>{donors.length} entries</span>
          </div>

          <div className="live-donor-list">
            {donors.map((donor) => (
              <div className="live-donor-row" key={donor.id}>
                <div className="live-donor-avatar">
                  {donor.name.charAt(0).toUpperCase()}
                </div>

                <div className="live-donor-details">
                  <strong>{donor.name}</strong>
                  <span>{donor.time}</span>
                </div>

                <div className="live-donor-amount">
                  {formatAmount(donor.amount)}
                </div>
              </div>
            ))}
          </div>

          <p className="live-donor-note">
            Every contribution matters. Thank you for supporting care.
          </p>
        </div>

        {showDonationMessage && (
          <p className="live-donation-message" role="status">
            Please connect this button to your donation page.
          </p>
        )}
      </div>
    </section>
  );
}

export default LiveDonations;
