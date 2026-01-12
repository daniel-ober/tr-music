import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Music.css";

import coverStandingInTheRain from "../../assets/albums/standing_in_the_rain.webp";
import cover8Track from "../../assets/albums/8_track.webp";
import coverWateringDeadFlowers from "../../assets/albums/watering_dead_flowers.webp";

const ALBUMS = [
  {
    id: "standing-in-the-rain",
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
    id: "8-track",
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
    id: "watering-dead-flowers",
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

function makeAlbumTrackObjects(albums) {
  // Normalize into an array of track objects the GlobalPlayer understands
  const catalog = [];
  const byAlbum = new Map();

  for (const a of albums) {
    const albumId = a.id || a.title;
    const albumTitle = a.title;
    const albumArtist = a.subtitle || "Tawnya Reynolds";
    const coverSrc = a.cover;

    const tracks = (a.tracks || []).map((trackTitle, idx) => {
      const t = {
        trackId: `${albumId}::${idx + 1}`,
        albumId,
        albumTitle,
        albumArtist,
        coverSrc,
        trackTitle,
        trackNumber: idx + 1,
      };
      catalog.push(t);
      return t;
    });

    byAlbum.set(albumId, tracks);
  }

  return { catalog, byAlbum };
}

function dispatchLoadToPlayer({ album, trackObj, albumTracks, catalogTracks }) {
  window.dispatchEvent(
    new CustomEvent("tr:player:load", {
      detail: {
        albumTitle: album.title,
        albumArtist: album.subtitle || "Tawnya Reynolds",
        trackTitle: trackObj.trackTitle,
        coverSrc: album.cover,
        albumId: album.id || album.title,
        trackId: trackObj.trackId || trackObj.trackTitle,
        albumTracks,
        catalogTracks,
      },
    })
  );
}

export default function Music() {
  const navigate = useNavigate();
  const albums = useMemo(() => ALBUMS, []);

  const { catalog, byAlbum } = useMemo(
    () => makeAlbumTrackObjects(albums),
    [albums]
  );

  function onClickTrack(album, trackTitle, idx) {
    const albumId = album.id || album.title;
    const albumTracks = byAlbum.get(albumId) || [];
    const trackObj = albumTracks[idx] ||
      albumTracks.find((t) => t.trackTitle === trackTitle) || {
        trackId: `${albumId}::${idx + 1}`,
        albumId,
        albumTitle: album.title,
        albumArtist: album.subtitle || "Tawnya Reynolds",
        coverSrc: album.cover,
        trackTitle,
        trackNumber: idx + 1,
      };

    dispatchLoadToPlayer({
      album,
      trackObj,
      albumTracks,
      catalogTracks: catalog,
    });
  }

  function onAlbumListen(album) {
    // “Listen” loads the first track (or keeps current if that album is already loaded).
    const albumId = album.id || album.title;
    const albumTracks = byAlbum.get(albumId) || [];
    const first = albumTracks[0];
    if (!first) return;

    dispatchLoadToPlayer({
      album,
      trackObj: first,
      albumTracks,
      catalogTracks: catalog,
    });
  }

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
                    <button
                      className="album-pill"
                      type="button"
                      onClick={() => onAlbumListen(a)}
                    >
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
                  <button
                    key={`${a.title}-${t}`}
                    className="track-row"
                    type="button"
                    onClick={() => onClickTrack(a, t, idx)}
                    aria-label={`Load ${t} from ${a.title}`}
                  >
                    <div className="tracks-col tracks-num">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="tracks-col tracks-name">{t}</div>

                    <div className="tracks-col tracks-price">
                      <span className="price-btn" aria-hidden="true">
                        Your Price
                      </span>
                    </div>
                  </button>
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
