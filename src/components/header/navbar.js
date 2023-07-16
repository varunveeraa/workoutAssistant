import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <section className="navbar">
      {/* <a href="/" className="navbar-item">Home</a> */}
      <Link to="/" className="navbar-item">
        home
      </Link>
      <Link to="/counter" className="navbar-item">
        workouts
      </Link>
    </section>
  );
}

export default Navbar;
