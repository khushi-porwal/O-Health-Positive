
import React, { useState } from "react";
import { FaHeart, FaPlus, FaTrash } from "react-icons/fa";
import "./Campaign.css";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";

import campaignImage from "../../assets/news.png";
import { createCampaign } from "../../services/volunteerService";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
const Campaign = () => {
  const [socialLinks, setSocialLinks] = useState([""]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSocialChange = (index, value) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? value : link))
    );
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, ""]);
  };

  const removeSocialLink = (index) => {
    setSocialLinks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!acceptedTerms) {
      setIsError(true);
      setFormMessage(
        "Please accept the Terms of Use and Privacy Policy."
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const phone = formData.get("phone")?.trim() || "";
    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      setIsError(true);
      setFormMessage("Please enter a valid phone number.");
      return;
    }

    const data = {
      campaignerName: formData.get("campaignerName")?.trim(),
      cause: formData.get("cause"),
      email: formData.get("email")?.trim(),
      phone: normalizedPhone,
      socialLinks: socialLinks
        .map((link) => link.trim())
        .filter(Boolean),
      description: formData.get("description")?.trim(),
      acceptedTerms,
    };

    setIsSubmitting(true);
    setFormMessage("");
    setIsError(false);

    try {
      const response = await createCampaign(data);

      setFormMessage(
        response?.message ||
          "Your campaign request has been submitted successfully!"
      );
      setIsError(false);

      form.reset();
      setSocialLinks([""]);
      setAcceptedTerms(false);
    } catch (error) {
      console.error(
        "Campaign submission failed:",
        error.response?.data || error.message
      );

      setIsError(true);
      setFormMessage(
        error.response?.data?.message ||
          "Unable to submit your campaign request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <MainHeader />

      <main className="campaign-page">
        <section className="campaign-wrapper">
          {/* LEFT IMAGE SECTION */}
          <div className="campaign-visual">
            <div className="campaign-image-frame">
              <div className="campaign-image-accent"></div>

              <img
                src={campaignImage}
                alt="Children learning together"
                className="campaign-main-image"
              />
            </div>

            <div className="campaign-image-caption">
              <FaHeart />
              <p>Every contribution can make a difference.</p>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="campaign-form-card">
            <div className="campaign-form-heading">
              <span className="campaign-heading-sparkle">✦</span>
              <h2>I am raising funds for:</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SUCCESS / ERROR MESSAGE */}
              {formMessage && (
                <div
                  className={`campaign-form-message ${
                    isError ? "error" : "success"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {formMessage}
                </div>
              )}

              {/* SOCIAL CAUSE */}
              <div className="campaign-form-group">
                <label htmlFor="cause">Choose social cause</label>

                <select
                  id="cause"
                  name="cause"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select Cause
                  </option>
                  <option value="healthcare">
                    Healthcare &amp; Medical Aid
                  </option>
                  <option value="education">
                    Education for Children
                  </option>
                  <option value="hunger">
                    Food &amp; Hunger Relief
                  </option>
                  <option value="women">
                    Women Empowerment
                  </option>
                  <option value="disability">
                    Support for People with Disabilities
                  </option>
                  <option value="community">
                    Community Welfare
                  </option>
                  <option value="other">
                    Other Social Cause
                  </option>
                </select>
              </div>

              {/* CAMPAIGNER NAME */}
              <div className="campaign-form-group">
                <label htmlFor="campaignerName">
                  Campaigner Name
                </label>

                <input
                  id="campaignerName"
                  name="campaignerName"
                  type="text"
                  placeholder="Enter Campaigner Name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              {/* EMAIL AND PHONE */}
              <div className="campaign-form-row">
                <div className="campaign-form-group">
                  <label htmlFor="campaignEmail">Email ID</label>

                  <input
                    id="campaignEmail"
                    name="email"
                    type="email"
                    placeholder="Enter Email ID"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>

                <div className="campaign-form-group">
                  <label htmlFor="campaignPhone">
                    Phone Number
                  </label>

                  <input
                    id="campaignPhone"
                    name="phone"
                    type="tel"
                    placeholder="Enter Phone Number"
                    autoComplete="tel"
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="campaign-form-group campaign-social-group">
                <div className="campaign-social-heading">
                  <label htmlFor="socialLink-0">
                    Social Links <span>(Optional)</span>
                  </label>

                  <button
                    type="button"
                    className="campaign-add-link"
                    onClick={addSocialLink}
                  >
                    <FaPlus /> Add Link
                  </button>
                </div>

                <div className="campaign-social-list">
                  {socialLinks.map((link, index) => (
                    <div
                      className="campaign-social-input"
                      key={index}
                    >
                      <input
                        id={`socialLink-${index}`}
                        name={`socialLink-${index}`}
                        type="url"
                        value={link}
                        onChange={(e) =>
                          handleSocialChange(index, e.target.value)
                        }
                        placeholder={
                          index === 0
                            ? "Enter Social Link"
                            : "Enter another social link"
                        }
                      />

                      {index > 0 && (
                        <button
                          type="button"
                          className="campaign-remove-link"
                          onClick={() => removeSocialLink(index)}
                          aria-label={`Remove social link ${index + 1}`}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="campaign-form-group campaign-description-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your campaign, its purpose and how the funds will help..."
                  rows={4}
                  maxLength={1500}
                  required
                />
              </div>

              {/* TERMS AND PRIVACY */}
              <label className="campaign-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  required
                />

                <span>
                  By continuing, you agree to our{" "}
                  <a href="/terms">Terms of Use</a> and{" "}
                  <a href="/privacy-policy">Privacy Policy</a>.
                </span>
              </label>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="campaign-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>

            <div
              className="campaign-decoration"
              aria-hidden="true"
            >
              <span className="campaign-hand">✋</span>
              <span className="campaign-decoration-line"></span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Campaign;
