import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type MouseEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthTab } from '../types/auth'
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import '../styles/modal-auth.css'

export type ModalAuthRef = {
  mostrarModal: (
    tab?: AuthTab
  ) => void;

  ocultarModal: () => void;

  mostrarError: (
    mensaje: string
  ) => void;
}
const ModalAuth = forwardRef<ModalAuthRef>(function ModalAuth(_, ref) {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error(
      "AuthContext debe usarse dentro de AuthProvider"
    );
  }

  const {
    setIsAuthenticated,
  } = auth;

  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [modalAbierto, setModalAbierto] = useState(false)
  const [tabActivo, setTabActivo] = useState<AuthTab>('login')

  const [email, setEmail] = useState('')
  const [passwordLogin, setPasswordLogin] = useState('')

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [username, setUsername] = useState('')
  const [emailRegistro, setEmailRegistro] = useState('')
  const [passwordRegistro, setPasswordRegistro] = useState('')

  const limpiarLogin = () => {
    setEmail("");
    setPasswordLogin("");
  };

  const limpiarRegistro = () => {
    setNombre("");
    setApellido("");
    setUsername("");
    setEmailRegistro("");
    setPasswordRegistro("");
  };

  const mostrarModal = (
    tab: AuthTab = 'login'
  ) => {
    setTabActivo(tab)
    setModalAbierto(true)
  }

  const ocultarModal = () => {
    limpiarLogin();
    limpiarRegistro();
    setError("")
    setSuccess("")
    setModalAbierto(false)
  }

  useImperativeHandle(ref, () => ({
    mostrarModal,
    ocultarModal,
    mostrarError: (mensaje: string) => {
      setSuccess("");
      setError(mensaje);
      setTabActivo("login");
      setModalAbierto(true);
    },
  }))

  
  useEffect(() => {
    if (!modalAbierto) return

    document.body.classList.add('modal-abierto')

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ocultarModal()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('modal-abierto')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalAbierto])
  const cerrarModal = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) ocultarModal()
  }
    const cambiarTab = (tab: AuthTab) => {
    setError("")
    setSuccess("")
    setTabActivo(tab)
  }

  const handleLogin = async () => {
    if (!email || !passwordLogin) {
      setSuccess("");
      setError("Llena todos los campos");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: passwordLogin,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setSuccess("");
        setError(data.message);
        return;
      }
      localStorage.setItem(
        "token",
        data.token
      );
      setIsAuthenticated(true)
      
      setError("");
      setSuccess("Sesión iniciada");
      ocultarModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegistro = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            apellido,
            username,
            email: emailRegistro,
            password: passwordRegistro,
          }),
        }
      )
      const data = await response.json();
      if (!response.ok) {
        setSuccess("");
        setError(data.message);
        return;
      }
      limpiarRegistro();
      setTabActivo("login");
      setError("");
      setSuccess('Cuenta creada')

    } catch (error) {
      console.error(error)
      setSuccess("");
      setError('Error al registrarse')
    }
  }
  if (!modalAbierto) return null
  return (
    <div
      id="modal-overlay"
      className="modal-overlay visible"
      onClick={cerrarModal}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-tarjeta" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-cerrar"
          onClick={ocultarModal}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="modal-tabs">
          <button
            type="button"
            className={`tab${tabActivo === 'login' ? ' activo' : ''}`}
            onClick={() => {
              limpiarRegistro();
              cambiarTab("login");
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`tab${tabActivo === 'registro' ? ' activo' : ''}`}
            onClick={() => {
              limpiarLogin();
              cambiarTab("registro");
            }}
          >
            Registrarse
          </button>
        </div>

        <div className="logo">
          <div className="logo-icono">
            <img
              src="../src/assets/logo.svg"
              width={70}
              height={70}
              alt="Somindr"
            />
          </div>
        </div>


        {tabActivo === 'login' && (
          <div className="panel">
            <h2 className="titulo">Bienvenido de nuevo</h2>
            <p className="subtitulo">
              Una conexión única entre tu cuerpo y tu mente.
            </p>

            <div className="campo">
              <input
                type="email"
                placeholder="@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="campo">
              <input
                type="password"
                placeholder="••••••••"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
              />
            </div>
            {error && (
              <p className="mensaje-error">
                {error}
              </p>
            )}

            {success && (
              <p className="mensaje-success">
                {success}
              </p>
            )}
            <button
              type="button"
              className="btn-principal"
              onClick={handleLogin}
            >
              Iniciar sesión
            </button>

            <p className="pie">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="pie-link"
                onClick={() => {
                  limpiarLogin();
                  setTabActivo("registro");
                }}
              >
                Regístrate
              </button>
            </p>
          </div>
        )}

        {tabActivo === 'registro' && (
          <div className="panel">
            <h2 className="titulo">Crea tu cuenta</h2>
            <p className="subtitulo">
              Una conexión única entre tu cuerpo y tu mente.
            </p>

            <div className="campo">
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="campo">
              <input
                type="text"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="campo">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="campo">
              <input
                type="email"
                placeholder="@email.com"
                value={emailRegistro}
                onChange={(e) => setEmailRegistro(e.target.value)}
              />
            </div>

            <div className="campo">
              <input
                type="password"
                placeholder="••••••••"
                value={passwordRegistro}
                onChange={(e) => setPasswordRegistro(e.target.value)}
              />
            </div>
            {error && (
              <p className="mensaje-error">
                {error}
              </p>
            )}

            {success && (
              <p className="mensaje-success">
                {success}
              </p>
            )}
            <button
              type="button"
              className="btn-principal"
              onClick={handleRegistro}
            >
              Continuar con email
            </button>

            <p className="pie">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="pie-link"
                onClick={() => {
                  limpiarRegistro();
                  setTabActivo("login");
                }}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

export default ModalAuth
