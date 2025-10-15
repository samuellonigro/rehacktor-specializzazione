import { Link } from "react-router-dom";

export default function Card({ game }) {
  return (
    <Link
      to={`/game/${game.id}`}
      className="relative bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform overflow-hidden block"
    >
      {/* Immagine */}
      <div className="relative">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-40 object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-2xl"></div>
      </div>

      {/* Contenuto */}
      <div className="p-4 text-white">
        <h2 className="text-lg font-bold truncate">{game.name}</h2>
        <p className="text-sm text-gray-300 mt-1">⭐ {game.rating}</p>
        <p className="text-sm text-gray-400">📅 {game.released}</p>
      </div>
    </Link>
  );
}
