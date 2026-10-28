import React from "react";
import "./TermsConditions.css";
import MainHeader from "../../components/layout/Header/Header";
import Navbar from "../../components/layout/Navbar/Navbar"
import Footer from "../../components/layout/Footer/Footer"
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
const TermsConditions = () => {
  return (
    <>
    <Navbar/>
    <CrowdfundingHeader/>
    <MainHeader/>
    <div className="terms-page">

      {/* Header */}
      <section className="terms-header">
        <div className="header-decoration left-decoration">
          <span>+</span>
          <span>♥</span>
        </div>

        <div className="header-content">
          <h1>
            Terms & Conditions
          </h1>

          <div className="heading-line"></div>

          <p>
            Please read these terms carefully before using our website
            or participating in our initiatives.
          </p>
        </div>

        <div className="header-decoration right-decoration">
          <span>+</span>
          <span>✓</span>
        </div>
      </section>


      {/* Main Content */}
      <section className="terms-card">

        {/* 1 */}
        <div className="terms-section">
          <h2>1. Introduction</h2>

          <p>
            Welcome to O Positive Health Foundation.
          </p>

          <p>
            O Positive Health Foundation is a Section 8 non-profit
            organization incorporated under the Companies Act, 2013,
            committed to improving healthcare accessibility, supporting
            underserved communities, and promoting charitable healthcare
            initiatives.
          </p>

          <p>
            By accessing or using our website, making a donation,
            submitting an enquiry, registering as a volunteer, or
            participating in our initiatives, you agree to comply with
            these Terms & Conditions, to the extent applicable to your
            activities.
          </p>

          <p>
            If you do not agree with these terms, please discontinue
            using our website.
          </p>
        </div>


        {/* 2 */}
        <div className="terms-section">
          <h2>2. About the Organization</h2>

          <div className="info-box">
            <p><strong>Organization Name:</strong> O Positive Health Foundation</p>
            <p><strong>Organization Type:</strong> Section 8 Non-Profit Company</p>
            <p><strong>Date of Incorporation:</strong> 8 July 2026</p>
            <p><strong>CIN:</strong> U86909DL2026NPL468193</p>
            <p><strong>NGO Darpan ID:</strong> DL/2026/1209171</p>
            <p><strong>Location:</strong> Ghitorni, New Delhi, India</p>
          </div>

          <p>
            The Foundation operates with the objective of promoting
            healthcare accessibility, community welfare, medical awareness,
            and support for individuals facing healthcare-related
            challenges.
          </p>
        </div>


        {/* 3 */}
        <div className="terms-section">
          <h2>3. Website Usage</h2>

          <p>
            Users agree to use this website only for lawful purposes.
          </p>

          <p>Users must not:</p>

          <ul>
            <li>Provide false, misleading, or fraudulent information.</li>

            <li>
              Attempt unauthorized access to website systems or databases.
            </li>

            <li>
              Upload harmful software, viruses, or malicious content.
            </li>

            <li>
              Misuse donation facilities or online forms.
            </li>

            <li>
              Copy, reproduce, or distribute website content without
              appropriate authorization, except as permitted by law.
            </li>

            <li>
              Engage in activities that may disrupt website functionality
              or compromise its security.
            </li>
          </ul>

          <p>
            We reserve the right to restrict access or take appropriate
            action in response to misuse, subject to applicable laws.
          </p>
        </div>


        {/* 4 */}
        <div className="terms-section">
          <h2>4. Donations and Contributions</h2>

          <p>
            Donations made to O Positive Health Foundation are voluntary
            and are intended to support its charitable objectives,
            healthcare initiatives, and related lawful activities.
          </p>

          <p>
            By making a donation, donors acknowledge that:
          </p>

          <ul>
            <li>Donations are made voluntarily.</li>

            <li>
              Donors must provide accurate transaction and contact
              information.
            </li>

            <li>
              Contributions will be used in accordance with the
              Foundation's charitable objectives and applicable laws.
            </li>

            <li>
              Donations may be subject to verification and applicable
              regulatory requirements.
            </li>

            <li>
              The Foundation does not guarantee that a donation will be
              allocated to a particular beneficiary unless expressly
              agreed or communicated.
            </li>

            <li>
              Donations are subject to our Refund & Cancellation Policy.
            </li>
          </ul>

          <p>
            The Foundation is committed to responsible and transparent
            management of contributions.
          </p>
        </div>


        {/* 5 */}
        <div className="terms-section">
          <h2>5. Payment Processing and Security</h2>

          <p>
            Online donations may be processed through authorized
            third-party payment gateways, banking channels, UPI services,
            or other supported payment methods.
          </p>

          <p>
            O Positive Health Foundation does not control the independent
            operations of banks or third-party payment service providers.
          </p>

          <p>
            Transactions may be subject to the respective provider's
            terms, security procedures, and processing timelines.
          </p>

          <p>
            Users are advised to verify official payment details before
            making any contribution.
          </p>
        </div>


        {/* 6 */}
        <div className="terms-section">
          <h2>6. Refund and Cancellation</h2>

          <p>
            Donations are generally non-refundable once successfully
            processed, except where a refund is appropriate under our
            Refund & Cancellation Policy or required by applicable law.
          </p>

          <p>
            Refund requests involving duplicate payments, transaction
            errors, or unauthorized transactions will be reviewed
            according to the published policy and applicable requirements.
          </p>

          <p>
            For complete details, please refer to our{" "}
            <strong>Refund & Cancellation Policy.</strong>
          </p>
        </div>


        {/* 7 */}
        <div className="terms-section">
          <h2>7. Healthcare Assistance and Support</h2>

          <p>
            O Positive Health Foundation aims to facilitate healthcare
            accessibility and support eligible individuals through its
            charitable programs and initiatives.
          </p>

          <p>However:</p>

          <ul>
            <li>
              Medical or financial assistance is subject to eligibility,
              available resources, and applicable program guidelines.
            </li>

            <li>
              Submission of an application does not guarantee approval
              or financial assistance.
            </li>

            <li>
              The Foundation does not guarantee treatment outcomes or
              recovery.
            </li>

            <li>
              Healthcare services and medical decisions remain the
              responsibility of qualified healthcare professionals and
              respective healthcare institutions.
            </li>

            <li>
              Any financial support is subject to the Foundation's
              internal approval procedures and applicable regulations.
            </li>
          </ul>
        </div>


        {/* 8 */}
        <div className="terms-section">
          <h2>8. Medical Disclaimer</h2>

          <p>
            Information provided on this website is intended for general
            awareness and educational purposes only.
          </p>

          <p>
            It should not be considered a substitute for professional
            medical advice, diagnosis, or treatment.
          </p>

          <p>
            Visitors should consult qualified healthcare professionals
            for medical concerns.
          </p>

          <p>
            In case of a medical emergency, users should immediately
            contact appropriate emergency medical services or visit the
            nearest healthcare facility.
          </p>
        </div>


        {/* 9 */}
        <div className="terms-section">
          <h2>9. Volunteer and Partnership Participation</h2>

          <p>
            Individuals, hospitals, healthcare professionals,
            corporations, and organizations may express interest in
            volunteering or collaborating with O Positive Health
            Foundation.
          </p>

          <p>
            Submission of a volunteer application or partnership enquiry
            does not automatically establish a formal relationship with
            the Foundation.
          </p>

          <p>
            Participation may be subject to verification, approval,
            documentation, and mutually agreed conditions.
          </p>
        </div>


        {/* 10 */}
        <div className="terms-section">
          <h2>10. Privacy and Data Protection</h2>

          <p>
            We respect the privacy of website visitors, donors,
            volunteers, beneficiaries, and partners.
          </p>

          <p>
            Personal information collected through website forms or
            donation processes will be handled in accordance with our
            Privacy Policy and applicable Indian data protection laws.
          </p>

          <p>
            Where health-related information is collected, appropriate
            safeguards and lawful processing requirements will apply.
          </p>

          <p>
            Please refer to our <strong>Privacy Policy</strong> for
            further information.
          </p>
        </div>


        {/* 11 */}
        <div className="terms-section">
          <h2>11. Intellectual Property Rights</h2>

          <p>
            Unless otherwise stated, the website's original content,
            branding, logos, graphics, and other intellectual property
            belonging to O Positive Health Foundation are protected under
            applicable laws.
          </p>

          <p>
            Unauthorized commercial use, reproduction, or distribution is
            prohibited, except where permitted by law or with prior
            written permission.
          </p>
        </div>


        {/* 12 */}
        <div className="terms-section">
          <h2>12. Third-Party Links</h2>

          <p>
            Our website may contain links to third-party websites,
            hospitals, payment gateways, social media platforms, or
            partner organizations.
          </p>

          <p>
            These external platforms operate independently and may have
            their own terms and privacy policies.
          </p>

          <p>
            O Positive Health Foundation is not responsible for the
            independent content, policies, or practices of third-party
            websites, except to the extent responsibility arises under
            applicable law.
          </p>
        </div>


        {/* 13 */}
        <div className="terms-section">
          <h2>13. Limitation of Liability</h2>

          <p>
            We make reasonable efforts to ensure that information
            published on our website is accurate and updated.
          </p>

          <p>
            However, we do not guarantee uninterrupted website
            availability or that all information will be free from errors.
          </p>

          <p>
            To the extent permitted by applicable law, O Positive Health
            Foundation shall not be liable for losses arising solely from
            website interruptions, unauthorized third-party actions, or
            reliance on general informational content.
          </p>

          <p>
            Nothing in these Terms & Conditions excludes or limits any
            liability or legal right that cannot lawfully be excluded or
            limited.
          </p>
        </div>


        {/* 14 */}
        <div className="terms-section">
          <h2>14. Transparency and Ethical Practices</h2>

          <p>
            O Positive Health Foundation is committed to responsible
            governance, ethical fundraising, transparency, and
            accountability.
          </p>

          <p>
            We strive to ensure that charitable resources are managed in
            accordance with organizational objectives and applicable
            legal requirements.
          </p>

          <p>
            We do not support fraudulent fundraising, misleading
            representations, or unauthorized collection of donations in
            the Foundation's name.
          </p>
        </div>


        {/* 15 */}
        <div className="terms-section">
          <h2>15. Changes to Terms & Conditions</h2>

          <p>
            O Positive Health Foundation may update these Terms &
            Conditions from time to time to reflect operational, legal,
            or regulatory changes.
          </p>

          <p>
            Updated terms will be published on this website with a
            revised effective date.
          </p>

          <p>
            Continued use of the website after publication of updated
            terms constitutes acceptance where permitted by applicable
            law.
          </p>
        </div>


        {/* 16 */}
        <div className="terms-section">
          <h2>16. Governing Law and Jurisdiction</h2>

          <p>
            These Terms & Conditions shall be governed by the applicable
            laws of India.
          </p>

          <p>
            Subject to mandatory legal provisions and applicable
            jurisdictional rules, disputes arising from the use of this
            website shall be subject to the jurisdiction of competent
            courts in Delhi, India.
          </p>
        </div>


        {/* 17 */}
        <div className="terms-section">
          <h2>17. Contact Information</h2>

          <p>
            For questions, concerns, or clarification regarding these
            Terms & Conditions, please contact:
          </p>

          <div className="contact-box">

            <h3>
              O POSITIVE <span>HEALTH FOUNDATION</span>
            </h3>

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

            <div className="contact-line">
              <div className="contact-icon">🏢</div>

              <p>
                CIN: U86909DL2026NPL468193
              </p>
            </div>

            <div className="contact-line">
              <div className="contact-icon">📄</div>

              <p>
                NGO Darpan ID: DL/2026/1209171
              </p>
            </div>

          </div>
        </div>


        {/* Commitment */}
        <div className="commitment-box">

          <h2>Our Commitment</h2>

          <p>
            At O Positive Health Foundation, we believe in building trust
            through transparency, compassion, accountability, and
            responsible action.
          </p>

          <strong>
            Together, We Can Make Healthcare More Accessible.
          </strong>

        </div>

      </section>


      {/* Footer */}
      <div className="terms-footer">
        <p>
          O Positive Health Foundation • Terms & Conditions •
          Effective Date: 08 July 2026
        </p>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default TermsConditions;