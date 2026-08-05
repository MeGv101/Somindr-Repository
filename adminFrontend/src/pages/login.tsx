import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/authContext";

export default function Login() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          "/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ??
          "Credenciales incorrectas."
        );

        setLoading(false);

        return;

      }

      const success =
        await login(
          data.token
        );

      if (!success) {

        setError(
          "No tienes permisos para acceder al panel."
        );

        setLoading(false);

        return;

      }

      navigate(
        "/",
        {
          replace: true,
        }
      );

    } catch {

      setError(
        "Error de conexión."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0b1117",
      }}
    >

      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 32,
          borderRadius: 14,
          background: "#161b22",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >

        <h1
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Panel Administrativo
        </h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {
          error && (
            <p
              style={{
                color: "tomato",
              }}
            >
              {error}
            </p>
          )
        }

        <button
          disabled={loading}
          type="submit"
        >
          {
            loading
              ? "Ingresando..."
              : "Entrar"
          }
        </button>

      </form>

    </main>

  );

}