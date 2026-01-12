// src/components/player/playerStore.js
// Tiny global store (no deps). Music page can call setQueue/play.
// GlobalPlayer subscribes to updates.

const listeners = new Set();

let state = {
  expanded: false,

  // playback
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  // selection
  currentTrack: null, // { id, title, albumTitle, cover, audioSrc? }
  albumTitle: null,

  // shuffle
  shuffleMode: "off", // "off" | "album" | "all"
  queue: [], // array of track objects
  order: [], // array of track ids (play order)
  index: -1, // current index into order
  recent: [], // track ids recently played (for avoiding repeats)
};

function emit() {
  for (const fn of listeners) fn(state);
}

export function getPlayerState() {
  return state;
}

export function subscribePlayer(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

export function setExpanded(expanded) {
  state = { ...state, expanded: !!expanded };
  emit();
}

export function cycleShuffleMode() {
  const next =
    state.shuffleMode === "off"
      ? "album"
      : state.shuffleMode === "album"
      ? "all"
      : "off";

  state = { ...state, shuffleMode: next };
  // rebuild order if we have a queue
  if (state.queue.length) {
    rebuildOrder();
  }
  emit();
}

export function setQueue({ queue, currentTrackId, albumTitle }) {
  const q = Array.isArray(queue) ? queue : [];
  const idx = Math.max(
    0,
    q.findIndex((t) => t.id === currentTrackId)
  );

  state = {
    ...state,
    queue: q,
    albumTitle: albumTitle ?? null,
    currentTrack: q[idx] ?? null,
    index: idx,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    recent: state.recent ?? [],
  };

  rebuildOrder();
  emit();
}

export function playTrackById(trackId) {
  const idx = state.queue.findIndex((t) => t.id === trackId);
  if (idx === -1) return;

  state = {
    ...state,
    currentTrack: state.queue[idx],
    index: idx,
    currentTime: 0,
    duration: 0,
    isPlaying: true,
  };

  // keep a recent list (avoid repeats)
  bumpRecent(trackId);

  // if shuffle mode uses order, align index to order
  if (state.shuffleMode !== "off") {
    const oi = state.order.indexOf(trackId);
    state = { ...state, index: oi >= 0 ? oi : state.index };
  }

  emit();
}

export function setPlaying(isPlaying) {
  state = { ...state, isPlaying: !!isPlaying };
  emit();
}

export function setTime({ currentTime, duration }) {
  state = {
    ...state,
    currentTime: Number.isFinite(currentTime) ? currentTime : 0,
    duration: Number.isFinite(duration) ? duration : 0,
  };
  emit();
}

export function seekTo(seconds) {
  // GlobalPlayer will handle the actual audio element seek,
  // but we update state for immediate UI response.
  const s = Math.max(0, Number(seconds) || 0);
  state = { ...state, currentTime: s };
  emit();
}

export function nextTrack() {
  if (!state.queue.length) return;

  if (state.shuffleMode === "off") {
    const nextIdx = Math.min(state.queue.length - 1, state.index + 1);
    const next = state.queue[nextIdx];
    if (!next) return;
    state = {
      ...state,
      currentTrack: next,
      index: nextIdx,
      currentTime: 0,
      duration: 0,
      isPlaying: true,
    };
    bumpRecent(next.id);
    emit();
    return;
  }

  // shuffle modes: use order
  const nextIndex = state.index + 1;

  if (nextIndex < state.order.length) {
    const nextId = state.order[nextIndex];
    const next = state.queue.find((t) => t.id === nextId);
    if (!next) return;
    state = {
      ...state,
      currentTrack: next,
      index: nextIndex,
      currentTime: 0,
      duration: 0,
      isPlaying: true,
    };
    bumpRecent(next.id);
    emit();
    return;
  }

  // reached end: rebuild with "avoid recent" and continue
  rebuildOrder(true);
  // after rebuild, pick first track that's not current
  const firstId = state.order[0];
  const first = state.queue.find((t) => t.id === firstId);
  if (!first) return;

  state = {
    ...state,
    currentTrack: first,
    index: 0,
    currentTime: 0,
    duration: 0,
    isPlaying: true,
  };
  bumpRecent(first.id);
  emit();
}

export function prevTrack() {
  if (!state.queue.length) return;

  if (state.shuffleMode === "off") {
    const prevIdx = Math.max(0, state.index - 1);
    const prev = state.queue[prevIdx];
    if (!prev) return;
    state = {
      ...state,
      currentTrack: prev,
      index: prevIdx,
      currentTime: 0,
      duration: 0,
      isPlaying: true,
    };
    bumpRecent(prev.id);
    emit();
    return;
  }

  const prevIndex = Math.max(0, state.index - 1);
  const prevId = state.order[prevIndex];
  const prev = state.queue.find((t) => t.id === prevId);
  if (!prev) return;

  state = {
    ...state,
    currentTrack: prev,
    index: prevIndex,
    currentTime: 0,
    duration: 0,
    isPlaying: true,
  };
  bumpRecent(prev.id);
  emit();
}

function bumpRecent(trackId) {
  const poolSize = state.queue.length || 1;
  const maxRecent = Math.max(1, poolSize - 1);

  const next = [trackId, ...state.recent.filter((id) => id !== trackId)].slice(
    0,
    maxRecent
  );

  state = { ...state, recent: next };
}

function rebuildOrder(reshuffle = false) {
  // Determine pool:
  // - album: use current queue as-is (Music page passes the album tracks)
  // - all: Music page should pass all tracks in queue, not just album
  const pool = state.queue;

  if (!pool.length) {
    state = { ...state, order: [], index: -1 };
    return;
  }

  if (state.shuffleMode === "off") {
    state = { ...state, order: pool.map((t) => t.id) };
    // index refers to queue index for off
    return;
  }

  // shuffle: build randomized order, avoiding recently played
  const recentSet = new Set(state.recent || []);
  const ids = pool.map((t) => t.id);

  // if reshuffle, clear "recent" pressure a bit (but keep the latest)
  const avoid = new Set(recentSet);

  const available = ids.filter((id) => !avoid.has(id));
  const fallback = ids.slice();

  const shuffled = shuffleArray(available.length ? available : fallback);

  // If current track exists, put it at the start of the order
  // so "Play" continues from current selection naturally.
  const currentId = state.currentTrack?.id;
  let order = shuffled;

  if (currentId && order.includes(currentId)) {
    order = [currentId, ...order.filter((id) => id !== currentId)];
  } else if (currentId) {
    order = [currentId, ...order];
  }

  const newIndex = 0; // current track at index 0

  state = { ...state, order, index: newIndex };

  if (reshuffle) {
    // keep only the most recent item to prevent endless avoidance
    if (state.currentTrack?.id) {
      state = { ...state, recent: [state.currentTrack.id] };
    }
  }
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}