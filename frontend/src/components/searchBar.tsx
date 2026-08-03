import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/searchBar.css";

interface Usuario {
  id: number;
  username: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const navigate = useNavigate();

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

  const irAlPerfil = (username: string) => {
    setQuery("");
    setResultados([]);
    navigate(`/perfil/${username}`);
  };

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
            <li
              key={user.username}
              className="search-result-item"
              onClick={() => irAlPerfil(user.username)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}