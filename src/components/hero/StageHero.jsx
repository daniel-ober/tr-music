import "./StageHero.css";
import mainImg from "../../assets/images/hero/tr-main.png";
import stageImg from "../../assets/images/hero/tr-stage.png";

export default function StageHero() {
  return (
    <section className="stage-hero">
      {/* Backdrop */}
      <div
        className="stage-backdrop"
        style={{ backgroundImage: `url(${stageImg})` }}
      />

      {/* Spotlight glow */}
      <div className="stage-spotlight" />

      {/* Foreground artist */}
      <img
        src={mainImg}
        alt="Tawnya Reynolds performing"
        className="stage-foreground"
      />

      {/* Text */}
      <div className="stage-text">
        <h1>Tawnya Reynolds</h1>
        <p>Songwriter · Nashville</p>
      </div>
    </section>
  );
}