import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 860) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo">
            Tawnya Reynolds
            <span>Songwriter · Nashville</span>
          </div>
        </div>

        <button
          className="navbar-burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className="navbar-links">
          <li>Home</li>
          <li>Bio</li>
          <li>Music</li>
          <li>Shows</li>
          <li>Contact</li>
        </ul>
      </div>

      <div className={`navbar-mobile ${open ? "open" : ""}`}>
        <div className="navbar-mobile-inner">
          {["Home", "Bio", "Music", "Shows", "Contact"].map((item) => (
            <button
              key={item}
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}