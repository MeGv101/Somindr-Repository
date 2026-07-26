import { useState, useEffect } from "react";
import "../styles/searchBar.css";

interface Usuario {
  id: number;
  username: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Usuario[]>([]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResultados(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar usuario..."
      />
      {resultados.length > 0 && (
        <ul className="search-results">
          {resultados.map((user) => (
            <li key={user.id} className="search-result-item">{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}