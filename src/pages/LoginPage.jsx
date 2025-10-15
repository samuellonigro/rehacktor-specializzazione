// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

export default function LoginPage() {
  const { setSession } = useContext(SessionContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      setSession(data.session);
      alert("Accesso effettuato!");
    } catch (err) {
      console.error(err);
      alert("Errore login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Accedi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 rounded bg-gray-800" />
        <input type="password" value={form.password} onChange={(e)=> setForm({...form, password: e.target.value})} placeholder="Password" className="w-full p-2 rounded bg-gray-800" />
        <button disabled={loading} className="w-full py-2 bg-sky-600 hover:bg-sky-700 rounded font-semibold">{loading ? "Login..." : "Accedi"}</button>
      </form>
    </div>
  );
}
