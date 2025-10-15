import { Link, NavLink } from "react-router-dom";
import { FaUserCircle, FaSearch, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useState, useContext } from "react";
import SessionContext from "../context/SessionContext";


export default function Header() {
  const { session, setSession } = useContext(SessionContext);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout"); // o supabase.auth.signOut()
      setSession(null);
    } catch (err) {
      console.error("Errore logout:", err);
    }
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
    }`;

  const buttonClass = "flex items-center gap-1 px-3 py-1 rounded text-white text-sm font-semibold hover:opacity-90 transition";

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-400 rounded-full p-2 shadow-sm">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Rehacktor</h1>
            <span className="text-xs text-gray-400">Games · Reviews · Chat</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/search" className={linkClass}>Cerca</NavLink>
          {session && <NavLink to="/account" className={linkClass}>Profilo</NavLink>}
        </nav>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          <Link to="/search" className="hidden md:flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-gray-200 text-sm hover:bg-gray-700">
            <FaSearch />
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <Link to="/account">
                {session.user.user_metadata?.avatar_url ? (
                  <img
                    src={`https://YOUR_SUPABASE_URL/storage/v1/object/public/avatars/${session.user.user_metadata.avatar_url}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-400" />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className={`${buttonClass} bg-red-600 hover:bg-red-700`}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/register" className={`${buttonClass} bg-violet-600 hover:bg-violet-700`}>Registrati</Link>
              <Link to="/login" className={`${buttonClass} bg-sky-600 hover:bg-sky-700`}>Login</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button className="md:hidden p-2 text-gray-300" onClick={() => setOpen(!open)}>
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-800 text-gray-200">Home</Link>
            <Link to="/search" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-800 text-gray-200">Cerca</Link>
            {session && <Link to="/account" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-800 text-gray-200">Profilo</Link>}
            {!session && <>
              <Link to="/register" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-800 text-gray-200">Registrati</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-800 text-gray-200">Login</Link>
            </>}
          </div>
        </motion.div>
      )}
    </header>
  );
}
