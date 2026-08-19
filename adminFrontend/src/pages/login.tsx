import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      const success = await login(data.token);

      if (!success) {
        setError("No tienes permisos para acceder al panel.");
        setLoading(false);
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      {/* ORBS DECORATIVOS */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* LOGIN BOX */}
      <div className="login-box">
        {/* ICONO */}
        <div className="login-icon">
          <span>⚡</span>
        </div>

        {/* TÍTULO */}
        <h1>Panel Administrativo</h1>
        <p className="subtitle">Accede al sistema de gestión</p>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit}>
          {/* CAMPO EMAIL */}
          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="admin@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <span className="input-icon">✉</span>
            </div>
          </div>

          {/* CAMPO PASSWORD */}
          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          {/* OPCIONES */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Recordarme
            </label>
            <button type="button" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="error-message">
              <span className="error-icon">✕</span>
              {error}
            </div>
          )}

          {/* BOTÓN */}
          <button className="btn-login" disabled={loading} type="submit">
            {loading ? (
              <>
                <span className="spinner"></span> Ingresando...
              </>
            ) : (
              "Entrar al Panel"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <p>Sistema de Administración v2.0</p>
          <p className="version">© 2026 - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}