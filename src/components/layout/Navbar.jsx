// src/components/layout/Navbar.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "Bio", to: "/bio" },
      { label: "Music", to: "/music" },
      { label: "Shows", to: "/shows" },
      { label: "Contact", to: "/contact" },
    ],
    []
  );

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on resize up
  useEffect(() => {
    const onResize = () => window.innerWidth >= 900 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function goTo(path) {
    setOpen(false);

    // If already on this route, just scroll to top smoothly.
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
  }

  return (
    <header className={`navbar ${open ? "is-open" : ""}`}>
      <div className="navbar-inner">
        <button
          className="navbar-mark"
          onClick={() => goTo("/")}
          aria-label="Go to home"
          type="button"
        >
          <span className="navbar-mark-title">Tawnya Reynolds</span>
          <span className="navbar-mark-sub">Songwriter · Nashville</span>
        </button>

        <nav className="navbar-nav" aria-label="Primary">
          <ul className="navbar-links">
            {items.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <button
                    className={`navbar-link-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => goTo(item.to)}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            className={`navbar-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            type="button"
          >
            <span className="burger-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="burger-label">{open ? "Close" : "Menu"}</span>
          </button>
        </nav>
      </div>

      {/* Mobile Nav Sheet */}
      <div
        className={`navsheet ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          className="navsheet-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          type="button"
        />

        <div className="navsheet-panel">
          <div className="navsheet-links">
            {items.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  className={`navsheet-link ${isActive ? "is-active" : ""}`}
                  onClick={() => goTo(item.to)}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="navsheet-footer">
            <div className="navsheet-divider" />
            <div className="navsheet-note">
              A stage-first home for songs, stories, and shows.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}