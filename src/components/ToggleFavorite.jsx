import { useContext } from "react";
import SessionContext from "../context/SessionContext";
import FavoritesContext from "../context/FavoritesContext";
import { FaTimes } from "react-icons/fa";

export default function ToggleFavorite({ game, compact = false }) {
  const { session } = useContext(SessionContext);
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  const isFavorite = favorites.some(f => f.game_id === game.id);

  const handleToggle = async () => {
    if (!session) {
      alert("Devi essere loggato per aggiungere un gioco ai preferiti!");
      return;
    }

    if (isFavorite) {
      await removeFavorite(game.id);
    } else {
      await addFavorite(game);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center transition ${
        compact
          ? "w-6 h-6 p-0 text-red-500 hover:text-red-400"
          : `px-4 py-2 rounded font-semibold ${
              isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-sky-600 hover:bg-sky-700"
            } text-white`
      }`}
      title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      {compact ? <FaTimes className="w-4 h-4" /> : isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    </button>
  );
}
