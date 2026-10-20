
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        {/* About */}
        <div className="footer-about">
          <h2 className="footer-logo">
            O Positive <span>Health</span>
          </h2>

          <p className="footer-tagline">Care Before Cure</p>

          <p className="footer-description">
            A healthcare infrastructure and coordination platform
            focused on helping patients navigate their healthcare
            journey with care and guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#services">Our Services</a>
          <a href="#how-it-works">Patient Journey</a>
          <a href="#specialties">Medical Specialties</a>
          <a href="#why-us">Why Choose Us</a>
        </div>

        {/* Patient Support */}
        <div className="footer-links">
          <h3>Patient Support</h3>
          <a href="#patient-care">Our Approach</a>
          <a href="#impact">Our Impact</a>
          <a href="#contact">Contact Us</a>
        </div>

        {/* Bank Information - Text Only */}
        <div className="footer-bank">
          <h3>Support a Patient</h3>
          <p className="footer-bank-intro">
            Your support can make a difference in a patient's
            healthcare journey.
          </p>

          <h4>Bank Transfer Details</h4>

          <div className="footer-bank-row">
            <span>Account Name</span>
            <strong>O Positive Foundation</strong>
          </div>

          <div className="footer-bank-row">
            <span>Account Number</span>
            <strong>201038546375</strong>
          </div>

          <div className="footer-bank-row">
            <span>IFSC Code</span>
            <strong>INDB0001908</strong>
          </div>

          <div className="footer-bank-row">
            <span>Bank Name</span>
            <strong>IndusInd Bank</strong>
          </div>

          <div className="footer-bank-row">
            <span>Branch</span>
            <strong>New Delhi</strong>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AVYJNR Health Technologies India
          Private Limited. All rights reserved.
        </p>

        <p>
          <span>Care Before Cure</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
