import { useState, useEffect, useRef } from "react";
import supabase from "../supabase/supabase-client";
import dayjs from "dayjs";

export default function RealtimeChat({ gameId }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll automatico in basso
  const scrollSmoothToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Legge i messaggi iniziali
  const getInitialMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("game_id", gameId)
        .order("update_at", { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error("Errore fetch messaggi:", err.message);
    }
  };

  useEffect(() => {
    getInitialMessages();

    // Sottoscrizione realtime
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `game_id=eq.${gameId}` },
        () => getInitialMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      channel.unsubscribe();
    };
  }, [gameId]);

  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);

  return (
    <div className="max-h-64 overflow-y-auto p-2 bg-gray-900 rounded space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col">
          <span className="text-sm font-semibold text-sky-400">
            {msg.profile_username || "Anonimo"}
          </span>
          <span className="text-white">{msg.content}</span>
          <span className="text-xs text-gray-400">
            {dayjs(msg.update_at).format("HH:mm DD/MM")}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
