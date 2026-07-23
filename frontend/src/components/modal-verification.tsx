import {
  forwardRef,
  useImperativeHandle,
  useState,
  type MouseEvent,
} from 'react'
import '../styles/modal-auth.css'
import '../styles/modal-verification.css'

export type ModalVerificationRef = {
  mostrarModal: (email: string) => void
  ocultarModal: () => void
}

type ModalVerificationProps = {
  onIniciarSesion?: () => void
}

const ModalVerification = forwardRef<
  ModalVerificationRef,
  ModalVerificationProps
>(function ModalVerification({ onIniciarSesion }, ref) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [email, setEmail] = useState('')
  const [reenviando, setReenviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mensajeError, setMensajeError] = useState('')

  const ocultarModal = () => {
    setModalAbierto(false)
  }

  useImperativeHandle(ref, () => ({
    mostrarModal: (correo: string) => {
      setEmail(correo)
      setMensaje('')
      setMensajeError('')
      setModalAbierto(true)
    },
    ocultarModal,
  }))

  const cerrarAlClickFuera = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) ocultarModal()
  }

  const handleReenviar = async () => {
    if (!email || reenviando) return

    setReenviando(true)
    setMensaje('')
    setMensajeError('')

    try {
      const response = await fetch(
        'http://localhost:3000/resend-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        setMensajeError(data.message)
        return
      }

      setMensaje(data.message || 'Correo reenviado.')
    } catch (error) {
      console.error(error)
      setMensajeError('Error al reenviar el correo.')
    } finally {
      setReenviando(false)
    }
  }

  if (!modalAbierto) return null

  return (
    <div
      id="modal-verification-overlay"
      className="modal-overlay visible"
      onClick={cerrarAlClickFuera}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-tarjeta modal-tarjeta-verification">
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

        <div className="panel panel-verification">
          <div className="check-animado">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <circle
                className="check-circulo"
                cx="26"
                cy="26"
                r="24"
                fill="none"
              />
              <path
                className="check-marca"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <h2 className="titulo">Registrado con éxito</h2>
          <p className="subtitulo">
            Revisa tu correo antes de iniciar sesión
          </p>

          {mensajeError && (
            <p className="mensaje-error">{mensajeError}</p>
          )}

          {mensaje && (
            <p className="mensaje-success">{mensaje}</p>
          )}

          <p className="pie">
            ¿No has recibido el correo?{' '}
            <button
              type="button"
              className="pie-link"
              onClick={handleReenviar}
              disabled={reenviando}
            >
              {reenviando ? 'Reenviando...' : 'Reenviar'}
            </button>
          </p>

          <p className="pie">
            <button
              type="button"
              className="pie-link pie-link-login"
              onClick={() => {
                ocultarModal()
                onIniciarSesion?.()
              }}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
})

export default ModalVerification