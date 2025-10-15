import { useState, useContext } from "react";
import supabase from "../supabase/supabase-client";
import { registerSchema } from "../lib/validationForm";
import SessionContext from "../context/SessionContext";

export default function RegisterPage() {
  const { setSession } = useContext(SessionContext);
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", username: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const parsed = registerSchema.safeParse({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
    });

    if (!parsed.success) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { data: { first_name: parsed.data.firstName, last_name: parsed.data.lastName, username: parsed.data.username } },
      });
      if (error) throw error;
      setSession(data.session);
      alert("Registrazione completata! Controlla la tua email.");
    } catch (err) {
      console.error(err);
      alert("Errore registrazione: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Crea il tuo account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Nome" className="w-full p-2 rounded bg-gray-800" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Cognome" className="w-full p-2 rounded bg-gray-800" />
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full p-2 rounded bg-gray-800" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded bg-gray-800" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 rounded bg-gray-800" />
        <button disabled={loading} className="w-full py-2 bg-violet-600 hover:bg-violet-700 rounded font-semibold">
          {loading ? "Creazione..." : "Crea account"}
        </button>
      </form>
    </div>
  );
}


