// src/pages/Shows/Shows.jsx
import { useNavigate } from "react-router-dom";
import "./Shows.css";

const SHOWS = [
  { date: "Tuesday, December 30, 2025", event: "Acoustic Duo", location: "AJ’s Main, Nashville, TN" },
  { date: "Monday, December 29, 2025", event: "Acoustic Solo", location: "Half & Chophouse, Nashville, TN" },
  { date: "Sunday, December 28, 2025", event: "Acoustic Solo", location: "The Joseph, Nashville, TN" },
  { date: "Saturday, December 27, 2025", event: "Acoustic Solo", location: "The Joseph, Nashville, TN" },
  { date: "Friday, December 26, 2025", event: "Acoustic Solo", location: "The Joseph, Nashville, TN" },
  { date: "Sunday, December 21, 2025", event: "Acoustic Duo", location: "AJ’s Main, Nashville, TN" },
  { date: "Saturday, December 20, 2025", event: "Acoustic Solo", location: "Half & Chophouse, Nashville, TN" },
  { date: "Friday, December 19, 2025", event: "Acoustic Duo", location: "AJ’s Main, Nashville, TN" },
];

export default function Shows() {
  const navigate = useNavigate();

  return (
    <main className="shows-page">
      <section className="shows-wrap">
        <header className="shows-head">
          <h1 className="shows-title">Shows</h1>
          <p className="shows-sub">Upcoming dates, tickets, and locations.</p>
        </header>

        <div className="shows-list">
          {SHOWS.map((show) => (
            <article
              key={`${show.date}-${show.location}`}
              className="show-card"
            >
              <div className="show-date">{show.date}</div>
              <div className="show-event">{show.event}</div>
              <div className="show-location">{show.location}</div>
            </article>
          ))}
        </div>

        <div className="shows-footer">
          <button
            className="shows-booking"
            type="button"
            onClick={() => navigate("/contact")}
          >
            Booking and Contact
          </button>
        </div>
      </section>
    </main>
  );
}