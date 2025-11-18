import { Link } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Your AI-Powered Healthcare Assistant</h1>
        <p>Analyze symptoms, get OTC recommendations, and locate nearby medical facilities.</p>

        <div className="hero-buttons">
          <Link to="/symptoms" className="btn-primary">Analyze Symptoms</Link>
          <Link to="/facilities" className="btn-secondary">Find Clinics</Link>
        </div>
      </div>
    </div>
  );
}
