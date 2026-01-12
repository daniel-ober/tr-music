// src/components/layout/SiteShell.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SiteShell.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

import stageImg from "../../assets/images/hero/tr-stage.png";

function routeKey(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/bio")) return "bio";
  if (pathname.startsWith("/music")) return "music";
  if (pathname.startsWith("/shows")) return "shows";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

// Keep in sync with CSS --route-fade-ms
const FADE_MS = 220;

export default function SiteShell({ children }) {
  const location = useLocation();
  const key = useMemo(() => routeKey(location.pathname), [location.pathname]);

  // Subtle parallax value for the background image ONLY
  const [bgY, setBgY] = useState(0);

  // Route transition state
  const [renderKey, setRenderKey] = useState(key);
  const [isVisible, setIsVisible] = useState(false);

  const firstMountRef = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setBgY(y * 0.035);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Initial reveal (prevents first-paint flash, then smoothly fades in)
  useEffect(() => {
    const t = setTimeout(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, 0);

    return () => clearTimeout(t);
  }, []);

  // Transition on route key changes: fade out -> swap -> fade in
  useEffect(() => {
    // If same key, nothing to do
    if (key === renderKey) return;

    // Cancel any in-flight transition
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // First mount: just set immediately
    if (firstMountRef.current) {
      firstMountRef.current = false;
      setRenderKey(key);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    // 1) fade out current content
    setIsVisible(false);

    // 2) after fade out completes, swap content and fade back in
    timeoutRef.current = setTimeout(() => {
      setRenderKey(key);

      // Next frame: allow DOM to paint hidden state, then fade in
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      timeoutRef.current = null;
    }, FADE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [key, renderKey]);

  return (
    <div className="site-shell" data-route={renderKey}>
      {/* FIXED BACKDROP LAYERS (separated so filters don't kill the glow) */}
      <div
        className="site-bg-img"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${stageImg})`,
          transform: `translate3d(0, ${-bgY}px, 0) scale(1.04)`,
        }}
      />
      <div className="site-bg-glow" aria-hidden="true" />
      <div className="site-bg-vignette" aria-hidden="true" />

      {/* Foreground app */}
      <div className="site-foreground">
        <Navbar />

        <main className="site-main" role="main">
          {/* We swap the keyed wrapper AFTER fade-out completes */}
          <div className={`route-layer ${isVisible ? "is-visible" : "is-hidden"}`} key={renderKey}>
            {children}
          </div>
        </main>

        <footer className="site-footer">
          <Footer />
        </footer>
      </div>
    </div>
  );
}