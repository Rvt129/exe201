import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-left">
          <h1>Pet Fashion Boutique</h1>
        </div>
        <div className="nav-right">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </div>
      </nav>

      <main className="home-main">
        <div className="hero-section">
          <h2>Design Your Pet's Style</h2>
          <p>Create custom clothing for your furry friend</p>
          <Link to="/design" className="cta-button">
            Start Designing
          </Link>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Custom Designs</h3>
            <p>Create unique clothing designs for your pet</p>
          </div>
          <div className="feature-card">
            <h3>Quality Materials</h3>
            <p>Premium fabrics for comfort and durability</p>
          </div>
          <div className="feature-card">
            <h3>Perfect Fit</h3>
            <p>Multiple sizes for all pet breeds</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 Pet Fashion Boutique. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
