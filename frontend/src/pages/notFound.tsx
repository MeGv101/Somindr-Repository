import { Link } from "react-router-dom";
import '../styles/notFound.css'

export default function NotFound() {
  return (
    <main className="notfound-page">
      <h1>404</h1>

      <h2>Página no encontrada</h2>

      <p>
        La ruta que intentaste visitar no existe.
      </p>
      <br />
      <Link to="/" className="return">
        Volver al inicio
      </Link>
    </main>
  );
}