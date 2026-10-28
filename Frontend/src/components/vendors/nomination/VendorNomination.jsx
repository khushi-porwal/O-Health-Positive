
import React, { useState } from "react";
import "./VendorNomination.css";
import live from "../../../assets/live.png";
import { nominateVendor } from "../../../services/vendorApi";

const initialForm = {
  vendorName: "",
  nominatorName: "",
  phoneNumber: "",
  vendorLocation: "",
  vendorPhone: "",
  productCategory: "",
  productsSold: "",
  description: "",
};

const VendorNomination = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const phone = formData.phoneNumber.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (
      formData.vendorPhone.trim() &&
      !/^[0-9]{10}$/.test(formData.vendorPhone.trim())
    ) {
      setError("Please enter a valid 10-digit vendor phone number.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await nominateVendor({
        ...formData,
        vendorName: formData.vendorName.trim(),
        nominatorName: formData.nominatorName.trim(),
        phoneNumber: phone,
        vendorPhone: formData.vendorPhone.trim(),
        vendorLocation: formData.vendorLocation.trim(),
        productCategory: formData.productCategory,
        productsSold: formData.productsSold.trim(),
        description: formData.description.trim(),
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to submit your request."
        );
      }

      setFormData({ ...initialForm });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="vendor-section">
      <div className="vendor-container">
        {/* LEFT SIDE */}
        <div className="vendor-left">
          <div className="section-label">
            <span></span>
            NOMINATE A VENDOR TODAY
          </div>

          <h1>
            Feature A Small Vendor &{" "}
            <span>Change Their Life</span>
          </h1>

          <p className="intro-text">
            Nominate a street vendor you know. We'll verify, feature them
            on our platform, list their products, and connect them with
            NGO partners for maximum impact.
          </p>

          <div className="vendor-image-box">
            <img src={live} alt="O Positive Health Foundation" />

            <div className="image-overlay">
              <h2>Know a Hardworking Street Vendor?</h2>

              <p>
                Nominate them to be featured on O Positive Health
                Foundation and help transform their livelihood.
              </p>

              <div className="color-line">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="vendor-form-card">
          <div className="form-title">
            <span>✦</span>
            <h2>Empower a Street Vendor</h2>
          </div>

          <div className="form-line"></div>

          {success ? (
            <div className="vendor-success" role="status" aria-live="polite">
              Your request sent successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ROW 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vendorName">Vendor's Name</label>
                  <input
                    id="vendorName"
                    name="vendorName"
                    type="text"
                    placeholder="Enter Vendor's Name"
                    value={formData.vendorName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nominatorName">Your Name</label>
                  <input
                    id="nominatorName"
                    name="nominatorName"
                    type="text"
                    placeholder="Enter Your Name"
                    value={formData.nominatorName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              {/* ROW 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vendorLocation">Vendor's Location</label>
                  <input
                    id="vendorLocation"
                    name="vendorLocation"
                    type="text"
                    placeholder="Enter Location"
                    value={formData.vendorLocation}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />
                </div>
              </div>

              {/* ROW 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vendorPhone">
                    Vendor's Phone Number
                  </label>
                  <input
                    id="vendorPhone"
                    name="vendorPhone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter Vendor's Phone number"
                    value={formData.vendorPhone}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productCategory">Product Category</label>
                  <select
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Handicrafts">Handicrafts</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Street Food">Street Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="form-group full-width">
                <label htmlFor="productsSold">
                  What products do they sell?
                </label>
                <input
                  id="productsSold"
                  name="productsSold"
                  type="text"
                  placeholder="List Their Main Products"
                  value={formData.productsSold}
                  onChange={handleChange}
                  maxLength={500}
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group full-width">
                <label htmlFor="description">
                  Tell us about this vendor
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about this vendor"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                />
              </div>

              {error && (
                <p className="vendor-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Nominations"}
                {!submitting && <span>→</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default VendorNomination;
