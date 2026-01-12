// src/components/hero/StageHero.jsx
import { useEffect, useMemo, useState } from "react";
import "./StageHero.css";
import mainImg from "../../assets/images/hero/tr-main.png";

export default function StageHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY || 0));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ✅ DO NOT set inline transform (it overrides your CSS crop rules).
  // Instead, feed parallax into a CSS variable that CSS composes with offsets.
  const styleVars = useMemo(() => {
    const fg = Math.min(scrollY * 0.18, 95);
    const parallaxPx = fg * -0.15;
    return { "--portrait-parallax-y": `${parallaxPx}px` };
  }, [scrollY]);

  return (
    <section className="stage-hero" id="home">
      <div className="stage-inner">
        {/* Left */}
        <div className="stage-left">
          <div className="stage-portrait-frame">
            <div className="stage-portrait-wrap" style={styleVars}>
              <img
                src={mainImg}
                alt="Tawnya Reynolds performing"
                className="stage-foreground"
                draggable="false"
              />
              <div className="stage-portrait-shadow" />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="stage-right">
          <div className="stage-copy">
            <div className="stage-kicker">Songwriter · Nashville</div>

            <h1 className="stage-title">Tawnya Reynolds</h1>

            <p className="stage-blurb">
              Honest songs, warm rooms, and a voice that feels like the lights
              just dimmed. A stage-first home for music, stories, and shows.
            </p>

            <div className="stage-cta">
              <button className="ticket-btn ticket-primary" type="button">
                <span className="ticket-top">Listen</span>
                <span className="ticket-sub">Featured tracks</span>
              </button>

              <button className="ticket-btn" type="button">
                <span className="ticket-top">Upcoming Shows</span>
                <span className="ticket-sub">Calendar & tickets</span>
              </button>
            </div>

            <div className="stage-quote">
              <span className="stage-quote-line" />
              <p>“A meaningful song lyric here.”</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}