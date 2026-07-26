import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthTab } from '../types/auth'
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import ModalVerification, {
  type ModalVerificationRef,
} from './modal-verification'
import { validarDatosRegistro } from '../utils/validacionesRegistro'
import '../styles/modal-auth.css'
import '../styles/modal-error-datos.css'

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
  isAuthenticated,
  setIsAuthenticated,
} = auth;

  const navigate = useNavigate()
  const verificationRef = useRef<ModalVerificationRef>(null)
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
  const [genero, setGenero] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [pesoKg, setPesoKg] = useState("")
  const [estaturaCm, setEstaturaCm] = useState("")
  const [nivelActividad, setNivelActividad] = useState("")

  // Modal de dato inválido (peso, estatura o fecha de nacimiento irreales)
  const [modalDatoInvalidoAbierto, setModalDatoInvalidoAbierto] =
    useState(false)
  const [mensajeDatoInvalido, setMensajeDatoInvalido] = useState("")

  const limpiarLogin = () => {
    setEmail("");
    setPasswordLogin("");
  };

  const limpiarRegistro = () => {
    setNombre("")
    setApellido("")
    setUsername("")
    setEmailRegistro("")
    setPasswordRegistro("")
    setGenero("")
    setFechaNacimiento("")
    setPesoKg("")
    setEstaturaCm("")
    setNivelActividad("")
  }

  const mostrarModal = (
  tab: AuthTab = "login"
) => {

  if (isAuthenticated) {
    return;
  }

  limpiarLogin();
  limpiarRegistro();

  setError("");
  setSuccess("");

  setTabActivo(tab);
  setModalAbierto(true);
};

  useEffect(() => {
  if (isAuthenticated && modalAbierto) {
    ocultarModal();
  }

}, [isAuthenticated]);
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

    if (isAuthenticated) {
      return;
    }

    if (!modalAbierto) {
      return;
    }
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

  const cerrarModalDatoInvalido = () => {
    setModalDatoInvalidoAbierto(false)
  }

  const handleLogin = async () => {
    if (!email || !passwordLogin) {
      setSuccess("");
      setError("Llena todos los campos");
      return;
    }
    try {
      const response = await fetch(
        "/api/login",
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

    // Validamos que peso, estatura y fecha de nacimiento sean datos reales.
    // No se exige un mínimo fijo (como 0): si el valor ingresado es
    // irreal, se limpia únicamente ese campo y se muestra el aviso.
    const resultado = validarDatosRegistro({
      pesoKg,
      estaturaCm,
      fechaNacimiento,
    });

    if (!resultado.valido) {

      if (resultado.campoInvalido === "pesoKg") {
        setPesoKg("");
      }

      if (resultado.campoInvalido === "estaturaCm") {
        setEstaturaCm("");
      }

      if (resultado.campoInvalido === "fechaNacimiento") {
        setFechaNacimiento("");
      }

      setMensajeDatoInvalido(
        resultado.mensaje ??
          "Verifica los datos ingresados."
      );
      setModalDatoInvalidoAbierto(true);
      return;
    }

    try {
      const response = await fetch(
        '/api/register',
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
            genero,
            fechaNacimiento,
            pesoKg: Number(pesoKg),
            estaturaCm: Number(estaturaCm),
            nivelActividad,
          }),
        }
      )
      const data = await response.json();
      if (!response.ok) {
        setSuccess("");
        setError(data.message);
        return;
      }

      const correoRegistrado = emailRegistro;

      limpiarRegistro();
      setTabActivo("login");
      setError("");
      setSuccess("");
      setModalAbierto(false);
      verificationRef.current?.mostrarModal(correoRegistrado);

    } catch (error) {
      console.error(error)
      setSuccess("");
      setError('Error al registrarse')
    }
  }

  
  return (
    <>
      <ModalVerification
        ref={verificationRef}
        onIniciarSesion={() => {
          limpiarLogin();
          setError("");
          setSuccess("");
          setTabActivo("login");
          setModalAbierto(true);
        }}
      />

      {modalAbierto && (
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
          <div className="panel"
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              handleLogin();

            }

          }}>
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
                type="submit"
                className="pie-link"
                onClick={() => {
                  limpiarLogin();
                  setTabActivo("registro");
                }}
              >
                Regístrate
              </button>
            </p>

            <p className="pie">
              ¿No recibiste un correo?{''}
              <button 
              type="submit"
              className="pie-link"
              onClick={() =>{
              
              }}>
                Reenviar correo
              </button>
            </p>
          </div>

        )}

        {tabActivo === 'registro' && (
          <div className="panel"
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              handleRegistro();

            }

          }}>
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
            <div className="campo">
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              >
                <option value="">
                  Selecciona tu género
                </option>

                <option value="Masculino">
                  Masculino
                </option>

                <option value="Femenino">
                  Femenino
                </option>

                <option value="Otro">
                  Otro
                </option>
              </select>
            </div>
            <div className="campo">
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={fechaNacimiento}
                onChange={(e) =>
                  setFechaNacimiento(e.target.value)
                }
              />
            </div>
            <div className="campo">
              <input
                type="number"
                placeholder="Peso (kg)"
                value={pesoKg}
                onChange={(e) =>
                  setPesoKg(e.target.value)
                }
              />
            </div>
            <div className="campo">
              <input
                type="number"
                placeholder="Estatura (cm)"
                value={estaturaCm}
                onChange={(e) =>
                  setEstaturaCm(e.target.value)
                }
              />
            </div>
            <div className="campo">
              <select
                value={nivelActividad}
                onChange={(e) =>
                  setNivelActividad(e.target.value)
                }
              >
                <option value="">
                  Nivel de actividad
                </option>

                <option value="Sedentario">
                  Sedentario
                </option>

                <option value="Ligero">
                  Ligero
                </option>

                <option value="Moderado">
                  Moderado
                </option>

                <option value="Activo">
                  Activo
                </option>

                <option value="Muy activo">
                  Muy activo
                </option>
              </select>
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
                type="submit"
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
      )}

      {modalDatoInvalidoAbierto && (
        <div
          className="validacion-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModalDatoInvalido();
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="validacion-modal">
            <div className="validacion-icono">
              <svg viewBox="0 0 24 24">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="validacion-titulo">Dato inválido</p>
            <p className="validacion-mensaje">
              {mensajeDatoInvalido}
            </p>
            <button
              type="button"
              className="validacion-btn"
              onClick={cerrarModalDatoInvalido}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
})

export default ModalAuth