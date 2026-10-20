
import { useState } from "react";
import logo from "../../assets/logo.jpeg";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a
        href="#home"
        className="navbar-logo"
        onClick={closeMenu}
        aria-label="O Positive Health - Home"
      >
        <img
          src={logo}
          alt="O Positive Health"
          className="navbar-logo-image"
        />
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav
        id="main-navigation"
        className={`navbar-links ${menuOpen ? "active" : ""}`}
      >
        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#services" onClick={closeMenu}>
          Our Services
        </a>

        <a href="#how-it-works" onClick={closeMenu}>
          Patient Journey
        </a>

        <a href="#specialties" onClick={closeMenu}>
          Specialties
        </a>

        <a href="#why-us" onClick={closeMenu}>
          Why Choose Us
        </a>

        <div className="navbar-mobile-actions">
          <a
            href="#patient-care"
            className="nav-btn nav-signin"
            onClick={closeMenu}
          >
            Patient Care
          </a>

          <a
            href="#contact"
            className="nav-btn nav-start"
            onClick={closeMenu}
          >
            Contact Us
          </a>
        </div>
      </nav>

      <div className="navbar-actions">
        <a href="#patient-care" className="nav-btn nav-signin">
          Patient Care
        </a>

        <a href="#contact" className="nav-btn nav-start">
          Donate Now
        </a>
      </div>
    </header>
  );
}

export default Navbar;
