import "./FacilityCard.css";

export default function FacilityCard({ 
  id,
  name, 
  address, 
  distance, 
  type, 
  phone, 
  hours, 
  services = [] 
}) {
  const handleGetDirections = () => {
    // Open Google Maps with the facility address
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = () => {
    // Initiate phone call
    window.open(`tel:${phone}`);
  };

  return (
    <div className="facility-card">
      <div className="facility-header">
        <h3 className="facility-name">{name}</h3>
        <span className="facility-type">{type}</span>
      </div>
      
      <div className="facility-info">
        <div className="info-item">
          <span className="icon">📍</span>
          <span className="text">{address}</span>
        </div>
        
        <div className="info-item">
          <span className="icon">📏</span>
          <span className="text">{distance} km away</span>
        </div>
        
        {phone && (
          <div className="info-item">
            <span className="icon">📞</span>
            <span className="text">{phone}</span>
          </div>
        )}
        
        {hours && (
          <div className="info-item">
            <span className="icon">🕒</span>
            <span className="text">{hours}</span>
          </div>
        )}
      </div>

      {services && services.length > 0 && (
        <div className="services-section">
          <h4>Services Available:</h4>
          <div className="services-list">
            {services.slice(0, 4).map((service, index) => (
              <span key={index} className="service-tag">
                {service}
              </span>
            ))}
            {services.length > 4 && (
              <span className="service-tag more-tag">
                +{services.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="facility-actions">
        <button 
          className="action-btn directions-btn"
          onClick={handleGetDirections}
        >
          🗺️ Get Directions
        </button>
        
        {phone && (
          <button 
            className="action-btn call-btn"
            onClick={handleCall}
          >
            📞 Call Now
          </button>
        )}
      </div>
    </div>
  );
}