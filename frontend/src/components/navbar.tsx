export default function Navbar() {
    return (
        <>
            <div className="hamburger" id="hamburger">
                <div className="_layer -top"></div>
                <div className="_layer -mid"></div>
                <div className="_layer -bottom"></div>
            </div>

            <nav className="menuppal">
                <div className="sidebar-logo">
                    <img src="../MEDIA/WEB/Logo final-Photoroom.png" className="logo-img" alt="logo" />
                </div>
                <div className="menu-left">
                    <a href="dashboard.html" className="sidebar-link">Dashboard</a>
                    <a href="index.html" className="sidebar-link">Inicio</a>
                    <a href="psicoemocional.php" className="sidebar-link">Psico-Emocional</a>
                    <a href="fitness.html" className="sidebar-link">Fitness</a>
                    <a href="perfil.html" className="sidebar-link">Configuración</a>
                    <div className="menu-right">
                        <a href="inicioSesion.html" className="sidebar-link cerrar">Cerrar sesión</a>
                    </div>
                </div>
                <script src="../JS/boton.js"></script>
            </nav>
        </>
    )}