import Navbar from "../components/Navbar";
import SymptomForm from "../components/SymptomForm";
import ResultCard from "../components/ResultCard";
import { useState } from "react";
import "./Symptoms.css";

export default function Symptoms() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch from backend API
  const analyzeSymptoms = async (text) => {
    if (!text.trim()) {
      setError("Please enter symptoms to analyze");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      console.log("Sending request to backend...");
      
      const response = await fetch("https://medicare-hkxv.onrender.com/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Received data from backend:", data);
      
      if (data.status === "success" && data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([{ 
          title: "No Results", 
          description: "No analysis available from backend." 
        }]);
      }
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      
      // Show specific error message for connection issues
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to backend server. Make sure the server is running on https://medicare-hkxv.onrender.com");
      } else {
        setError(err.message || "Failed to analyze symptoms. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="symptoms-page">
        <div className="symptoms-header">
          <h1>Health Assistant</h1>
          <p>Describe your symptoms and let AI suggest possible conditions and OTC medications.</p>
        </div>

        <div className="symptoms-content">
          <SymptomForm onSubmit={analyzeSymptoms} />

          <div className="results-container">
            {loading && (
              <div className="loading-state">
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Analyzing symptoms with AI...</p>
                  <p className="loading-subtext">Connecting to Health Assistant...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="error-state">
                <div className="error-content">
                  <div className="error-icon">❌</div>
                  <p className="error-message">{error}</p>
                  <div className="error-actions">
                    <button 
                      className="error-btn dismiss-btn"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </button>
                    <button 
                      className="error-btn retry-btn"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                  {error.includes("Cannot connect to backend") && (
                    <div className="backend-help">
                      <p className="help-title"><strong>To fix this:</strong></p>
                      <ol className="help-steps">
                        <li>Make sure your backend server is running</li>
                        <li>Open terminal in your backend folder</li>
                        <li>Run: <code>npm run dev</code></li>
                        <li>Wait for "Server running on hhttps://medicare-hkxv.onrender.com" message</li>
                        <li>Then try again</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!loading && !error && results.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💡</div>
                <p className="empty-text">Describe your symptoms above to get AI-powered health suggestions.</p>
                <div className="example-symptoms">
                  <p><strong>Example symptoms:</strong></p>
                  <ul>
                    <li>"I have a headache and fever for 2 days"</li>
                    <li>"Sore throat and cough with body aches"</li>
                    <li>"Stomach pain and nausea after eating"</li>
                  </ul>
                </div>
              </div>
            )}
            
            {!loading && !error && results.length > 0 && (
              <>
                <div className="results-header">
                  <h2>Analysis Results</h2>
                  <p className="results-count">{results.length} condition(s) identified</p>
                </div>
                <div className="results-grid">
                  {results.map((result, index) => (
                    <ResultCard 
                      key={index} 
                      title={result.title} 
                      description={result.description}
                      severity={result.severity}
                      confidence={result.confidence}
                    />
                  ))}
                </div>
                <div className="disclaimer">
                  <p><strong>Disclaimer:</strong> This AI analysis is for informational purposes only and is not a substitute for professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}