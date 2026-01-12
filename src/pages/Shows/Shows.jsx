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
  return (
    <main className="shows-page">
      <section className="shows-wrap">
        <header className="shows-head">
          <h1 className="shows-title">Shows</h1>
          <p className="shows-sub">Upcoming dates, tickets, and locations.</p>
        </header>

        <div className="shows-table">
          <div className="shows-row shows-row--head">
            <div className="shows-cell">Date</div>
            <div className="shows-cell">Event</div>
            <div className="shows-cell">Location</div>
          </div>

          {SHOWS.map((s) => (
            <div key={`${s.date}-${s.location}`} className="shows-row">
              <div className="shows-cell shows-date">{s.date}</div>
              <div className="shows-cell">{s.event}</div>
              <div className="shows-cell">{s.location}</div>
            </div>
          ))}
        </div>

        <div className="shows-footer">
          <button className="shows-booking" type="button">
            Booking and Contact
          </button>
        </div>
      </section>
    </main>
  );
}