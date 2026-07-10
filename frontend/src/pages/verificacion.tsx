//Mensaje de verifiacion
import "../styles/verificacion.css";
import {Link} from "react-router-dom";


export default function Verificacion() {
    return(
        <div className="container-msg">
            <div className="img">
                <img src="https://cdn-icons-png.flaticon.com/512/616/616564.png" alt="slide1" className="img" />
            </div>
            <h1 className="msg">!Verificacion completada¡</h1>
            <p className="msg">Vuelve a la pagina y inicia sesión</p>

        <Link to="/index" className="btn">Iniciar Sesión</Link>
        </div>
    )
}