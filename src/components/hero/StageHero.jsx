import { useEffect, useMemo, useState } from "react";
import "./StageHero.css";
import mainImg from "../../assets/images/hero/tr-main.png";
import stageImg from "../../assets/images/hero/tr-stage.png";

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

  const transforms = useMemo(() => {
    const bg = Math.min(scrollY * 0.12, 70);
    const fg = Math.min(scrollY * 0.18, 95);
    return {
      bgTransform: `translate3d(0, ${bg}px, 0) scale(1.06)`,
      fgTransform: `translate3d(0, ${fg * -0.15}px, 0)`,
    };
  }, [scrollY]);

  return (
    <section className="stage-hero" id="home">
      <div className="stage-bg-wrap" aria-hidden="true">
        <div
          className="stage-backdrop"
          style={{
            backgroundImage: `url(${stageImg})`,
            transform: transforms.bgTransform,
          }}
        />
        <div className="stage-vignette" />
        <div className="stage-grain" />
      </div>

      {/* Soft “stage haze” behind composed content */}
      <div className="stage-haze" aria-hidden="true" />

      <div className="stage-inner">
        {/* Left: image */}
        <div className="stage-left">
          <div
            className="stage-portrait-wrap"
            style={{ transform: transforms.fgTransform }}
          >
            <img
              src={mainImg}
              alt="Tawnya Reynolds performing"
              className="stage-foreground"
              draggable="false"
            />
            <div className="stage-portrait-shadow" />
          </div>
        </div>

        {/* Right: copy */}
        <div className="stage-right">
          <div className="stage-copy">
            <div className="stage-kicker">Songwriter · Nashville</div>

            <h1 className="stage-title">Tawnya Reynolds</h1>

            <p className="stage-blurb">
              Honest songs, warm rooms, and a voice that feels like the lights just dimmed.
              A stage-first home for music, stories, and shows.
            </p>

            <div className="stage-cta">
              <button type="button" className="ticket-btn ticket-primary">
                <span className="ticket-top">Listen</span>
                <span className="ticket-sub">Featured tracks</span>
              </button>

              <button type="button" className="ticket-btn">
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

      {/* Scroll cue */}
      <div className="stage-scrollhint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}