import { useMemo, useState } from "react";
import "./Contact.css";

/* ---------- Inline SVG Icons (no deps) ---------- */
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7l8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 3h-3a5 5 0 00-5 5v3H4v4h3v6h4v-6h3l1-4h-4V8a1 1 0 011-1h3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="7"
        width="18"
        height="10"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M11 10l4 2-4 2z" fill="currentColor" />
    </svg>
  );
}

/* ---------- Component ---------- */

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.email.includes("@") &&
      form.message.trim().length >= 12
    );
  }, [form]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    alert("Submitted (stub). Wire to backend next.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <main className="contact-page">
      <section className="contact-wrap">
        <header className="contact-head">
          <h1 className="contact-title">Booking and Contact</h1>
          <p className="contact-sub">
            For booking inquiries, collaborations, or press — send a note below.
          </p>
          <div className="contact-rule" />
        </header>

        <div className="contact-grid">
          {/* LEFT: DETAILS */}
          <aside className="contact-card">
            <div className="contact-card-title">Details</div>

            <div className="contact-block">
              <div className="contact-label">Email</div>
              <a
                className="contact-email"
                href="mailto:booking@tawnyareynoldsmusic.com"
              >
                <IconMail />
                booking@tawnyareynoldsmusic.com
              </a>
              <div className="contact-hint">
                Fastest way to reach us for booking.
              </div>
            </div>

            <div className="contact-block">
              <div className="contact-label">Social</div>

              <div className="contact-social-row">
                <a className="social-pill" href="#" onClick={(e) => e.preventDefault()}>
                  <IconFacebook />
                  <span>Facebook</span>
                </a>
                <a className="social-pill" href="#" onClick={(e) => e.preventDefault()}>
                  <IconYouTube />
                  <span>YouTube</span>
                </a>
                <a className="social-pill" href="#" onClick={(e) => e.preventDefault()}>
                  <IconInstagram />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT: FORM */}
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-card-title">Send a message</div>

            <label className="field">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@email.com"
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={7}
                placeholder="Tell us about the venue, date, and overall vibe you’re looking for…"
              />
              <div className="field-help">
                Tip: include date / location / time window if this is for a show.
              </div>
            </label>

            <button className="contact-submit" type="submit" disabled={!canSubmit}>
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}