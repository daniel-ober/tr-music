// src/pages/Music/Music.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Music.css";

import coverStandingInTheRain from "../../assets/albums/standing_in_the_rain.webp";
import cover8Track from "../../assets/albums/8_track.webp";
import coverWateringDeadFlowers from "../../assets/albums/watering_dead_flowers.webp";

const ALBUMS = [
  {
    title: "Standing In The Rain",
    subtitle: "Tawnya Reynolds",
    cover: coverStandingInTheRain,
    tracks: [
      "Standing In The Rain",
      "I’ve Got A Memory",
      "What God Gave Me",
      "Saving For A Rainy Day",
      "In Love",
      "Only Me I’m Lying To",
      "Love Is Alive",
      "Keep On Dreaming",
      "101 Woman Man",
    ],
  },
  {
    title: "8 Track",
    subtitle: "Tawnya Reynolds",
    cover: cover8Track,
    tracks: [
      "Wander",
      "Water Balloons",
      "Young As You’ll Ever Be",
      "The B-side",
      "Side Effects",
      "Happy Ever After",
      "Southwest",
    ],
  },
  {
    title: "Watering Dead Flowers",
    subtitle: "Tawnya Reynolds",
    cover: coverWateringDeadFlowers,
    tracks: [
      "Black River Road",
      "Sail On, Alice",
      "Talkin’",
      "One Day",
      "Watering Dead Flowers",
      "Still Feel Everything",
      "Broken Record",
      "Down To Earth",
      "I Know You",
      "Cloud 9",
      "Goodbye Song",
    ],
  },
];

function fallbackCover(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
        <defs>
          <radialGradient id="g" cx="35%" cy="25%" r="80%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
            <stop offset="55%" stop-color="rgba(0,0,0,0.10)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.35)"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="rgba(255,255,255,0.03)"/>
        <rect x="18" y="18" width="564" height="564" rx="26" fill="url(#g)" stroke="rgba(255,255,255,0.14)" stroke-dasharray="6 8"/>
        <text x="50%" y="52%" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="18" fill="rgba(255,255,255,0.40)" letter-spacing="6">
          COVER
        </text>
      </svg>
    `);
}

export default function Music() {
  const navigate = useNavigate();
  const albums = useMemo(() => ALBUMS, []);

  return (
    <main className="music-page">
      <section className="music-wrap" aria-label="Music">
        <header className="music-header">
          <div className="music-header-left">
            <h1 className="music-title">Music</h1>
            <p className="music-sub">
              Albums &amp; track list — pay-what-you-want downloads.
            </p>
          </div>

          <div className="music-header-right">
            <button
              className="music-cta"
              type="button"
              onClick={() => navigate("/contact")}
            >
              Booking &amp; Contact
            </button>
          </div>
        </header>

        <div className="albums-grid" aria-label="Album list">
          {albums.map((a) => (
            <article key={a.title} className="album">
              <div className="album-top">
                <div className="album-cover" aria-hidden="true">
                  <img
                    src={a.cover}
                    alt={`${a.title} cover`}
                    draggable="false"
                    loading="lazy"
                    onError={fallbackCover}
                  />
                </div>

                <div className="album-meta">
                  <div className="album-kicker">Album</div>
                  <h2 className="album-title">{a.title}</h2>
                  <div className="album-sub">{a.subtitle}</div>

                  <div className="album-actions" aria-label="Album actions">
                    <button className="album-pill" type="button">
                      Listen
                    </button>
                    <button className="album-pill" type="button">
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="album-tracks"
                role="table"
                aria-label={`${a.title} tracks`}
              >
                <div className="tracks-head" role="row">
                  <div className="tracks-col tracks-num" role="columnheader">
                    #
                  </div>
                  <div className="tracks-col tracks-name" role="columnheader">
                    Track
                  </div>
                  <div className="tracks-col tracks-price" role="columnheader">
                    Your Price
                  </div>
                </div>

                {a.tracks.map((t, idx) => (
                  <div key={`${a.title}-${t}`} className="track-row" role="row">
                    <div className="tracks-col tracks-num" role="cell">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="tracks-col tracks-name" role="cell">
                      {t}
                    </div>

                    <div className="tracks-col tracks-price" role="cell">
                      <button className="price-btn" type="button">
                        Your Price
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="music-footer">
          <button
            className="music-booking"
            type="button"
            onClick={() => navigate("/contact")}
          >
            Booking &amp; Contact
          </button>
        </div>
      </section>
    </main>
  );
}