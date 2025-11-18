import "./SymptomForm.css";
import { useState } from "react";

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      alert("Please describe your symptoms");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending symptoms to backend:", symptoms);
      
      const response = await fetch("https://medicare-hkxv.onrender.com/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: symptoms }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);

      // ✅ FIX: Just call onSubmit without parameters
      // The parent component will handle the data
      if (onSubmit) {
        onSubmit(symptoms); // Pass the original symptoms text
      }

    } catch (error) {
      console.error("Error calling backend:", error);
      alert("Failed to connect to backend. Make sure the server is running on https://medicare-hkxv.onrender.com");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
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
      
      <button 
        onClick={handleAnalyze}
        disabled={loading || !symptoms.trim()}
      >
        {loading ? "🔍 Analyzing..." : "Analyze Symptoms"}
      </button>
      
      {loading && (
        <div className="loading-indicator">
          <p>Getting AI health analysis...</p>
        </div>
      )}
    </div>
  );
}