import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function Card({ game }) {
  return (
    <Link
      to={`/game/${game.id}`}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-200 flex flex-col"
    >
      <div className="relative">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-44 object-cover"
        />
        <div className="absolute left-3 top-3 bg-black/50 px-2 py-1 rounded text-sm text-white flex items-center gap-1">
          <FaStar className="text-yellow-400" /> <span>{game.rating ?? "-"}</span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="text-white font-semibold truncate">{game.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {game.parent_platforms?.slice(0, 4).map((p) => (
              <img
                key={p.platform.id}
                src={getPlatformIcon(p.platform.slug)}
                alt={p.platform.name}
                className="w-5 h-5 opacity-90"
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">{game.released ?? ""}</span>
        </div>
      </div>
    </Link>
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

