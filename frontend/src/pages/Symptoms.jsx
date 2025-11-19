import Navbar from "../components/Navbar";
import SymptomForm from "../components/SymptomForm";
import ResultCard from "../components/ResultCard";
import { useState } from "react";
import "./Symptoms.css";

export default function Symptoms() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (data) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      if (!data || !data.results) {
        setResults([{ title: "No Results", description: "No analysis returned from backend." }]);
        return;
      }

      if (data.status === "healthy") {
        setResults([{ title: "Backend Healthy", description: "Your backend is running successfully." }]);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process backend response.");
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
          <SymptomForm onSubmit={handleAnalyze} />

          <div className="results-container">
            {loading && <p>Analyzing symptoms with AI...</p>}

            {error && (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="results-grid">
                {results.map((result, idx) => (
                  <ResultCard
                    key={idx}
                    title={result.title}
                    description={result.description}
                    severity={result.severity}
                    confidence={result.confidence}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
