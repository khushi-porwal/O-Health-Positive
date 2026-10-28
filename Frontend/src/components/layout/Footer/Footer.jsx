
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import newsletterImage from "../../../assets/news.png";
import logo from "../../../assets/logo.jpeg";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setMessage(
      "Thank you for your interest! Newsletter signup is not connected yet."
    );
    setEmail("");
  };

  const quickLinks = [
    { label: "Explore Campaigns", href: "/campaigns" },
    { label: "Monthly Donation", href: "/monthly-donation" },
    { label: "Start New Campaign", href: "/start-campaign" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/contact" },
  ];

  const informationLinks = [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Refund and Cancellation Policy", href: "/refund-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "FAQs", href: "/faq" },
    { label: "Documents", href: "/documents" },
  ];

  return (
    <footer className="site-footer">
      {/* Newsletter */}
      <div className="newsletter-banner">
        <span className="newsletter-heart heart-one" aria-hidden="true">
          ♥
        </span>
        <span className="newsletter-heart heart-two" aria-hidden="true">
          ♥
        </span>
        <span className="newsletter-heart heart-three" aria-hidden="true">
          ♥
        </span>

        <div className="newsletter-visual">
          <img
            src={newsletterImage}
            alt="Children sharing a joyful moment"
            className="newsletter-children"
            loading="lazy"
          />
          <span className="newsletter-hand" aria-hidden="true">
            ♥
          </span>
        </div>

        <div className="newsletter-content">
          <span className="newsletter-eyebrow">
            CARE • COMPASSION • HOPE
          </span>

          <h2>Subscribe to Our Newsletter</h2>
          <p>Join us in spreading hope.</p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label
              className="newsletter-sr-only"
              htmlFor="newsletter-email"
            >
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button type="submit">Subscribe</button>
          </form>

          {message && (
            <p className="newsletter-message" role="status">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Footer information */}
      <div className="footer-main">
        <div className="footer-about">
          <Link to="/" className="footer-logo-link" aria-label="Home">
            <img src={logo} alt="O Positive Health Foundation" />
          </Link>

          <p>
            We are committed to making healthcare more accessible
            and bringing hope to communities through compassionate
            care, awareness and meaningful support.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              f
            </a>

            <a
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              in
            </a>

            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              ◎
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links-column">
          <h3>Quick Links</h3>

          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information links */}
        <div className="footer-links-column footer-information">
          <h3>Information</h3>

          <ul>
            {informationLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <address>
            <p>
              <span className="footer-contact-icon" aria-hidden="true">
                ⌖
              </span>
              <span>
                Add your foundation's verified office address here.
              </span>
            </p>

            <p>
              <span className="footer-contact-icon" aria-hidden="true">
                ✉
              </span>
              <a href="mailto:contact@yourfoundation.org">
                Add your official email
              </a>
            </p>

            <p>
              <span className="footer-contact-icon" aria-hidden="true">
                ☎
              </span>
              <a href="tel:+910000000000">
                Add your contact number
              </a>
            </p>
          </address>

          <div className="footer-payments">
            <h3>We Accept</h3>

            <div className="payment-methods">
              <span className="payment-card mastercard">MC</span>
              <span className="payment-card visa">VISA</span>
              <span className="payment-card upi">UPI</span>
              <span className="payment-card amex">AMEX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} O Positive Health Foundation.
          All rights reserved.
        </p>

        <span className="footer-bottom-heart">
          Made with ♥ for humanity
        </span>
      </div>
    </footer>
  );
}

export default Footer;
