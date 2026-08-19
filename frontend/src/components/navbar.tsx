import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import '../styles/navbar.css'
import { SearchBar } from './searchBar'
import Guest from "../assets/avatars/Guest.jpg";
import avatar1 from "../assets/avatars/avatar1.jpeg";
import avatar2 from "../assets/avatars/avatar2.jpeg";
import avatar3 from "../assets/avatars/avatar3.jpeg";
import avatar4 from "../assets/avatars/avatar4.jpeg";
import avatar5 from "../assets/avatars/avatar5.jpeg";
import avatar6 from "../assets/avatars/avatar6.jpeg";
import avatar7 from "../assets/avatars/avatar7.jpeg";
import avatar8 from "../assets/avatars/avatar8.jpeg";

import type { AuthTab } from '../types/auth'

type NavbarProps = {
  onOpenAuth?: (tab: AuthTab) => void
}

export default function Navbar({ onOpenAuth }: NavbarProps) {

  const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
  ];
  const navigate = useNavigate()
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error(
      "AuthContext debe usarse dentro de AuthProvider"
    );
  }

  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
  } = auth;
  const [isOpen, setIsOpen] = useState(false)


  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLinkClick = () => {
    setIsOpen(false) 
  }

  const handleLogout = () => {
    navigate("/")
    setUser(null);
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    handleLinkClick()
    return
  }

  return (
    <>
      <div 
        className={`hamburger ${isOpen ? 'is-active' : ''}`} 
        onClick={toggleMenu}
        id="hamburger"
      >
        <div className="_layer -top"></div>
        <div className="_layer -mid"></div>
        <div className="_layer -bottom"></div>
      </div>
    <header>
      <div className='main-nav'>
        <a href="/">somindr</a>
      </div>
      
    </header>
      <nav className={`menuppal ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img src="../src/assets/logo.svg" className="logo-img" alt="logo" />
        </div>

        

        <div className="menu-left">
          <SearchBar />
          <Link to="/" className="sidebar-link" onClick={handleLinkClick}>
            Inicio
          </Link>
          <Link to="/comunidad" className="sidebar-link" onClick={handleLinkClick}>
            Comunidad
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
          {
            user?.professional && (
              <Link to="/clients/me" className="sidebar-link" onClick={handleLinkClick}>
                Tus Clientes
              </Link>
            )
          }

          <Link to="/professionals/me" className="sidebar-link" onClick={handleLinkClick}>
                Tus Profesionales
              </Link>
          <div className='nav-profile'>
            <Link
              to="/perfil"
              className="sidebar-link profile-link"
              
              onClick={handleLinkClick}
            >
              <img
                src={user ? avatars[user.fotoPerfil - 1] : Guest}
                className="navbar-avatar"
                alt="Avatar"
              />          
              <span>
                {
                  user
                    ? user.username
                    : "Invitado"
                }
              </span>
            </Link>
          </div>
          
        </div>
        <div className="menu-right">
          {isAuthenticated ? (
            <button
              type="button"
              className="sidebar-link"
              id="logout"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <button
                type="button"
                className="sidebar-link"
                onClick={() => {
                  onOpenAuth?.('login')
                  handleLinkClick()
                }}
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                className="sidebar-link"
                onClick={() => {
                  onOpenAuth?.('registro')
                  handleLinkClick()
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      {isOpen && (
        <div 
          className="menuppal-overlay active" 
          onClick={toggleMenu}
        ></div>
      )}
    </>
  )
}