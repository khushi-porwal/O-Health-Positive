import "./Navbar.css";
import { Phone, Mail } from "lucide-react";

function Navbar() {
  return (
    <div className="top-bar">
      <div className="top-bar-contact">
        <a href="mailto:opositivehealthfoundation@gmail.com">
          <Mail size={16} aria-hidden="true" />
          <span>opositivehealthfoundation@gmail.com</span>
        </a>

        <a href="tel:+918448534103">
          <Phone size={16} aria-hidden="true" />
          <span>+91 8448534103</span>
        </a>
      </div>

      <div className="top-bar-socials">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          f
        </a>

        <a
          href="https://x.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="X"
        >
          𝕏
        </a>

        <a
          href="https://www.linkedin.com/company/o-positive-health/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          in
        </a>

        <a
          href="https://www.instagram.com/opositive_health_foundation?vrfl=cWo1dno0ZG4zNW9l"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          ◎
        </a>
      </div>
    </div>
  );
}

export default Navbar;