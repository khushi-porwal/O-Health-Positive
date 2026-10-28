import React from "react";
import "./RefundCancellation.css";
import Footer from "../../components/layout/Footer/Footer"
import Navbar from "../../components/layout/Navbar/Navbar"
import MainHeader from "../../components/layout/Header/Header"
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
const RefundCancellation = () => {
  return (
    <>
    <Navbar/>
    <CrowdfundingHeader/>
    <MainHeader/>
    <div className="refund-page">

      {/* Header */}
      <section className="refund-header">
        <div className="header-decoration left-decoration">
          <span>+</span>
          <span>♥</span>
        </div>

        <div className="header-content">
          <h1>
            Refund & Cancellation <span>Policy</span>
          </h1>

          <div className="heading-line"></div>

          <p>
            Your trust and support help us make healthcare more accessible
            and create a healthier community.
          </p>
        </div>

        <div className="header-decoration right-decoration">
          <span>+</span>
          <span>✓</span>
        </div>
      </section>

      {/* Main Content */}
      <section className="refund-card">

        <p>
          O Positive Health Foundation deeply values every contribution
          received from our donors. Donations help support our healthcare
          initiatives, community welfare activities, medical awareness
          programs, and assistance for individuals and families in need.
        </p>

        <p>
          Donations made to O Positive Health Foundation are generally
          voluntary and non-refundable once successfully processed.
          However, refund requests may be considered in certain genuine
          circumstances, such as duplicate payments, technical errors,
          incorrect deductions, or unauthorized transactions.
        </p>

        <p>
          To request a refund, donors should contact O Positive Health
          Foundation with the relevant transaction details. The request
          may be reviewed and verified before any refund is approved.
        </p>

        {/* Refund Conditions */}
        <div className="policy-section">
          <h2>Refund Eligibility</h2>

          <ul>
            <li>
              Duplicate donation caused by a technical or payment error.
            </li>
            <li>
              Incorrect amount deducted due to a transaction error.
            </li>
            <li>
              Unauthorized transaction, subject to verification.
            </li>
            <li>
              Amount debited despite a failed or unsuccessful transaction.
            </li>
          </ul>
        </div>

        {/* Request Procedure */}
        <div className="policy-section">
          <h2>Refund Request Procedure</h2>

          <p>
            Refund requests should preferably be submitted within
            <strong> 7 calendar days </strong>
            from the date of the donation.
          </p>

          <p>Please provide:</p>

          <ul>
            <li>Donor's full name</li>
            <li>Registered email address or mobile number</li>
            <li>Date and amount of donation</li>
            <li>Transaction ID or payment reference number</li>
            <li>Reason for the refund request</li>
            <li>Relevant payment confirmation, if available</li>
          </ul>
        </div>

        {/* Processing */}
        <div className="policy-section">
          <h2>Refund Processing</h2>

          <p>
            Once a refund request is received, our team will review the
            transaction and may request additional information for
            verification. If approved, the refund will generally be
            initiated within <strong>7–10 working days</strong>.
          </p>

          <p>
            The actual time taken for the amount to appear in the donor's
            account may depend on the bank, payment gateway, or payment
            service provider.
          </p>
        </div>

        {/* Cancellation */}
        <div className="policy-section">
          <h2>Cancellation of Donations</h2>

          <p>
            Donations that have already been successfully processed
            generally cannot be cancelled. If recurring donations are
            available, donors may request cancellation of future payments
            by contacting the Foundation or using the applicable payment
            platform.
          </p>

          <p>
            Cancellation of future recurring payments does not automatically
            result in a refund of donations that have already been processed.
          </p>
        </div>

        {/* Tax */}
        <div className="policy-section">
          <h2>Tax Receipts</h2>

          <p>
            If a donation receipt or tax-related document has already been
            issued for a contribution that is subsequently refunded, the
            Foundation may correct or cancel the relevant records as
            applicable. Donors should not claim tax benefits for refunded
            donations.
          </p>
        </div>

        {/* Contact */}
        <div className="refund-contact">

          <p>To raise a refund request, contact us:</p>

          <h2>
            O POSITIVE <span>HEALTH FOUNDATION</span>
          </h2>

          <div className="contact-line">
            <div className="contact-icon">📍</div>
            <p>
              Opposite Nirankari Barthan Bhandar, Mangu Mohalla,
              Ghitorni, New Delhi, Delhi 110030
            </p>
          </div>

          <div className="contact-line">
            <div className="contact-icon">📞</div>
            <p>
              +91 8448534103 / +91 7559452369
            </p>
          </div>

        </div>

      </section>

      {/* Footer Note */}
      <div className="refund-footer">
        <p>
          O Positive Health Foundation is committed to transparency,
          accountability, and responsible management of every contribution
          received.
        </p>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default RefundCancellation;