import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/supabase-client";
import { loginSchema, getZodErrors } from "../lib/validationForm";
import SessionContext from "../context/SessionContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useContext(SessionContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    try {
      const single = loginSchema.pick({ [name]: true });
      const res = single.safeParse({ [name]: value });
      if (!res.success) setErrors((p) => ({ ...p, ...getZodErrors(res.error) }));
      else setErrors((p) => ({ ...p, [name]: null }));
    } catch {
      setErrors((p) => ({ ...p, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(getZodErrors(parsed.error));
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      alert("Errore login: " + error.message);
      setLoading(false);
      return;
    }

    // Aggiorna il context con la sessione
    setSession(data.session);

    alert("Login completato! 👍");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Accedi</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-900"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-900"
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded text-white font-semibold"
          >
            {loading ? "Accedendo..." : "Accedi"}
          </button>
        </div>
      </form>
    </div>
  );
}
