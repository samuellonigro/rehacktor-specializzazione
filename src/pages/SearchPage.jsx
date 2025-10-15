import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/UseFetch";
import Card from "../components/Card";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const genre = searchParams.get("genre"); // filtro per genere

  const apiKey = import.meta.env.VITE_RAWG_API_KEY || "9269195f491e44539d7a2d10ce87ab15";

  // Costruzione URL API solo con query e genere
  let url = query
    ? `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`
    : null;

  if (genre) {
    url += `&genres=${encodeURIComponent(genre)}`;
  }

  const { data, loading, error } = useFetch(url);
  const results = data?.results || [];

  if (!query) {
    return (
      <div className="p-6 text-center text-gray-400">
        Inserisci un termine di ricerca per trovare un gioco.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-xl font-semibold text-white">
        Caricamento risultati per "<span className="text-sky-400">{query}</span>"...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-xl text-red-500">
        Errore: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Risultati per: <span className="text-sky-400">{query}</span>
      </h1>

      {results.length === 0 ? (
        <p className="text-center text-gray-400">Nessun gioco trovato 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((game) => (
            <Card key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
