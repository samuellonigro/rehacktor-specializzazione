import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({ query: "", genre: "", platform: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const fetchGames = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const q = filters.query ? `&search=${encodeURIComponent(filters.query)}` : "";
      const g = filters.genre ? `&genres=${filters.genre}` : "";
      const p = filters.platform ? `&platforms=${filters.platform}` : "";

      const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=12${q}${g}${p}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (reset) setGames(data.results || []);
      else setGames(prev => [...prev, ...(data.results || [])]);
    } catch (err) {
      console.error("fetchGames error", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, filters, page]);

  useEffect(() => {
    setPage(1);
    fetchGames(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (page > 1) fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white text-center mb-6">🎮 Scopri nuovi giochi</h1>

      <SearchBar onSearch={(vals) => setFilters(vals)} />

      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map(g => <Card key={g.id} game={g} />)}
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={() => setPage(p => p + 1)} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-semibold">
          Carica altri giochi
        </button>
      </div>

      {loading && <p className="text-center mt-4 text-gray-400">Caricamento...</p>}
    </div>
  );
}
