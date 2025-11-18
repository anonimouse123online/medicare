import Navbar from "../components/Navbar";
import ResultCard from "../components/ResultCard";

export default function OTC() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2>OTC Medicines Guide</h2>
        <ResultCard title="Paracetamol" description="For fever and mild pain." />
        <ResultCard title="Loperamide" description="Helps with diarrhea." />
      </div>
    </>
  );
}
