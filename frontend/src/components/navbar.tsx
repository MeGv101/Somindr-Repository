import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import '../styles/navbar.css'

import type { AuthTab } from '../types/auth'

type NavbarProps = {
  onOpenAuth?: (tab: AuthTab) => void
}

export default function Navbar({ onOpenAuth }: NavbarProps) {

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error(
      "AuthContext debe usarse dentro de AuthProvider"
    );
  }

  const {
    isAuthenticated,
    setIsAuthenticated,
  } = auth;
  const [isOpen, setIsOpen] = useState(false)


  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLinkClick = () => {
    setIsOpen(false) 
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    handleLinkClick()
    setIsAuthenticated(true)
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
          somindr
      </div>
      
    </header>
      <nav className={`menuppal ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img src="../src/assets/logo.svg" className="logo-img" alt="logo" />
        </div>

        <div className="menu-left">
          <Link to="/" className="sidebar-link" onClick={handleLinkClick}>
            Inicio
          </Link>
          <Link to="/" className="sidebar-link" onClick={handleLinkClick}>
            Dashboard
          </Link>
          <Link to="/psicoemocional" className="sidebar-link" onClick={handleLinkClick}>
            Psico-Emocional
          </Link>
          <Link to="/fitness" className="sidebar-link" onClick={handleLinkClick}>
            Fitness
          </Link>
          <Link to="/perfil" className="sidebar-link" onClick={handleLinkClick}>
            Configuración
          </Link>

          
        </div>
        <div className="menu-right">
          {isAuthenticated ? (
            <button
              type="button"
              className="sidebar-link"
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