// src/app/App.jsx
import { useEffect, useRef } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import RoutesConfig from "./routes";

import Navbar from "../components/layout/Navbar";
import SiteShell from "../components/layout/SiteShell";

import stageBg from "../assets/images/hero/tr-stage.png";

function AppInner() {
  const location = useLocation();
  const timers = useRef({ enter: 0, glow: 0 });

  // ✅ Set stage background URL once (stable)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--stage-bg-url", `url(${stageBg})`);
    return () => root.style.removeProperty("--stage-bg-url");
  }, []);

  // ✅ Route dataset drives glow colors purely in CSS (no inline style → less “refresh”)
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.route = location.pathname || "/";
  }, [location.pathname]);

  // ✅ Page transitions (CSS-only animations triggered by html classes)
  // No displayedLocation swapping. No unmount tricks. No react-transition-group.
  useEffect(() => {
    const root = document.documentElement;

    window.clearTimeout(timers.current.enter);
    window.clearTimeout(timers.current.glow);

    // Page enters quickly
    root.classList.remove("route-enter");
    // Trigger reflow so animation restarts reliably
    // eslint-disable-next-line no-unused-expressions
    root.offsetHeight;
    root.classList.add("route-enter");

    timers.current.enter = window.setTimeout(() => {
      root.classList.remove("route-enter");
    }, 520);

    // Glow shifts slower than page
    root.classList.add("glow-shift");
    timers.current.glow = window.setTimeout(() => {
      root.classList.remove("glow-shift");
    }, 1600);

    return () => {
      window.clearTimeout(timers.current.enter);
      window.clearTimeout(timers.current.glow);
    };
  }, [location.pathname]);

  // ✅ Stage background parallax (subtle, smooth, cheap)
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        // subtle parallax — tweak multiplier as desired
        const parallax = Math.round(y * -0.06);
        root.style.setProperty("--stage-parallax-y", `${parallax}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      root.style.removeProperty("--stage-parallax-y");
    };
  }, []);

  return (
    <div className="app-stage">
      {/* Fixed background stack (never unmounts) */}
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-glow" aria-hidden="true" />
      <div className="app-colorwash" aria-hidden="true" />
      <div className="app-vignette" aria-hidden="true" />

      {/* Navbar is persistent */}
      <Navbar />

      {/* Foreground layout (main + footer persistent) */}
      <SiteShell>
        <RoutesConfig />
      </SiteShell>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}