// src/pages/Bio/Bio.jsx
import { useNavigate } from "react-router-dom";
import "./Bio.css";
import bioImg from "../../assets/images/hero/tr-bio.png";

export default function Bio() {
  const navigate = useNavigate();

  return (
    <div className="bio-page">
      <section className="bio-wrap">
        <div className="bio-card">
          <div className="bio-grid">
            <div className="bio-photo">
              <div className="bio-photo-frame">
                <img
                  src={bioImg}
                  alt="Tawnya Reynolds"
                  className="bio-photo-img"
                  draggable="false"
                />
              </div>
            </div>

            <div className="bio-copy">
              <div className="bio-kicker">Tawnya Reynolds</div>

              <h1 className="bio-name">Tawnya Reynolds</h1>
              <h2 className="bio-subtitle">
                Singer-Songwriter, New Mexico to Nashville
              </h2>

              <p className="bio-paragraph">
                There’s a certain kind of songwriting that doesn’t just tell a
                story — it <em>lets you live inside it</em>. That’s the lane
                Tawnya Reynolds has carved out: heartfelt, modern Americana with
                a Nashville pulse and a wide-open desert horizon still shining
                through her melodies.
              </p>

              <p className="bio-paragraph">
                Now based in Nashville, Tawnya performs regularly in town and on
                the road, bringing an intimate, lived-in delivery that feels
                equal parts front-porch familiar and quietly cinematic.
              </p>

              <p className="bio-paragraph">
                Tawnya has released multiple independent records —{" "}
                <span className="bio-record">Carnival</span>,{" "}
                <span className="bio-record">Standing in the Rain</span>,{" "}
                <span className="bio-record">8 Track</span>, and{" "}
                <span className="bio-record">Watering Dead Flowers</span> — each
                one a snapshot of the places we’ve been, the people we’ve loved,
                and the strength it takes to keep moving forward.
              </p>

              <p className="bio-paragraph">
                National audiences may recognize her from NBC’s{" "}
                <em>The Voice</em>, where her songwriting heart and vocal
                presence brought her into the spotlight.
              </p>

              <p className="bio-paragraph">
                She has also appeared on{" "}
                <em>King of the Road: A Roger Miller Tribute</em>, alongside
                acclaimed songwriter Radney Foster — a nod to the classic craft
                she carries into her own work.
              </p>

              <div className="bio-cta-row">
                <button
                  className="bio-booking"
                  type="button"
                  onClick={() => navigate("/contact")}
                >
                  Booking &amp; Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}