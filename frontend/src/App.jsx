import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import OTC from "./pages/OTC";
import Facilities from "./pages/Facilities";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/otc" element={<OTC />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
