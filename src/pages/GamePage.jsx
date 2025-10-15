// src/pages/GamePage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import ToggleFavorite from "../components/ToggleFavorite";
import Chatbox from "../components/Chatbox";

export default function GamePage() {
  const { id } = useParams(); // game id dalla route
  const { session } = useContext(SessionContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch del gioco dal database o API RAWG
  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const apiKey = import.meta.env.VITE_RAWG_API_KEY;
        if (!apiKey) throw new Error("RAWG API key mancante. Controlla .env.local");

        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
        if (response.status === 404) {
          setGame(null);
          setErrorMsg("Gioco non trovato");
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setGame(data);
      } catch (err) {
        console.error("Errore fetch gioco:", err);
        setErrorMsg("Errore durante il caricamento del gioco");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <p className="text-center text-white mt-8">Caricamento gioco...</p>;
  if (errorMsg) return <p className="text-center text-white mt-8">{errorMsg}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-white">
      {/* Immagine gioco sopra la descrizione */}
      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full rounded-lg shadow-lg"
        />
      )}

      {/* Info gioco */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{game.name}</h1>
        <p>{game.description_raw || "Nessuna descrizione disponibile."}</p>

        {/* Toggle Favorite */}
        {session && <ToggleFavorite game={game} />}
      </div>

      {/* Realtime Chat */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
        <Chatbox gameId={game.id} />
      </div>
    </div>
  );
}
