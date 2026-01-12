// src/pages/Bio/Bio.jsx
import { useNavigate } from "react-router-dom";
import "./Bio.css";

export default function Bio() {
  const navigate = useNavigate();

  return (
    <div className="bio-page">
      <section className="bio-wrap">
        <div className="bio-card">
          <div className="bio-grid">
            <div className="bio-photo">
              <div className="bio-photo-placeholder">
                <div className="bio-photo-inner">
                  <div className="bio-photo-text">PHOTO COMING SOON</div>
                </div>
              </div>
            </div>

            <div className="bio-copy">
              <h1 className="bio-name">Tawnya Reynolds</h1>
              <h2 className="bio-subtitle">
                Singer-Songwriter, New Mexico to Nashville
              </h2>

              <p className="bio-paragraph">
                There’s a certain kind of songwriting that doesn’t just tell a story —
                it <em>lets you live inside it</em>. That’s the lane Tawnya Reynolds has
                carved out: heartfelt, modern Americana with a Nashville pulse and a
                wide-open desert horizon still shining through her melodies.
              </p>

              <p className="bio-paragraph">
                Now based in Nashville, Tawnya performs regularly in town and on the
                road, bringing an intimate, lived-in delivery that feels equal parts
                front-porch familiar and quietly cinematic.
              </p>

              <p className="bio-paragraph">
                Tawnya has released multiple independent records — <span className="bio-label">Carnival</span>,{" "}
                <span className="bio-label">Standing in the Rain</span>,{" "}
                <span className="bio-label">8 Track</span>, and{" "}
                <span className="bio-label">Watering Dead Flowers</span> — each one a snapshot
                of the places we’ve been, the people we’ve loved, and the strength it takes
                to keep moving forward.
              </p>

              <p className="bio-paragraph">
                National audiences may recognize her from NBC’s <em>The Voice</em>, where her
                songwriting heart and vocal presence brought her into the spotlight.
              </p>

              <p className="bio-paragraph">
                She has also appeared on <em>King of the Road: A Roger Miller Tribute</em>,
                alongside acclaimed songwriter Radney Foster — a nod to the classic craft
                she carries into her own work. 
              </p>

              <p className="bio-paragraph bio-quote">
                {/* NOTE: I couldn’t verify this placement via reliable public sources.
                   Keep it if you know it’s correct, or tell me the exact credit and I’ll tighten it up. */}
                “One Day” — featured placement (as credited) on <em>The Forest</em> — Amazon Prime
              </p>

              <p className="bio-paragraph">
                If you’ve ever needed a song that feels like a deep breath — something honest,
                warm, and rooted — you’ll find it here.
              </p>
            </div>
          </div>
        </div>

        <div className="bio-footer">
          <button
            className="bio-booking"
            type="button"
            onClick={() => navigate("/contact")}
          >
            Booking &amp; Contact
          </button>
        </div>
      </section>
    </div>
  );
}