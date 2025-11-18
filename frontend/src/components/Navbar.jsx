import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <h2 className="logo">MediGuide AI</h2>

      {/* Hamburger Icon */}
      <div
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        {/* Back Button (only visible on mobile) */}
        <li className="back-btn-container">
          <button className="back-btn" onClick={closeMenu}>
            ← Back
          </button>
        </li>

        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/symptoms" onClick={closeMenu}>Symptoms</Link></li>
        <li><Link to="/otc" onClick={closeMenu}>OTC Guide</Link></li>
        <li><Link to="/facilities" onClick={closeMenu}>Nearby Clinics</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
      </ul>
    </nav>
  );
}
