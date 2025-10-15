import useFetch from "../hooks/UseFetch";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const { data, loading, error } = useFetch(
    "https://api.rawg.io/api/games?key=e7d8eb7a316044929c73b0817658a51e&page_size=12"
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-xl font-semibold text-white">
        Caricamento giochi...
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

  const games = data?.results || [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Giochi popolari da RAWG
      </h1>

      {/* Search bar che porta a /search */}
      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <Card key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
