import Navbar from "../components/Navbar";
import FacilityCard from "../components/FacilityCard";
import { useState } from "react";
import "./Facilities.css";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [facilityType, setFacilityType] = useState("");

  // Search facilities using AI (returns structured data)
  const searchFacilities = async (e) => {
    e.preventDefault();
    
    if (!searchLocation.trim()) {
      setError("Please enter a location to search");
      return;
    }
    
    setLoading(true);
    setError(null);
    setFacilities([]);

    try {
      console.log("Searching facilities...");
      
      const response = await fetch("https://medicare-hkxv.onrender.com/search-facilities", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          location: searchLocation,
          facilityType: facilityType 
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      
      if (data.status === "success" && data.facilities) {
        setFacilities(data.facilities);
      } else {
        setError("No facilities found matching your criteria.");
      }
    } catch (err) {
      console.error("Error searching facilities:", err);
      setError(err.message || "Failed to search facilities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick search by location only
  const quickSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setFacilities([]);
    setSearchLocation(query);

    try {
      const response = await fetch(`https://medicare-hkxv.onrender.com/facilities/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success" && data.facilities) {
        setFacilities(data.facilities);
      }
    } catch (err) {
      console.error("Error in quick search:", err);
      setError(err.message || "Quick search failed.");
    } finally {
      setLoading(false);
    }
  };

  const popularLocations = ["Cebu City", "Mandaue", "Lahug", "Talamban", "Mabolo"];

  return (
    <>
      <Navbar />
      <div className="facilities-page">
        <div className="facilities-header">
          <h1>Find Medical Facilities</h1>
          <p>Search for hospitals and clinics in Cebu using AI</p>
        </div>

        {/* Quick Search Buttons */}
        <div className="quick-search-section">
          <h3>Quick Search by Area:</h3>
          <div className="quick-search-buttons">
            {popularLocations.map((location) => (
              <button
                key={location}
                onClick={() => quickSearch(location)}
                className="quick-search-btn"
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={searchFacilities} className="search-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter location (e.g., Cebu City, Lahug, Mandaue)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="search-input"
              />
              
              <select 
                value={facilityType} 
                onChange={(e) => setFacilityType(e.target.value)}
                className="type-select"
              >
                <option value="">Any Facility Type</option>
                <option value="Public Hospital">Public Hospital</option>
                <option value="Private Hospital">Private Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Specialist Center">Specialist Center</option>
              </select>
              
              <button type="submit" disabled={loading} className="search-button">
                {loading ? "🔍 Searching..." : "🔍 Search Facilities"}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="results-container">
          {loading && (
            <div className="loading">
              <p>🔍 AI is searching for the best medical facilities...</p>
              <div className="spinner"></div>
            </div>
          )}
          
          {error && (
            <div className="error">
              <p>❌ {error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
          
          {!loading && !error && facilities.length === 0 && (
            <p className="placeholder">
              💡 Enter a location above to find medical facilities.
            </p>
          )}
          
          {!loading && !error && facilities.length > 0 && (
            <div className="facilities-grid">
              {facilities.map((facility) => (
                <FacilityCard 
                  key={facility.id}
                  id={facility.id}
                  name={facility.name}
                  address={facility.address}
                  distance={facility.distance}
                  type={facility.type}
                  phone={facility.phone}
                  hours={facility.hours}
                  services={facility.services}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}