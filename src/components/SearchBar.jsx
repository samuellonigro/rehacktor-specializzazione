import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const apiKey = import.meta.env.VITE_RAWG_API_KEY;
    const fetchGenres = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
        const data = await res.json();
        setGenres(data.results || []);
      } catch (err) {
        console.error("Errore fetching genres", err);
      }
    };
    fetchGenres();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: query.trim(), genre: selectedGenre });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3 mb-6">
      <input
        type="text"
        placeholder="Cerca un gioco..."
        className="w-full md:flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <select 
        value={selectedGenre} 
        onChange={(e) => setSelectedGenre(e.target.value)} 
        className="bg-gray-800 text-white rounded-xl px-3 py-2"
      >
        <option value="">Tutti i generi</option>
        {genres.map(g => <option key={g.id} value={g.slug}>{g.name}</option>)}
      </select>

      <button 
        type="submit" 
        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold"
      >
        Filtra
      </button>
    </form>
  );
}
