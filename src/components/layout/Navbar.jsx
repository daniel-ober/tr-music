import { useEffect, useMemo, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => [
      { label: "Home", id: "home" },
      { label: "Bio", id: "bio" },
      { label: "Music", id: "music" },
      { label: "Shows", id: "shows" },
      { label: "Contact", id: "contact" },
    ],
    []
  );

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
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

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const navH =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) ||
      84;

    const y = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <header className={`navbar ${open ? "is-open" : ""}`}>
      <div className="navbar-inner">
        <button
          className="navbar-mark"
          onClick={() => {
            setOpen(false);
            scrollToId("home");
          }}
          aria-label="Go to home"
          type="button"
        >
          <span className="navbar-mark-title">Tawnya Reynolds</span>
          <span className="navbar-mark-sub">Songwriter · Nashville</span>
        </button>

        <nav className="navbar-nav" aria-label="Primary">
          <ul className="navbar-links">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="navbar-link-btn"
                  onClick={() => scrollToId(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`navbar-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
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

      {/* Mobile Nav Sheet (starts UNDER navbar so close button stays visible) */}
      <div className={`navsheet ${open ? "open" : ""}`} role="dialog" aria-modal="true">
        <button
          type="button"
          className="navsheet-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />

        <div className="navsheet-panel" role="document">
          <div className="navsheet-header">
            <div className="navsheet-title">Tawnya Reynolds</div>
            <div className="navsheet-sub">Songwriter · Nashville</div>
          </div>

          <div className="navsheet-links">
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="navsheet-link"
                onClick={() => {
                  setOpen(false);
                  scrollToId(item.id);
                }}
              >
                {item.label}
              </button>
            ))}
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