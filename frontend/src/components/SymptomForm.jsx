import "./SymptomForm.css";
import { useState } from "react";

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      alert("Please describe your symptoms");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: symptoms }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (onSubmit) {
        onSubmit(data); // send backend response to parent
      }
    } catch (err) {
      console.error("Backend error:", err);
      setError("Failed to connect to backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleAnalyze();
  };

  return (
    <div className="symptom-form">
      <h2>Describe Your Symptoms</h2>
      <textarea
        placeholder="Example: fever, cough, headache..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button onClick={handleAnalyze} disabled={loading || !symptoms.trim()}>
        {loading ? "🔍 Analyzing..." : "Analyze Symptoms"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
