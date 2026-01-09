// src/pages/Home/Home.jsx
import Navbar from "../../components/layout/Navbar";
import StageHero from "../../components/hero/StageHero";
import "./Home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <StageHero />
    </>
  );
}