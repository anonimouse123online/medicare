import "./ResultCard.css";

export default function ResultCard({ title, description }) {
  // Parse the AI health analysis into structured sections
  const parseHealthAnalysis = (text) => {
    const sections = {};
    const lines = text.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Detect section headers
      if (trimmedLine.includes('**SYMPTOM ASSESSMENT:**')) {
        currentSection = 'symptomAssessment';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**POSSIBLE CONDITIONS:**')) {
        currentSection = 'possibleConditions';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**RECOMMENDED OTC MEDICATIONS:**')) {
        currentSection = 'medications';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**WHEN TO SEE A DOCTOR:**')) {
        currentSection = 'seeDoctor';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**SELF-CARE ADVICE:**')) {
        currentSection = 'selfCare';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**EMERGENCY WARNING SIGNS:**')) {
        currentSection = 'emergency';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**IMPORTANT DISCLAIMER:**')) {
        currentSection = 'disclaimer';
        sections[currentSection] = '';
      } else if (trimmedLine.includes('**RECOMMENDED MEDICAL FACILITIES:**')) {
        currentSection = 'facilities';
        sections[currentSection] = '';
      }
      // Add content to current section
      else if (currentSection && trimmedLine && !trimmedLine.includes('**')) {
        sections[currentSection] += (sections[currentSection] ? '\n' : '') + trimmedLine;
      }
    });
    
    return sections;
  };

  const formatSectionContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return null;
      
      if (trimmedLine.startsWith('•')) {
        return (
          <div key={index} className="list-item">
            <span className="bullet">•</span>
            <span className="list-text">{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      } else if (trimmedLine.includes(':')) {
        const [label, value] = trimmedLine.split(':');
        return (
          <div key={index} className="key-value">
            <strong>{label.trim()}:</strong>
            <span>{value.trim()}</span>
          </div>
        );
      } else {
        return (
          <p key={index} className="paragraph">
            {trimmedLine}
          </p>
        );
      }
    });
  };

  const sections = parseHealthAnalysis(description);

  return (
    <div className="health-analysis-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-subtitle">AI-Powered Health Analysis</div>
      </div>

      <div className="card-content">
        {/* Symptom Assessment */}
        {sections.symptomAssessment && (
          <div className="analysis-section symptom-assessment">
            <div className="section-header">
              <span className="section-icon">🔍</span>
              <h4>Symptom Assessment</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.symptomAssessment)}
            </div>
          </div>
        )}

        {/* Possible Conditions */}
        {sections.possibleConditions && (
          <div className="analysis-section possible-conditions">
            <div className="section-header">
              <span className="section-icon">📋</span>
              <h4>Possible Conditions</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.possibleConditions)}
            </div>
          </div>
        )}

        {/* Medications */}
        {sections.medications && (
          <div className="analysis-section medications">
            <div className="section-header">
              <span className="section-icon">💊</span>
              <h4>Recommended OTC Medications</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.medications)}
            </div>
          </div>
        )}

        {/* When to See Doctor */}
        {sections.seeDoctor && (
          <div className="analysis-section see-doctor">
            <div className="section-header">
              <span className="section-icon">⚠️</span>
              <h4>When to See a Doctor</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.seeDoctor)}
            </div>
          </div>
        )}

        {/* Self-Care Advice */}
        {sections.selfCare && (
          <div className="analysis-section self-care">
            <div className="section-header">
              <span className="section-icon">🏠</span>
              <h4>Self-Care Advice</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.selfCare)}
            </div>
          </div>
        )}

        {/* Emergency Warning Signs */}
        {sections.emergency && (
          <div className="analysis-section emergency-warning">
            <div className="section-header">
              <span className="section-icon">🚨</span>
              <h4>Emergency Warning Signs</h4>
            </div>
            <div className="section-content urgent">
              {formatSectionContent(sections.emergency)}
            </div>
          </div>
        )}

        {/* Recommended Facilities */}
        {sections.facilities && (
          <div className="analysis-section facilities">
            <div className="section-header">
              <span className="section-icon">🏥</span>
              <h4>Recommended Medical Facilities</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.facilities)}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {sections.disclaimer && (
          <div className="analysis-section disclaimer">
            <div className="section-header">
              <span className="section-icon">📝</span>
              <h4>Important Disclaimer</h4>
            </div>
            <div className="section-content">
              {formatSectionContent(sections.disclaimer)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}