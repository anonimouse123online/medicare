import Navbar from "../components/Navbar";
import "./About.css";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="about-hero">
          <div className="hero-content">
            <h1>About MediGuide AI</h1>
            <p className="hero-subtitle">
              Your Intelligent Health Companion
            </p>
          </div>
          <div className="hero-graphic">
            <div className="pulse-dot"></div>
            <div className="health-icon">⚕️</div>
          </div>
        </div>

        <div className="about-content">
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              MediGuide AI is an intelligent health assistant that helps analyze symptoms
              and provide safe over-the-counter (OTC) recommendations using advanced AI technology.
              We aim to make healthcare information more accessible and understandable for everyone.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Symptom Analysis</h4>
              <p>Get instant AI-powered analysis of your symptoms with possible conditions and explanations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h4>OTC Recommendations</h4>
              <p>Receive safe over-the-counter medication suggestions with proper dosage guidance.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h4>Facility Finder</h4>
              <p>Locate nearby medical facilities and hospitals based on your location and needs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚠️</div>
              <h4>Emergency Guidance</h4>
              <p>Identify warning signs and know when to seek immediate medical attention.</p>
            </div>
          </div>

          <div className="creator-section">
            <div className="creator-card">
              <div className="creator-avatar">
                <span>👨‍💻</span>
              </div>
              <div className="creator-info">
                <h3>Created by</h3>
                <h2>Kurt Paul Perocillo</h2>
                <p className="creator-role">Full Stack Developer & AI Enthusiast</p>
                <p className="creator-description">
                  Passionate about creating technology solutions that make healthcare 
                  more accessible and user-friendly for everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="disclaimer-card">
            <div className="disclaimer-icon">📝</div>
            <h3>Important Disclaimer</h3>
            <p>
              MediGuide AI provides AI-generated health information for educational purposes only. 
              This is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with qualified healthcare providers for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}