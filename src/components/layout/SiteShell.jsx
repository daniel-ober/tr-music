// src/components/layout/SiteShell.jsx
import Footer from "./Footer";
import "./SiteShell.css";

import GlobalPlayer from "../player/GlobalPlayer";

export default function SiteShell({ children }) {
  return (
    <div className="site-foreground">
      <main className="site-main">{children}</main>
      <Footer />
      <GlobalPlayer />
    </div>
  );
}