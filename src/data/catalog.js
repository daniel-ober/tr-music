// src/data/catalog.js
import coverStandingInTheRain from "../assets/albums/standing_in_the_rain.webp";
import cover8Track from "../assets/albums/8_track.webp";
import coverWateringDeadFlowers from "../assets/albums/watering_dead_flowers.webp";

export const ALBUMS = [
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

export function getAlbumByTitle(title) {
  const t = String(title || "").toLowerCase().trim();
  return ALBUMS.find((a) => String(a.title).toLowerCase().trim() === t) || null;
}

export function getTrackCover(albumTitle) {
  const album = getAlbumByTitle(albumTitle);
  return album?.cover || "";
}

export function flattenCatalog() {
  const out = [];
  for (const a of ALBUMS) {
    for (const t of a.tracks) {
      out.push({
        albumTitle: a.title,
        trackTitle: t,
        cover: a.cover,
      });
    }
  }
  return out;
}