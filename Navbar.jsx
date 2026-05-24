import React from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="/logo.png" alt="SalesPulse Logo" className="nav-logo" />
        <h2>SalesPulse</h2>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/sales">Sales</Link>
      </div>

      <div className="nav-right">
        <span>{user ? user.name : "User"}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;