import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">Tawnya Reynolds</div>

        <ul className="navbar-links">
          <li>Home</li>
          <li>Bio</li>
          <li>Music</li>
          <li>Shows</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  );
}