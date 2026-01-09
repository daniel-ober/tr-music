import "./Footer.css";

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.51 5.51 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M13.5 22v-8h2.6l.4-3h-3V9.1c0-.86.24-1.45 1.48-1.45H16.6V5a22 22 0 0 0-2.4-.12c-2.37 0-4 1.45-4 4.1V11H7.8v3h2.4v8h3.3Z"
      />
    </svg>
  );
}

function IconYouTube(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.5 12 4.5 12 4.5s-5.7 0-7.5.6A3 3 0 0 0 2.4 7.2 31.5 31.5 0 0 0 2 12a31.5 31.5 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.6 7.5.6 7.5.6s5.7 0 7.5-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 22 12a31.5 31.5 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"
      />
    </svg>
  );
}

function IconSpotify(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.57 14.43a.9.9 0 0 1-1.24.3 9.6 9.6 0 0 0-6.2-1.2.9.9 0 1 1-.3-1.78 11.4 11.4 0 0 1 7.32 1.42.9.9 0 0 1 .42 1.26Zm.9-2.38a1.05 1.05 0 0 1-1.44.35 11.5 11.5 0 0 0-7.1-1.4 1.05 1.05 0 0 1-.35-2.07 13.5 13.5 0 0 1 8.43 1.68 1.05 1.05 0 0 1 .46 1.44Zm.1-2.53a1.2 1.2 0 0 1-1.62.4A13.7 13.7 0 0 0 7.9 10.4a1.2 1.2 0 1 1-.4-2.36 15.9 15.9 0 0 1 9.66 1.94 1.2 1.2 0 0 1 .41 1.54Z"
      />
    </svg>
  );
}

function IconAppleMusic(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16.5 3 9 4.6V15a2.8 2.8 0 1 0 1.5 2.5V7.2l6-1.3V13a2.8 2.8 0 1 0 1.5 2.5V3Z"
      />
    </svg>
  );
}

export default function Footer() {
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const navH =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) ||
      84;

    const y = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-name">Tawnya Reynolds</div>
            <div className="footer-sub">Songwriter · Nashville</div>
          </div>

          <div className="footer-social" aria-label="Social links">
            {/* Replace # with real URLs when ready */}
            <a className="footer-icon" href="#" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a className="footer-icon" href="#" aria-label="Facebook">
              <IconFacebook />
            </a>
            <a className="footer-icon" href="#" aria-label="YouTube">
              <IconYouTube />
            </a>
            <a className="footer-icon" href="#" aria-label="Spotify">
              <IconSpotify />
            </a>
            <a className="footer-icon" href="#" aria-label="Apple Music">
              <IconAppleMusic />
            </a>
          </div>
        </div>

        <div className="footer-mid">
          <div className="footer-sitemap" aria-label="Site map">
            <button type="button" onClick={() => scrollToId("home")}>
              Home
            </button>
            <button type="button" onClick={() => scrollToId("bio")}>
              Bio
            </button>
            <button type="button" onClick={() => scrollToId("music")}>
              Music
            </button>
            <button type="button" onClick={() => scrollToId("shows")}>
              Shows
            </button>
            <button type="button" onClick={() => scrollToId("contact")}>
              Contact
            </button>
          </div>
        </div>

        <div className="footer-legal">
          <span>© {year} Tawnya Reynolds</span>
          <span className="footer-dot">·</span>
          <a href="#" className="footer-legal-link">
            Privacy
          </a>
          <span className="footer-dot">·</span>
          <a href="#" className="footer-legal-link">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}