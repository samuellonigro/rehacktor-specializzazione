// src/hooks/useFetch.jsx
import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // evita memory leak in caso di smontaggio del componente

    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const json = await response.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
