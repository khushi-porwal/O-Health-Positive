
import "./Navbar.css";

function Navbar() {
  return (
    <div className="top-bar">
      <div className="top-bar-contact">
        <a href="mailto:info@opositivehealth.com">
          <span aria-hidden="true">✉</span>
          opositivehealthfoundation@gmail.com
        </a>

        <a href="tel:+918448534103">
          <span aria-hidden="true">▤</span>
          +91 8448534103
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
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          in
        </a>

        <a
          href="https://www.instagram.com/"
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