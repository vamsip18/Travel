import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing styles

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false); // State to track mobile menu

  const toggleMenu = () => {
    setIsMobile(!isMobile); // Toggle the mobile menu visibility
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TravelApp</Link>
      </div>
      <ul className={`nav-links ${isMobile ? 'mobile active' : ''}`}>
        <li>
          <Link to="/" onClick={() => setIsMobile(false)}>Home</Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setIsMobile(false)}>About Us</Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setIsMobile(false)}>Contact Us</Link>
        </li>
        <li>
          <button className="sign-in-btn" onClick={() => setIsMobile(false)}>Sign In</button>
        </li>
      </ul>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
