import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./GlobalPlayer.css";

/**
 * Global Player (UI + shuffle logic only)
 *
 * - No external icon libs (no lucide-react).
 * - Does NOT actually play audio yet.
 * - Listens for window event to load a track:
 *
 *   window.dispatchEvent(new CustomEvent("tr:player:load", {
 *     detail: {
 *       albumTitle,
 *       albumArtist,
 *       trackTitle,
 *       coverSrc,
 *       // optional: trackId, albumId, allTracksForAlbum, allTracksForCatalog
 *       trackId,
 *       albumId,
 *       albumTracks,   // [{ trackId, trackTitle, albumId, albumTitle, albumArtist, coverSrc }]
 *       catalogTracks, // same structure as albumTracks but across all albums
 *     }
 *   }));
 *
 * Music page will be updated in the next step to dispatch this.
 */

const SHUFFLE_MODES = ["off", "album", "all"];

function clamp(n, a, b) {
  const x = Number(n);
  if (!Number.isFinite(x)) return a;
  return Math.max(a, Math.min(b, x));
}

/* ---------------- Icons (inline SVG) ---------------- */
function IconShuffle({ active }) {
  return (
    <svg
      className="gp__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 3h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.65}
      />
      <path
        d="M4 20l6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.65}
      />
      <path
        d="M16 21h5v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 1 : 0.65}
      />
      <path
        d="M4 4l6 6c1.2 1.2 2.2 1.8 3.8 1.8H21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20l6-6c1.2-1.2 2.2-1.8 3.8-1.8H21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg className="gp__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11 19V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 19L11 12l9-7v14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconNext() {
  return (
    <svg className="gp__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13 19V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 19l9-7-9-7v14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      className="gp__icon gp__icon--play"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M9 7l10 5-10 5V7z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg
      className="gp__icon gp__icon--play"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7 6h4v12H7z" fill="currentColor" />
      <path d="M13 6h4v12h-4z" fill="currentColor" />
    </svg>
  );
}

function IconChevronUp() {
  return (
    <svg className="gp__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 14l6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg className="gp__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 10l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
/* --------------------------------------------------- */

function makeKey(t) {
  return `${t.albumId || t.albumTitle}::${t.trackId || t.trackTitle}`;
}

function pickNextFromPool(pool, recentKeys, windowSize) {
  if (!pool.length) return null;
  const recentSet = new Set(recentKeys.slice(-windowSize));
  const candidates = pool.filter((t) => !recentSet.has(makeKey(t)));
  const list = candidates.length ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export default function GlobalPlayer() {
  const rootRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  // Not real audio yet, just UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [durationSec] = useState(0); // placeholder until audio

  const [shuffleModeIdx, setShuffleModeIdx] = useState(0);
  const shuffleMode = SHUFFLE_MODES[shuffleModeIdx];

  // Track state
  const [current, setCurrent] = useState({
    albumTitle: "No track selected",
    albumArtist: "Select a song from the catalog to start jammin’",
    trackTitle: "",
    coverSrc: "",
    albumId: "",
    trackId: "",
  });

  // Pools for shuffle
  const [albumTracks, setAlbumTracks] = useState([]);
  const [catalogTracks, setCatalogTracks] = useState([]);

  // Memory for "avoid recently played"
  const [recentKeys, setRecentKeys] = useState([]);

  const hasTrack = useMemo(() => {
    return Boolean(current && current.trackTitle && current.albumTitle);
  }, [current]);

  // ✅ Keep footer reachable: auto set --player-h to the actual rendered height
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const el = rootRef.current;

    const apply = () => {
      const rect = el.getBoundingClientRect();
      const h = Math.max(0, Math.round(rect.height));

      // ✅ Extra breathing room so footer links are never covered
      const BUFFER_PX = 44;

      document.documentElement.style.setProperty(
        "--player-h",
        `${h + BUFFER_PX}px`
      );
    };

    apply();

    const ro = new ResizeObserver(() => apply());
    ro.observe(el);

    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [expanded]);

  // Listen for track load events from pages
  useEffect(() => {
    function onLoad(ev) {
      const d = ev?.detail || {};
      const next = {
        albumTitle: d.albumTitle || "Unknown Album",
        albumArtist: d.albumArtist || "Tawnya Reynolds",
        trackTitle: d.trackTitle || "",
        coverSrc: d.coverSrc || "",
        albumId: d.albumId || d.albumTitle || "",
        trackId: d.trackId || d.trackTitle || "",
      };

      setCurrent(next);

      if (Array.isArray(d.albumTracks)) setAlbumTracks(d.albumTracks);
      if (Array.isArray(d.catalogTracks)) setCatalogTracks(d.catalogTracks);

      // Add to recent
      const key = makeKey(next);
      setRecentKeys((prev) => {
        const out = [...prev, key];
        // cap memory
        return out.slice(-120);
      });

      // When user chooses a track, we consider it "loaded" and ready
      setIsPlaying(false);
      setProgress(0);

      // Ensure player is visible (but don't force expand)
      // (collapse/expand already works; we keep it calm)
    }

    window.addEventListener("tr:player:load", onLoad);
    return () => window.removeEventListener("tr:player:load", onLoad);
  }, []);

  function cycleShuffleMode() {
    setShuffleModeIdx((i) => (i + 1) % SHUFFLE_MODES.length);
  }

  function togglePlay() {
    // Not real audio yet; just UI state
    if (!hasTrack) return;
    setIsPlaying((v) => !v);
  }

  function nextTrack() {
    if (shuffleMode === "off") {
      // With no audio playlist yet, "next" in off mode does nothing unless we have albumTracks
      const pool = albumTracks.length ? albumTracks : catalogTracks;
      if (!pool.length) return;

      // Next sequential within album if possible
      const idx = pool.findIndex((t) => makeKey(t) === makeKey(current));
      const next = pool[(idx + 1 + pool.length) % pool.length];
      if (!next) return;

      setCurrent({
        albumTitle: next.albumTitle,
        albumArtist: next.albumArtist || "Tawnya Reynolds",
        trackTitle: next.trackTitle,
        coverSrc: next.coverSrc || "",
        albumId: next.albumId || next.albumTitle,
        trackId: next.trackId || next.trackTitle,
      });

      setRecentKeys((prev) => [...prev, makeKey(next)].slice(-120));
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    const pool =
      shuffleMode === "album"
        ? albumTracks
        : shuffleMode === "all"
        ? catalogTracks
        : [];

    if (!pool.length) return;

    const windowSize = clamp(pool.length, 6, 40);
    const picked = pickNextFromPool(pool, recentKeys, windowSize);
    if (!picked) return;

    setCurrent({
      albumTitle: picked.albumTitle,
      albumArtist: picked.albumArtist || "Tawnya Reynolds",
      trackTitle: picked.trackTitle,
      coverSrc: picked.coverSrc || "",
      albumId: picked.albumId || picked.albumTitle,
      trackId: picked.trackId || picked.trackTitle,
    });

    setRecentKeys((prev) => [...prev, makeKey(picked)].slice(-120));
    setIsPlaying(false);
    setProgress(0);
  }

  function prevTrack() {
    const pool = albumTracks.length ? albumTracks : catalogTracks;
    if (!pool.length) return;

    const idx = pool.findIndex((t) => makeKey(t) === makeKey(current));
    const prev = pool[(idx - 1 + pool.length) % pool.length];
    if (!prev) return;

    setCurrent({
      albumTitle: prev.albumTitle,
      albumArtist: prev.albumArtist || "Tawnya Reynolds",
      trackTitle: prev.trackTitle,
      coverSrc: prev.coverSrc || "",
      albumId: prev.albumId || prev.albumTitle,
      trackId: prev.trackId || prev.trackTitle,
    });

    setRecentKeys((p) => [...p, makeKey(prev)].slice(-120));
    setIsPlaying(false);
    setProgress(0);
  }

  const shuffleLabel =
    shuffleMode === "off" ? "Off" : shuffleMode === "album" ? "Album" : "All";

  const displayTitle = current.trackTitle
    ? current.trackTitle
    : "No track selected";

  const displaySub = current.trackTitle ? (
    `${current.albumTitle} • ${current.albumArtist}`
  ) : (
    <>
      Select a song from the{" "}
      <a href="/music" className="gp__link">
        catalog
      </a>{" "}
      to start jammin’
    </>
  );

  // Minimal hidden / collapsed bar height is handled by CSS.
  // When collapsed, we still show art + basic controls.
  return (
    <section
      ref={rootRef}
      className={`gp ${expanded ? "gp--expanded" : "gp--collapsed"}`}
      aria-label="Global music player"
    >
      {/* ✅ COLLAPSED: single action only */}
      {!expanded && (
        <div className="gp__collapsedBar">
          <button
            type="button"
            className="gp__openBtn"
            onClick={() => setExpanded(true)}
            aria-label="Open player"
            title="Open Player"
          >
            <IconChevronUp />
            <span className="gp__openText">Open Player</span>
          </button>
        </div>
      )}

      {/* ✅ EXPANDED: full player UI */}
      {expanded && (
        <div className="gp__inner">
          <div className="gp__left">
            <div className="gp__cover" aria-hidden="true">
              {current.coverSrc ? (
                <img src={current.coverSrc} alt="" draggable="false" />
              ) : (
                <div className="gp__coverFallback" />
              )}
            </div>

            <div className="gp__meta">
              <div className="gp__track" title={displayTitle}>
                {displayTitle}
              </div>
              <div className="gp__sub" title={displaySub}>
                {displaySub}
              </div>
            </div>
          </div>

          <div className="gp__center">
            <div className="gp__controls" aria-label="Player controls">
              <button
                type="button"
                className={`gp__btn gp__btn--ghost ${
                  shuffleMode !== "off" ? "gp__btn--active" : ""
                }`}
                onClick={cycleShuffleMode}
                aria-label={`Shuffle mode: ${shuffleLabel}`}
                title={`Shuffle: ${shuffleLabel}`}
              >
                <IconShuffle active={shuffleMode !== "off"} />
                <span className="gp__btnText gp__btnText--shuffle">
                  {shuffleLabel}
                </span>{" "}
              </button>

              <button
                type="button"
                className="gp__btn gp__btn--icon"
                onClick={prevTrack}
                aria-label="Previous"
                title="Previous"
                disabled={
                  !hasTrack && !albumTracks.length && !catalogTracks.length
                }
              >
                <IconPrev />
              </button>

              <button
                type="button"
                className="gp__btn gp__btn--primary"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                title={isPlaying ? "Pause" : "Play"}
                disabled={!hasTrack}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>

              <button
                type="button"
                className="gp__btn gp__btn--icon"
                onClick={nextTrack}
                aria-label="Next"
                title="Next"
                disabled={
                  !hasTrack && !albumTracks.length && !catalogTracks.length
                }
              >
                <IconNext />
              </button>
            </div>

            <div className="gp__timeline" aria-label="Timeline">
              <div className="gp__time gp__time--left">0:00</div>

              <input
                className="gp__range"
                type="range"
                min="0"
                max="1000"
                value={Math.round(progress * 1000)}
                onChange={(e) => {
                  const v = clamp(Number(e.target.value), 0, 1000);
                  setProgress(v / 1000);
                }}
                aria-label="Scrub"
              />

              <div className="gp__time gp__time--right">0:00</div>
            </div>
          </div>

          <div className="gp__right">
            <button
              type="button"
              className="gp__toggle"
              onClick={() => setExpanded(false)}
              aria-label="Collapse player"
              title="Collapse"
            >
              <IconChevronDown />
              <span className="gp__toggleText">Collapse</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
