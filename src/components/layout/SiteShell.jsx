// src/components/layout/SiteShell.jsx
import "./SiteShell.css";
import stageImg from "../../assets/images/hero/tr-stage.png";
import Footer from "./Footer";

export default function SiteShell({ children }) {
  return (
    <div className="site-shell">
      <div
        className="site-bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${stageImg})` }}
      >
        <div className="site-vignette" />
        <div className="site-grain" />
      </div>

      <div className="site-content">
        {children}
        <Footer />
      </div>
    </div>
  );
}