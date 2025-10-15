import { useState, useEffect, useContext, useCallback } from "react";
import supabase from "../supabase/supabase-client";
import Avatar from "../components/Avatar";
import SessionContext from "../context/SessionContext";
import FavoritesContext from "../context/FavoritesContext";
import ToggleFavorite from "../components/ToggleFavorite";

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const { favorites } = useContext(FavoritesContext);

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch del profilo dalla tabella "profiles"
  const fetchProfile = useCallback(async () => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      setUserData(data);
    } catch (error) {
      alert("Errore caricamento profilo: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
        })
        .eq("id", session.user.id);
      if (error) throw error;
      alert("Profilo aggiornato con successo!");
    } catch (error) {
      alert("Errore aggiornamento: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (fileName) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: fileName })
        .eq("id", session.user.id);
      if (error) throw error;
      setUserData((prev) => ({ ...prev, avatar_url: fileName }));
    } catch (error) {
      alert("Errore caricamento avatar: " + error.message);
    }
  };

  if (!session)
    return (
      <p className="text-center text-white mt-8">
        Accedi per modificare il profilo.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg text-white space-y-6">
      <h1 className="text-2xl font-bold text-center">Il tuo profilo</h1>

      <Avatar url={userData.avatar_url} size={120} onUpload={handleAvatarUpload} />

      {/* Form profilo */}
      <div className="space-y-4">
        <div>
          <label>Nome</label>
          <input
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900"
          />
        </div>
        <div>
          <label>Cognome</label>
          <input
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900"
          />
        </div>
        <div>
          <label>Username</label>
          <input
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900"
          />
        </div>
        <div>
          <label>Email (non modificabile)</label>
          <input
            name="email"
            value={userData.email}
            disabled
            className="w-full p-2 rounded bg-gray-700 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-2 bg-sky-600 hover:bg-sky-700 rounded font-semibold"
      >
        {loading ? "Salvando..." : "Salva modifiche"}
      </button>

      {/* Lista dei giochi favoriti */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">I tuoi giochi preferiti</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-400">Nessun gioco aggiunto ai preferiti 😢</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center bg-gray-900 p-2 rounded justify-between"
              >
                <div className="flex items-center space-x-2">
                  {fav.game_image && (
                    <img
                      src={fav.game_image}
                      alt={fav.game_name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <span>{fav.game_name}</span>
                </div>
                {/* Bottone per rimuovere dai favoriti */}
                <ToggleFavorite game={{ id: fav.game_id, name: fav.game_name, background_image: fav.game_image }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
