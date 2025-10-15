import { useState, useEffect } from "react";
import SessionContext from "./SessionContext";
import supabase from "../supabase/supabase-client";

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

useEffect(() => {
  // Recuperiamo la sessione attuale all'avvio
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
  });

  // Listener per aggiornare la sessione quando cambia lo stato dell'utente
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, newSession) => {
      setSession(newSession);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);


  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
