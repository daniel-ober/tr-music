// src/components/layout/SiteShell.jsx
import Footer from "./Footer";
import "./SiteShell.css";

export default function SiteShell({ children }) {
  return (
    <div className="site-foreground">
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}