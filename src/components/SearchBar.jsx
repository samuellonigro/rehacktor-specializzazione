// src/components/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 mb-8 justify-center"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca un gioco..."
        className="w-full sm:w-80 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition"
      >
        Cerca
      </button>
    </form>
  );
}
