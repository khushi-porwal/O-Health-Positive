import React from "react";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="refund-page">

      {/* Header */}
      <section className="refund-hero">
        <div className="hero-decoration hero-left"></div>
        <div className="hero-decoration hero-right"></div>

        <div className="hero-content">
          <h1>
            Refund & Cancellation <span>Policy</span>
          </h1>

          <div className="hero-line">
            <span></span>
            <span></span>
          </div>

          <p>
            Your trust and support help us create a healthier and more
            inclusive society.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="refund-container">

        <div className="refund-card">

          <p>
            <strong>O Positive Health Foundation</strong> deeply values every
            contribution that helps us support individuals and communities in
            need of healthcare. However, in the event of cancelling your
            donation, we follow a transparent refund process to ensure a
            smooth and hassle-free experience for our donors.
          </p>

          <p>
            Donations are processed according to the information provided by
            donors through our online or offline donation process. In case of
            an accidental payment, duplicate transaction, incorrect deduction,
            or a valid cancellation request, O Positive Health Foundation will
            review the request and respond within{" "}
            <strong>7 working days</strong> from the date of receiving the
            request.
          </p>

          <p>
            To process a refund, the donor may be required to provide the
            transaction details, proof of payment, and a written refund
            request. Refund processing time may vary depending on the payment
            method, bank, or payment gateway used for the transaction.
          </p>

          <p>
            If a donation receipt or applicable tax-related certificate has
            already been issued, the refund may be subject to applicable
            legal and regulatory requirements. In other eligible cases, the
            refund will be processed after deducting any applicable payment
            gateway or transaction-processing charges.
          </p>

          <p>
            For any refund or cancellation request, please contact O Positive
            Health Foundation using the contact details provided below.
          </p>

          {/* Organization Details */}
          <div className="organization-box">

            <div className="organization-info">

              <h2>
                <span>O POSITIVE HEALTH</span>{" "}
                <strong>FOUNDATION</strong>
              </h2>

              <div className="title-line">
                <span></span>
                <span></span>
              </div>

              <div className="contact-row">
                <div className="contact-icon location-icon">
                  📍
                </div>

                <p>
                  Opposite Nirankari Barthan Bhandar, Mangu Mohalla,
                  Ghitorni, New Delhi, Delhi 110030
                </p>
              </div>

              <div className="contact-row">
                <div className="contact-icon phone-icon">
                  ☎
                </div>

                <p>
                  <a href="tel:8448534103">8448534103</a>
                </p>
              </div>

            </div>

            <div className="organization-art">
              <div className="heart-circle">
                <span>+</span>
              </div>

              <div className="art-leaf leaf-one"></div>
              <div className="art-leaf leaf-two"></div>
              <div className="art-leaf leaf-three"></div>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
};

export default RefundPolicy;