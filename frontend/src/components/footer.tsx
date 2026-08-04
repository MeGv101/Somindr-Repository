import { Link } from "react-router-dom";
import "../styles/footer.css";

interface FooterProps {
  handleLinkClick?: () => void;
}

export default function Footer({ handleLinkClick }: FooterProps) {
  return (
    <footer>
      <div>
        <div className="footer-logo">
          SOMINDR <span></span>
        </div>
        <p>© 2026 Somindr.</p>
        <p> Informacion acerca de Somindr en Sobre Nosotros</p>
      </div>
      <div className="footer-links">
        <div className="footer-left">
          <Link to="/" className="sidebar-link" onClick={handleLinkClick}>
            Inicio
          </Link>
          <Link to="/comunidad" className="sidebar-link" onClick={handleLinkClick}>
            Comunidad
          </Link>
          <Link to="/aboutus" className="sidebar-link" onClick={handleLinkClick}>
            Sobre nosotros
          </Link>
          <Link to="/psicoemocional" className="sidebar-link" onClick={handleLinkClick}>
            Psico-Emocional
          </Link>
          <Link to="/fitness" className="sidebar-link" onClick={handleLinkClick}>
            Rutinas Físicas
          </Link>
          <Link to="/ai" className="sidebar-link" onClick={handleLinkClick}>
            Asesor IA
          </Link>
          <Link to="/profile/configuration" className="sidebar-link" onClick={handleLinkClick}>
            Configuración
          </Link>
        </div>
      </div>


    </footer>
  );
}