
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpeg";
import "./Header.css";

function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="main-header">
      <Link
        to="/"
        className="main-header-logo"
        onClick={closeMenu}
        aria-label="O Positive Health Foundation Home"
      >
        <img src={logo} alt="O Positive Health Foundation" />
      </Link>

      <button
        className="header-menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`main-header-nav ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/life" onClick={closeMenu}>Life</Link>

        <Link to="/explore" onClick={closeMenu}>
          Explore Campaigns
        </Link>
        <Link to="/donation" onClick={closeMenu}>
          Monthly Donation
        </Link>
        <Link to="/vendor" onClick={closeMenu}>
          Small Vendors
        </Link>
        <Link to="/campaign" onClick={closeMenu}>
          Start New Campaigns
        </Link>
        <Link to="/blog" onClick={closeMenu}>Blogs</Link>
        <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
        <Link to="/about" onClick={closeMenu}>About Us</Link>
        
<Link
  to="/signup"
  className="header-auth-button"
  onClick={closeMenu}
>
  Login / Sign Up
</Link>

      </nav>
    </header>
  );
}

export default MainHeader;
