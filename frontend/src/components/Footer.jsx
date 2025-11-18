import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} MediGuide AI. All rights reserved.</p>
      <p className="footer-sub">AI-Powered Pharmacy & Healthcare Assistant</p>
    </footer>
  );
}
