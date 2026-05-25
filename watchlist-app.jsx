import { useState, useEffect, useRef, useCallback } from "react";

const TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const IMG = "https://image.tmdb.org/t/p/";
const STORAGE_KEY = "cinelist_watchlist_v1";

const STATUS_CONFIG = {
  watching:   { label: "Watching",     color: "#378ADD", bg: "#E6F1FB" },
  completed:  { label: "Completed",    color: "#1D9E75", bg: "#E1F5EE" },
  planned:    { label: "Plan to Watch",color: "#BA7517", bg: "#FAEEDA" },
  dropped:    { label: "Dropped",      color: "#D85A30", bg: "#FAECE7" },
};

const GENRE_CONFIG = {
  "Adventure & Fantasy": { color: "#7F77DD", bg: "#EEEDFE", tag: "#534AB7" },
  "Drama & Romance":     { color: "#D4537E", bg: "#FBEAF0", tag: "#993556" },
  "Crime & Thriller":    { color: "#D85A30", bg: "#FAECE7", tag: "#993C1D" },
  "Science Fiction":     { color: "#378ADD", bg: "#E6F1FB", tag: "#185FA5" },
  "War & Historical":    { color: "#BA7517", bg: "#FAEEDA", tag: "#854F0B" },
  "Action":              { color: "#D85A30", bg: "#FAECE7", tag: "#993C1D" },
  "Horror":              { color: "#791F1F", bg: "#FCEBEB", tag: "#501313" },
  "Comedy":              { color: "#BA7517", bg: "#FAEEDA", tag: "#854F0B" },
  "Animation":           { color: "#7F77DD", bg: "#EEEDFE", tag: "#534AB7" },
  "Documentary":         { color: "#1D9E75", bg: "#E1F5EE", tag: "#0F6E56" },
  "Other":               { color: "#888780", bg: "#F1EFE8", tag: "#5F5E5A" },
};

const SEED_FILMS = [
  { id: 916224,  type: "movie", title: "Suzume",                                       year: 2022, genre: "Adventure & Fantasy", director: "Makoto Shinkai",        status: "completed", plot: "17-year-old Suzume teams up with a mysterious Closer to seal supernatural doors across Japan, preventing devastating earthquakes." },
  { id: 597208,  type: "movie", title: "Ride Your Wave",                               year: 2019, genre: "Adventure & Fantasy", director: "Masaaki Yuasa",          status: "completed", plot: "College student Hinako and firefighter Minato share a deep bond severed by drowning. Minato begins appearing in water whenever Hinako sings their song." },
  { id: 259694,  type: "movie", title: "Miss Peregrine's Home for Peculiar Children",  year: 2016, genre: "Adventure & Fantasy", director: "Tim Burton",             status: "completed", plot: "Teenager Jake discovers a Welsh island orphanage for children with supernatural gifts and must help them defend against monstrous creatures." },
  { id: 716452,  type: "movie", title: "A Whisker Away",                               year: 2020, genre: "Adventure & Fantasy", director: "Junichi Sato",           status: "completed", plot: "Middle schooler Miyo uses a magical cat mask to get close to her crush, but risks losing her human identity forever." },
  { id: 762468,  type: "movie", title: "Josee, the Tiger and the Fish",                year: 2020, genre: "Drama & Romance",     director: "Kotaro Tamura",          status: "completed", plot: "Marine biology student Tsuneo and reclusive artist Josee form an unlikely connection that transforms both their lives." },
  { id: 116745,  type: "movie", title: "The Secret Life of Walter Mitty",              year: 2013, genre: "Drama & Romance",     director: "Ben Stiller",            status: "completed", plot: "A timid photo editor embarks on a real globe-trotting adventure from Greenland to the Himalayas to track down a missing negative." },
  { id: 246402,  type: "tv",    title: "Love Through a Prism",                         year: 2026, genre: "Drama & Romance",     director: "Kazuto Nakazawa",        status: "watching",  plot: "In 1900s London, a Japanese art student's rivalry with a gifted aristocrat at a prestigious academy slowly blossoms into romance." },
  { id: 83551,   type: "movie", title: "End of Watch",                                 year: 2012, genre: "Crime & Thriller",    director: "David Ayer",             status: "completed", plot: "A found-footage portrait of two LAPD officers whose brotherhood is tested when routine policing escalates into cartel conflict." },
  { id: 567748,  type: "movie", title: "The Guilty",                                   year: 2021, genre: "Crime & Thriller",    director: "Antoine Fuqua",          status: "completed", plot: "A demoted 911 dispatcher tries to save a kidnapping victim over the phone, only to discover nothing is as it seems." },
  { id: 336268,  type: "movie", title: "Nocturnal Animals",                            year: 2016, genre: "Crime & Thriller",    director: "Tom Ford",               status: "completed", plot: "An art gallery owner reads her ex-husband's brutal novel and sees their own fractured past mirrored in its violent narrative." },
  { id: 670,     type: "movie", title: "Memories of Murder",                           year: 2003, genre: "Crime & Thriller",    director: "Bong Joon-ho",           status: "completed", plot: "Two detectives investigate South Korea's first confirmed serial murder case with clashing methods that grow increasingly desperate." },
  { id: 37936,   type: "movie", title: "Source Code",                                  year: 2011, genre: "Science Fiction",     director: "Duncan Jones",           status: "completed", plot: "A soldier is repeatedly sent into the final 8 minutes of a bombing victim's life to identify a terrorist before they strike again." },
  { id: 17654,   type: "movie", title: "District 9",                                   year: 2009, genre: "Science Fiction",     director: "Neill Blomkamp",         status: "completed", plot: "A bureaucrat exposed to alien DNA must survive being hunted by the corporation he once served in apartheid-allegory Johannesburg." },
  { id: 4977,    type: "movie", title: "Paprika",                                      year: 2006, genre: "Science Fiction",     director: "Satoshi Kon",            status: "completed", plot: "A dream therapist uses an illegal device to enter patients' dreams, but must stop a thief from letting dreams consume reality." },
  { id: 12477,   type: "movie", title: "Grave of the Fireflies",                       year: 1988, genre: "War & Historical",    director: "Isao Takahata",          status: "completed", plot: "Orphaned siblings Seita and Setsuko struggle to survive in WWII-era Kobe — one of the most devastating war films ever made." },
  { id: 11488,   type: "movie", title: "Ran",                                          year: 1985, genre: "War & Historical",    director: "Akira Kurosawa",         status: "completed", plot: "Kurosawa's King Lear adaptation: an aging warlord divides his kingdom among his sons and is destroyed by the chaos that follows." },
  { id: 9737,    type: "movie", title: "Jarhead",                                      year: 2005, genre: "War & Historical",    director: "Sam Mendes",             status: "completed", plot: "A Marine sniper in the Gulf War is psychologically undone not by combat, but by the endless maddening wait for it." },
  { id: 581726,  type: "movie", title: "The Hunt",                                     year: 2020, genre: "War & Historical",    director: "Craig Zobel",            status: "completed", plot: "Twelve strangers hunted for sport by wealthy elites — until one of the hunted, Crystal, begins turning the tables." },
];

function useStorage(key, seed) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return seed;
  });
  const save = useCallback((val) => {
    setData(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }, [key]);
  return [data, save];
}

function useStorageFallback(key, seed) {
  const memRef = useRef(null);
  const [data, setData] = useState(() => {
    try {
      const raw = window.storage && null;
      return seed;
    } catch(e) { return seed; }
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(key);
        if (result) { setData(JSON.parse(result.value)); }
      } catch(e) {}
    })();
  }, [key]);

  const save = useCallback(async (val) => {
    setData(val);
    try { await window.storage.set(key, JSON.stringify(val)); } catch(e) {}
  }, [key]);

  return [data, save];
}

function PosterImg({ tmdbId, type, fallbackEmoji, fallbackBg, fallbackColor, size = "w342", className = "", style = {} }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const endpoint = type === "tv"
      ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}`
      : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}`;
    fetch(endpoint).then(r => r.json()).then(d => {
      if (!cancelled && d.poster_path) setSrc(IMG + size + d.poster_path);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [tmdbId, type, size]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: fallbackBg, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      {!loaded && <span style={{ fontSize: 32, color: fallbackColor }}>{fallbackEmoji}</span>}
      {src && (
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s", borderRadius: "inherit" }}
        />
      )}
    </div>
  );
}

function BackdropImg({ tmdbId, type, fallbackEmoji, fallbackBg }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const endpoint = type === "tv"
      ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}`
      : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}`;
    fetch(endpoint).then(r => r.json()).then(d => {
      if (!cancelled && d.backdrop_path) setSrc(IMG + "w780" + d.backdrop_path);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [tmdbId, type]);
  return (
    <div style={{ width: "100%", height: "100%", background: fallbackBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {!loaded && <span style={{ fontSize: 56, opacity: 0.5 }}>{fallbackEmoji}</span>}
      {src && <img src={src} alt="" onLoad={() => setLoaded(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }} />}
    </div>
  );
}

function SearchModal({ onAdd, existingIds, onClose }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Other");
  const [selectedStatus, setSelectedStatus] = useState("planned");
  const [adding, setAdding] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [movRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&page=1`).then(r => r.json()),
          fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&page=1`).then(r => r.json()),
        ]);
        const movies = (movRes.results || []).slice(0, 5).map(m => ({ ...m, media_type: "movie", display_title: m.title, display_year: m.release_date?.slice(0,4) }));
        const shows  = (tvRes.results  || []).slice(0, 3).map(m => ({ ...m, media_type: "tv",    display_title: m.name,  display_year: m.first_air_date?.slice(0,4) }));
        setResults([...movies, ...shows]);
      } catch(e) { setResults([]); }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [q]);

  async function handleAdd(item) {
    setAdding(item.id);
    const director = await fetchDirector(item.id, item.media_type);
    const film = {
      id: item.id,
      type: item.media_type,
      title: item.display_title,
      year: parseInt(item.display_year) || null,
      genre: selectedGenre,
      director: director || "Unknown",
      status: selectedStatus,
      plot: item.overview || "",
    };
    onAdd(film);
    setAdding(null);
    setQ("");
    setResults([]);
  }

  async function fetchDirector(id, type) {
    try {
      if (type === "movie") {
        const d = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_KEY}`).then(r => r.json());
        const dir = d.crew?.find(c => c.job === "Director");
        return dir?.name || null;
      } else {
        const d = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${TMDB_KEY}`).then(r => r.json());
        return d.crew?.[0]?.name || null;
      }
    } catch(e) { return null; }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8vh" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
      <div style={{ position: "relative", width: "min(560px, 92vw)", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.25rem 1.5rem 1rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <i className="ti ti-search" style={{ fontSize: 18, color: "var(--color-text-secondary)" }} aria-hidden="true" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search movies & series…"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", color: "var(--color-text-primary)" }}
            />
            {loading && <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>searching…</span>}
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 18, padding: 0 }}><i className="ti ti-x" /></button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              {Object.keys(GENRE_CONFIG).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {results.length === 0 && q.trim() && !loading && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>No results found</div>
          )}
          {results.length === 0 && !q.trim() && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>
              <i className="ti ti-movie" style={{ fontSize: 32, display: "block", marginBottom: 8, opacity: 0.4 }} />
              Search for any film or series to add it
            </div>
          )}
          {results.map(item => {
            const already = existingIds.has(item.id);
            return (
              <div key={item.id + item.media_type} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 1.5rem", borderBottom: "0.5px solid var(--color-border-tertiary)", opacity: already ? 0.5 : 1 }}>
                <div style={{ width: 42, height: 60, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "var(--color-background-secondary)" }}>
                  {item.poster_path
                    ? <img src={IMG + "w92" + item.poster_path} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.display_title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                    {item.display_year} · <span style={{ textTransform: "uppercase", fontSize: 10, letterSpacing: "0.05em" }}>{item.media_type}</span>
                  </div>
                  {item.overview && <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.overview}</div>}
                </div>
                <button
                  onClick={() => !already && handleAdd(item)}
                  disabled={already || adding === item.id}
                  style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: already ? "var(--color-background-secondary)" : "#2b2d42", color: already ? "var(--color-text-secondary)" : "#fff", fontSize: 12, cursor: already ? "default" : "pointer", fontWeight: 500 }}
                >
                  {already ? "Added" : adding === item.id ? "…" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailModal({ film, onClose, onRemove, onStatusChange }) {
  const g = GENRE_CONFIG[film.genre] || GENRE_CONFIG["Other"];
  const s = STATUS_CONFIG[film.status] || STATUS_CONFIG["planned"];
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
      <div style={{ position: "relative", width: "min(580px, 92vw)", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", maxHeight: "85vh", overflowY: "auto" }}>
        {/* Hero */}
        <div style={{ height: 190, position: "relative", overflow: "hidden" }}>
          <BackdropImg tmdbId={film.id} type={film.type} fallbackEmoji="🎬" fallbackBg={g.bg} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--color-background-primary) 0%, transparent 60%)" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            <i className="ti ti-x" />
          </button>
          {/* Poster thumb */}
          <div style={{ position: "absolute", bottom: -24, left: "1.5rem", width: 80, height: 120, borderRadius: 8, overflow: "hidden", border: "2px solid var(--color-background-primary)" }}>
            <PosterImg tmdbId={film.id} type={film.type} fallbackEmoji="🎬" fallbackBg={g.bg} fallbackColor={g.color} />
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: "2.5rem 1.5rem 1.5rem" }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{film.title}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1rem" }}>{film.director} · {film.year}</div>
          {/* Tags + status */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: g.bg, color: g.tag }}>{film.genre}</span>
            <select
              value={film.status}
              onChange={e => onStatusChange(film.id, e.target.value)}
              style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${s.color}`, background: s.bg, color: s.color, cursor: "pointer", fontWeight: 500 }}
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {film.plot && <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: "1.5rem" }}>{film.plot}</p>}
          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1rem" }}>
            {!confirmDelete
              ? <button onClick={() => setConfirmDelete(true)} style={{ padding: "7px 16px", borderRadius: 20, border: "0.5px solid var(--color-border-danger)", background: "transparent", color: "var(--color-text-danger)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="ti ti-trash" style={{ fontSize: 14 }} /> Remove from list
                </button>
              : <>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)", alignSelf: "center" }}>Remove this title?</span>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: "7px 16px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => { onRemove(film.id); onClose(); }} style={{ padding: "7px 16px", borderRadius: 20, border: "none", background: "#D85A30", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Yes, remove</button>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function FilmCard({ film, onClick }) {
  const g = GENRE_CONFIG[film.genre] || GENRE_CONFIG["Other"];
  const s = STATUS_CONFIG[film.status] || STATUS_CONFIG["planned"];
  return (
    <div onClick={onClick} style={{ borderRadius: "var(--border-radius-md)", overflow: "hidden", cursor: "pointer", transition: "transform 0.15s", position: "relative" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}
    >
      <div style={{ width: "100%", aspectRatio: "2/3", position: "relative", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
        <PosterImg tmdbId={film.id} type={film.type} fallbackEmoji="🎬" fallbackBg={g.bg} fallbackColor={g.color} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)" }} />
        <span style={{ position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 20, background: g.tag, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {film.genre.split(" & ")[0]}
        </span>
        <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 20, background: s.color + "22", color: s.color, border: `1px solid ${s.color}44` }}>
          {s.label}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 8, zIndex: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{film.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{film.year || "—"}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [films, setFilms] = useStorageFallback(STORAGE_KEY, SEED_FILMS);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeGenreFilter, setActiveGenreFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [showSearch, setShowSearch] = useState(false);
  const [detail, setDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const existingIds = new Set(films.map(f => f.id));

  const handleAdd = (film) => {
    setFilms([...films, film]);
  };

  const handleRemove = (id) => {
    setFilms(films.filter(f => f.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setFilms(films.map(f => f.id === id ? { ...f, status: newStatus } : f));
    if (detail?.id === id) setDetail(prev => ({ ...prev, status: newStatus }));
  };

  const counts = {
    all: films.length,
    watching: films.filter(f => f.status === "watching").length,
    completed: films.filter(f => f.status === "completed").length,
    planned: films.filter(f => f.status === "planned").length,
    dropped: films.filter(f => f.status === "dropped").length,
  };

  let filtered = [...films];
  if (activeStatus !== "all") filtered = filtered.filter(f => f.status === activeStatus);
  if (activeGenreFilter !== "all") filtered = filtered.filter(f => f.genre === activeGenreFilter);
  if (searchQuery.trim()) filtered = filtered.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));
  if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "year") filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  if (sort === "status") filtered.sort((a, b) => a.status.localeCompare(b.status));

  const allGenres = [...new Set(films.map(f => f.genre))].sort();

  return (
    <div style={{ fontFamily: "var(--font-sans)", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      {/* Header */}
      <div style={{ background: "#1a1b2e", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
            <span style={{ fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>🎬 CineList</span>
          </div>
          {/* Inline search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", border: "0.5px solid rgba(255,255,255,0.1)" }}>
            <i className="ti ti-search" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter list…" style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#fff", width: 140 }} />
          </div>
          <button
            onClick={() => setShowSearch(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: "#7F77DD", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500, flexShrink: 0 }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} /> Add title
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        {/* Status tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", flexWrap: "wrap", borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: "1rem" }}>
          {[["all", "All"], ["watching", "Watching"], ["completed", "Completed"], ["planned", "Plan to Watch"], ["dropped", "Dropped"]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveStatus(key)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", background: activeStatus === key ? "#2b2d42" : "transparent", color: activeStatus === key ? "#fff" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontWeight: activeStatus === key ? 500 : 400, display: "flex", alignItems: "center", gap: 6 }}>
              {label}
              <span style={{ fontSize: 11, background: activeStatus === key ? "rgba(255,255,255,0.2)" : "var(--color-background-secondary)", padding: "1px 7px", borderRadius: 20, color: activeStatus === key ? "#fff" : "var(--color-text-secondary)" }}>{counts[key]}</span>
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <select value={activeGenreFilter} onChange={e => setActiveGenreFilter(e.target.value)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              <option value="all">All genres</option>
              {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              <option value="default">Sort: Default</option>
              <option value="title">Sort: A–Z</option>
              <option value="year">Sort: Year</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} onClick={() => setActiveStatus(key)} style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", cursor: "pointer", border: activeStatus === key ? `1.5px solid ${cfg.color}` : "0.5px solid var(--color-border-tertiary)", transition: "border 0.15s" }}>
              <div style={{ fontSize: 22, fontWeight: 500, color: cfg.color }}>{counts[key]}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{cfg.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-text-secondary)" }}>
            <i className="ti ti-movie-off" style={{ fontSize: 40, display: "block", marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 15, marginBottom: 8 }}>{searchQuery ? "No titles match your search" : "Nothing here yet"}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Use the <strong>+ Add title</strong> button to search and add any film or series</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
            {filtered.map(film => (
              <FilmCard key={film.id} film={film} onClick={() => setDetail(film)} />
            ))}
          </div>
        )}
      </div>

      {showSearch && (
        <SearchModal
          onAdd={handleAdd}
          existingIds={existingIds}
          onClose={() => setShowSearch(false)}
        />
      )}

      {detail && (
        <DetailModal
          film={detail}
          onClose={() => setDetail(null)}
          onRemove={handleRemove}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}