import { useState, useEffect, useCallback, useContext } from "react";
import FavoritesContext from "./FavoritesContext";
import supabase from "../supabase/supabase-client";
import SessionContext from "./SessionContext";

export default function FavoritesProvider({ children }) {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);

  // Funzione per recuperare i favoriti dal DB
  const getFavorites = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", session.user.id);

    if (!error) setFavorites(data);
    else console.log("Errore fetching favorites:", error);
  }, [session]);

  // Aggiungi gioco ai favoriti
  const addFavorite = async (game) => {
    if (!session) return;
    const { error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: session.user.id,
          game_id: game.id,
          game_name: game.name,
          game_image: game.background_image,
        },
      ])
      .select();

    if (!error) await getFavorites();
  };

  // Rimuovi gioco dai favoriti
  const removeFavorite = async (gameId) => {
    if (!session) return;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("game_id", gameId);

    if (!error) await getFavorites();
  };

  // Effetto per caricare i favoriti e ascoltare i cambiamenti realtime
  useEffect(() => {
    if (!session) return;

    getFavorites();

    const channel = supabase
      .channel("favorites")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favorites" },
        () => getFavorites()
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
      channel.unsubscribe();
    };
  }, [getFavorites, session]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
