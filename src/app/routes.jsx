import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Bio from "../pages/Bio/Bio";
import Music from "../pages/Music/Music";
import Shows from "../pages/Shows/Shows";
import Contact from "../pages/Contact/Contact";

export default function RoutesConfig({ location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/bio" element={<Bio />} />
      <Route path="/music" element={<Music />} />
      <Route path="/shows" element={<Shows />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}