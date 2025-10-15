// src/components/Header.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

export default function Header() {
  const { session } = useContext(SessionContext);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Errore durante il logout:", error.message);
      alert("Errore durante il logout!");
    }
  };

  return (
    <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-sky-400 hover:text-sky-300">
        Rehacktor
      </Link>

      <nav className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-200">
              Benvenuto, {session.user.user_metadata?.first_name || "Utente"}!
            </span>

            {/* 🔗 Link alla pagina profilo */}
            <Link
              to="/account"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
            >
              Profilo
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded text-white font-semibold"
            >
              Registrati
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

