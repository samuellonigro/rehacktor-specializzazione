import { useState, useContext } from "react";
import supabase from "../supabase/supabase-client";
import RealtimeChat from "./RealtimeChat";
import SessionContext from "../context/SessionContext";

export default function Chatbox({ gameId }) {
  const { session } = useContext(SessionContext);
  const [message, setMessage] = useState("");

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await supabase.from("messages").insert([
        {
          content: message,
          game_id: gameId,
          profile_id: session?.user?.id,
          profile_username: session?.user?.user_metadata?.full_name || session?.user?.email,
        },
      ]);
      setMessage(""); // pulisce input
    } catch (err) {
      console.error("Errore invio messaggio:", err.message);
    }
  };

  return (
    <>
      <h4 className="text-lg font-bold mb-2">Gamers chat</h4>
      <RealtimeChat gameId={gameId} />
      {session && (
        <form onSubmit={handleMessageSubmit} className="mt-2">
          <fieldset role="group" className="flex gap-2">
            <input
              type="text"
              name="message"
              placeholder="Scrivi un messaggio..."
              className="flex-1 p-2 rounded text-black"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">
              Invia
            </button>
          </fieldset>
        </form>
      )}
    </>
  );
}
