import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import RoutesConfig from "./routes";
import SiteShell from "../components/layout/SiteShell";

import stageBg from "../assets/images/hero/tr-stage.png";

/**
 * AppInner controls:
 *  - background image + per-route glow vars
 *  - proper route transitions (old route exits, THEN new enters)
 */
function AppInner() {
  const location = useLocation();

  // We render Routes against displayedLocation so we can animate OUT first.
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [phase, setPhase] = useState("idle"); // "idle" | "exiting" | "entering"
  const timeouts = useRef({ exit: 0, enter: 0 });

  // Background image is always present behind the whole app
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--stage-bg-url", `url(${stageBg})`);
    return () => {
      root.style.removeProperty("--stage-bg-url");
    };
  }, []);

  // Per-route glow colors (soft stage lights)
  const glowVars = useMemo(() => {
    const p = location.pathname;

    // Default (Home-ish)
    let glowA = "rgba(120, 170, 255, 0.20)"; // cool blue
    let glowB = "rgba(201, 162, 93, 0.20)";  // amber warmth
    let glowC = "rgba(255, 120, 170, 0.12)"; // pink hint

    if (p.startsWith("/bio")) {
      glowA = "rgba(201, 162, 93, 0.22)"; // amber/gold
      glowB = "rgba(255, 210, 150, 0.14)";
      glowC = "rgba(120, 220, 200, 0.10)";
    } else if (p.startsWith("/music")) {
      glowA = "rgba(155, 120, 255, 0.18)"; // violet
      glowB = "rgba(80, 200, 255, 0.16)";
      glowC = "rgba(201, 162, 93, 0.12)";
    } else if (p.startsWith("/shows")) {
      glowA = "rgba(255, 120, 120, 0.16)"; // warm red
      glowB = "rgba(255, 200, 120, 0.14)";
      glowC = "rgba(120, 170, 255, 0.10)";
    } else if (p.startsWith("/contact")) {
      glowA = "rgba(120, 220, 160, 0.14)"; // greenish
      glowB = "rgba(201, 162, 93, 0.16)";
      glowC = "rgba(120, 170, 255, 0.10)";
    }

    return {
      "--glow-a": glowA,
      "--glow-b": glowB,
      "--glow-c": glowC,
    };
  }, [location.pathname]);

  // Keep html data-route for debugging / optional styling hooks
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.route = location.pathname || "/";
  }, [location.pathname]);

  // Proper route transition:
  // 1) When location changes, start EXIT on current displayed route
  // 2) After exit duration, swap displayed route, then ENTER
  useEffect(() => {
    // Same path? do nothing
    if (location.pathname === displayedLocation.pathname) return;

    // Clear any prior timers
    window.clearTimeout(timeouts.current.exit);
    window.clearTimeout(timeouts.current.enter);

    setPhase("exiting");

    // After exit: swap the displayed location and enter
    timeouts.current.exit = window.setTimeout(() => {
      setDisplayedLocation(location);

      // Jump to top before we show the new page
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // Next frame: enter
      requestAnimationFrame(() => {
        setPhase("entering");

        // After enter finishes: idle
        timeouts.current.enter = window.setTimeout(() => {
          setPhase("idle");
        }, 380);
      });
    }, 240);

    return () => {
      window.clearTimeout(timeouts.current.exit);
      window.clearTimeout(timeouts.current.enter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="app-stage" style={glowVars}>
      {/* Fixed background + glow behind everything */}
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-glow" aria-hidden="true" />

      {/* Foreground app content */}
      <div className={`route-stage ${phase === "exiting" ? "is-exiting" : ""} ${phase === "entering" ? "is-entering" : ""}`}>
        <SiteShell>
          <RoutesConfig location={displayedLocation} />
        </SiteShell>
      </div>
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