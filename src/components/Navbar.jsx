import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Track if the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">K</span>
          Kalashree Music
        </Link>

        {/* Hamburger Icon (Visible only on mobile) */}
        <button 
          className="hamburger" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>

        {/* Nav Links Container */}
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" end onClick={closeMenu}>
            Home
          </NavLink>
          
          {!token && (
            <Link to="/login" className="btn btn-primary btn-sm text-center" onClick={closeMenu}>
              Student Login
            </Link>
          )}
          
          {token && (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <button className="btn btn-outline btn-sm text-center" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}