
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaExternalLinkAlt,
  FaHeart,
} from "react-icons/fa";

import "./Contact.css";
import MainHeader from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import Navbar from "../../components/layout/Navbar/Navbar";

import { createContact } from "../../services/contactService";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // IMPORTANT: Backend expects "name", not "fullName"
    const data = {
      name: formData.get("fullName")?.trim(),
      phone: formData.get("phone")?.trim(),
      email: formData.get("email")?.trim(),
      subject: formData.get("subject")?.trim(),
      message: formData.get("message")?.trim(),
    };

    setFormMessage("");
    setIsError(false);

    if (
      !data.name ||
      !data.phone ||
      !data.email ||
      !data.subject ||
      !data.message
    ) {
      setIsError(true);
      setFormMessage("Please fill in all required fields.");
      return;
    }

    // Accept digits, spaces, parentheses, hyphens and an optional +
    const normalizedPhone = data.phone.replace(/[\s()-]/g, "");
    const phonePattern = /^\+?[0-9]{10,15}$/;

    if (!phonePattern.test(normalizedPhone)) {
      setIsError(true);
      setFormMessage(
        "Please enter a valid phone number with 10–15 digits."
      );
      return;
    }

    data.phone = normalizedPhone;

    try {
      setLoading(true);

      const response = await createContact(data);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to submit your enquiry."
        );
      }

      setFormMessage(
        response?.message ||
          "Thank you! Your enquiry has been submitted successfully."
      );

      form.reset();
    } catch (error) {
      console.error("Contact submission failed:", error);
      console.error(
        "Backend response:",
        JSON.stringify(error.response?.data, null, 2)
      );

      setIsError(true);

      setFormMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <MainHeader />

      <main className="contact-page">
        {/* Header Banner */}
        <section className="contact-banner">
          <div className="banner-decoration banner-left">
            <FaHeart />
          </div>

          <div className="banner-content">
            <span className="banner-label">
              O POSITIVE HEALTH FOUNDATION
            </span>
            <h1>Contact Us</h1>
            <p>Your enquiry is valuable to us</p>
          </div>

          <div className="banner-decoration banner-right">
            <FaHeart />
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-wrapper">
          {/* Left Side */}
          <div className="contact-info">
            <div className="section-heading">
              <span className="heading-line"></span>
              <h2>Get in touch</h2>
            </div>

            <p className="contact-description">
              Access our support team for healthcare assistance,
              guidance, and any questions you may have.
            </p>

            {/* Address Card */}
            <div className="contact-card address-card">
              <div className="contact-icon blue-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span className="card-label">Our Location</span>
                <p>
                  Add your foundation's complete address here.
                </p>
              </div>
            </div>

            {/* Phone and Email */}
            <div className="contact-details-grid">
              <div className="contact-card">
                <div className="contact-icon green-icon">
                  <FaPhoneAlt />
                </div>

                <div>
                  <span className="card-label">Helpline Number</span>
                  <a href="tel:+910000000000">
                    +91 00000 00000
                  </a>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon purple-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span className="card-label">Email Address</span>
                  <a href="mailto:your-email@example.com">
                    your-email@example.com
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="contact-map">
              <iframe
                title="O Positive Health Foundation Location"
                src="https://maps.google.com/maps?q=Jodhpur%2C%20Rajasthan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <a
                className="map-link"
                href="https://www.google.com/maps/search/?api=1&query=Jodhpur%2C%20Rajasthan"
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps <FaExternalLinkAlt />
              </a>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-card">
            <div className="form-heading">
              <span className="form-heading-icon">
                <FaHeart />
              </span>
              <h2>Fill the details</h2>
            </div>

            <p className="form-description">
              Tell us how we can help you.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name <span>*</span>
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter Full Name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">
                    Contact number <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter Contact number"
                    autoComplete="tel"
                    maxLength={18}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email ID <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email ID"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="subject">
                    Subject <span>*</span>
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Enter Subject"
                    maxLength={200}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className="form-group message-group">
                <label htmlFor="message">
                  Message <span>*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter Your Message"
                  rows="4"
                  maxLength={5000}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="form-bottom">
                <p className="required-note">
                  <span>*</span> Required fields
                </p>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                  {!loading && <span>→</span>}
                </button>
              </div>

              {/* Success/Error Message */}
              {formMessage && (
                <div
                  className={`contact-form-message ${
                    isError
                      ? "contact-form-error"
                      : "contact-form-success"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {formMessage}
                </div>
              )}
            </form>

            <div className="form-decoration" aria-hidden="true">
              <FaHeart />
              <span>Care before cure</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;