
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./DonateNowButton.css";
import logo from "../../../assets/logo.jpeg";
const DonateNowButton = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!showPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowPopup(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup]);

  const handleContinue = () => {
    setShowPopup(false);
    navigate("/donate-form?amount=5000");
  };

  return (
    <>
      <button
        type="button"
        className="campaign-donate-btn"
        onClick={() => setShowPopup(true)}
      >
        Donate Now <span aria-hidden="true">→</span>
      </button>

      {showPopup &&
        createPortal(
          <div
            className="donate-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowPopup(false);
              }
            }}
          >
            <div
              className="donate-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="donate-title"
            >
              <button
                type="button"
                className="donate-close"
                aria-label="Close donation popup"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>

              <img
  src={logo}
  alt="O Positive Health Foundation Logo"
  className="donate-heart"
/>
               
              

              <p className="donate-brand">O POSITIVE HEALTH FOUNDATION</p>
              <p className="donate-tagline">CARE BEFORE CURE</p>

              <h2 id="donate-title">Your kindness matters!</h2>

              <p className="donate-description">
                Your contribution can help someone receive
                the healthcare they need.
              </p>

              <div className="donate-amount">
                <span>YOUR DONATION</span>
                <strong>₹5,000</strong>
                <small>One-time donation</small>
              </div>

              <p className="donate-note">
                No payment will be collected at this stage.
              </p>

              <button
                type="button"
                className="donate-continue"
                onClick={handleContinue}
              >
                Continue to Form <span aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="donate-cancel"
                onClick={() => setShowPopup(false)}
              >
                Maybe later
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default DonateNowButton;
