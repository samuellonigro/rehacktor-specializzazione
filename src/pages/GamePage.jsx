import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import ToggleFavorite from "../components/ToggleFavorite";
import Chatbox from "../components/Chatbox";
import { FaGlobe, FaPlay } from "react-icons/fa";

export default function GamePage() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const apiKey = import.meta.env.VITE_RAWG_API_KEY;
        if (!apiKey) throw new Error("RAWG API key mancante");

        const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
        if (res.status === 404) {
          setErrorMsg("Gioco non trovato");
          setGame(null);
          return;
        }
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
        const data = await res.json();
        setGame(data);
      } catch (error) {
        console.error("Errore fetch gioco:", error);
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
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
      <div className="lg:col-span-2 space-y-4">
        {game.background_image && <img src={game.background_image} alt={game.name} className="w-full rounded-xl shadow-lg" />}
        <h1 className="text-4xl font-bold">{game.name}</h1>

        <div className="flex items-center gap-4 text-gray-300">
          <span className="px-3 py-1 bg-gray-800 rounded">{game.released}</span>
          <span className="px-3 py-1 bg-gray-800 rounded">⭐ {game.rating}</span>
          <span className="px-3 py-1 bg-gray-800 rounded">{game.metacritic ? `MC ${game.metacritic}` : ""}</span>
        </div>

        <div className="prose prose-invert max-w-none text-gray-200">
          <div dangerouslySetInnerHTML={{ __html: game.description }} />
        </div>

        {/* platforms and genres */}
        <div className="flex flex-wrap gap-2 mt-4">
          {game.parent_platforms?.map(p => (
            <div key={p.platform.id} className="px-3 py-1 bg-gray-800 rounded text-sm flex items-center gap-2">
              <img src={getPlatformIcon(p.platform.slug)} alt={p.platform.name} className="w-4 h-4" />
              <span>{p.platform.name}</span>
            </div>
          ))}
          {game.genres?.slice(0,5).map(g => (
            <div key={g.id} className="px-3 py-1 bg-gray-700 rounded text-sm">{g.name}</div>
          ))}
        </div>

        {/* links */}
        <div className="mt-6 flex gap-3">
          {game.website && <a href={game.website} target="_blank" rel="noreferrer" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded flex items-center gap-2"><FaGlobe/> Sito</a>}
          {game.clip?.clip && <a href={game.clip.clip} target="_blank" rel="noreferrer" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded flex items-center gap-2"><FaPlay/> Trailer</a>}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-lg font-semibold">Azioni</h4>
          <div className="mt-3 flex flex-col gap-3">
            {session && <ToggleFavorite game={game} />}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="text-lg font-semibold">Community</h4>
          <div className="mt-3">
            <Chatbox gameId={game.id} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function getPlatformIcon(slug) {
  const icons = {
    pc: "https://img.icons8.com/ios-filled/50/ffffff/windows-10.png",
    playstation: "https://img.icons8.com/ios-filled/50/ffffff/play-station.png",
    xbox: "https://img.icons8.com/ios-filled/50/ffffff/xbox.png",
    nintendo: "https://img.icons8.com/ios-filled/50/ffffff/nintendo-switch.png",
    mac: "https://img.icons8.com/ios-filled/50/ffffff/mac-os.png",
    linux: "https://img.icons8.com/ios-filled/50/ffffff/linux.png",
    android: "https://img.icons8.com/ios-filled/50/ffffff/android.png",
    ios: "https://img.icons8.com/ios-filled/50/ffffff/ios-logo.png",
  };
  return icons[slug] || "https://img.icons8.com/ios-filled/50/ffffff/controller.png";
}
