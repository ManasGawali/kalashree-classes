import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">K</span>
          Kalashree Music
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className="nav-link" end>Home</NavLink>
          {!token && (
            <Link to="/login" className="btn btn-primary btn-sm">Student Login</Link>
          )}
          {token && (
            <>
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
