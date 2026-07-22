import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "/src/styles/verificacion.css";

export default function VerifyEmail() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {

    const token = searchParams.get("token");

    if (!token) {
      setLoading(false);
      setMessage("El enlace de verificación es inválido.");
      return;
    }

    async function verifyEmail() {

      try {

        const response = await fetch(
          "http://localhost:3000/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message);
          return;
        }

        setSuccess(true);
        setMessage("Tu cuenta fue verificada correctamente.");

        setTimeout(() => {
          navigate("/");
        }, 3500);

      } catch {

        setMessage(
          "No fue posible contactar con el servidor."
        );

      } finally {

        setLoading(false);

      }

    }

    verifyEmail();

  }, []);

  return (
  <div className="verify-page">

    <h1>Somindr</h1>

    <h2
      className={
        loading
          ? "verify-loading"
          : success
            ? "verify-success"
            : "verify-error"
      }
    >
      {loading
        ? "Verificando..."
        : success
          ? "Correo verificado"
          : "Verificación fallida"}
    </h2>

    <p>{message}</p>

    {!loading && (
      <a
        href="/"
        className="return"
      >
        Ir al inicio de sesión
      </a>
    )}
  </div>

);
}