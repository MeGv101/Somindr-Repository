import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import '../styles/perfil.css'

type PresetAvatar = {
  name: string
  gender: 'f' | 'm'
  src: string
}

type CurrentAvatar =
  | { type: 'preset'; index: number }
  | { type: 'photo'; src: string }

// Coloca las 8 imágenes en /public/media/ (mismos nombres) para que estas rutas funcionen.
const PRESET_AVATARS: PresetAvatar[] = [
  { name: 'Rizos', gender: 'f', src: "../media/SRC/avatar-01-rizos-verde.png" },
  { name: 'Rubia', gender: 'f', src: "../media/SRC/avatar-02-rubia-rosa.png" },
  { name: 'Corto punk', gender: 'f', src: "../media/SRC/avatar-03-corto-punk.png" },
  { name: 'Pelirroja', gender: 'f', src: "../media/SRC/avatar-04-pelirroja-naranja.png" },
  { name: 'Lentes', gender: 'm', src: "../media/SRC/avatar-05-lentes-azul.png" },
  { name: 'Ondulado', gender: 'm', src: "../media/SRC/avatar-06-ondulado-morado.png" },
  { name: 'Pelirrojo', gender: 'm', src: "../media/SRC/avatar-07-pelirrojo-verde.png" },
  { name: 'Barba', gender: 'm', src: "../media/SRC/avatar-08-barba-cuadros.png" },
]

export default function Perfil() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'personajes' | 'foto'>('personajes')
  const [currentAvatar, setCurrentAvatar] = useState<CurrentAvatar>({ type: 'preset', index: 0 })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openModal = () => {
    setActiveTab('personajes')
    setPhotoPreview(currentAvatar.type === 'photo' ? currentAvatar.src : null)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  // Un clic en el avatar lo aplica y cierra el modal al instante
  const selectPreset = (index: number) => {
    setCurrentAvatar({ type: 'preset', index })
    setModalOpen(false)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const confirmPhoto = () => {
    if (!photoPreview) return
    setCurrentAvatar({ type: 'photo', src: photoPreview })
    setModalOpen(false)
  }

  const displayedSrc =
    currentAvatar.type === 'photo' ? currentAvatar.src : PRESET_AVATARS[currentAvatar.index].src

  return (
    <>
      <main className="main">

        <div className="pf-header">
          <div className="avatar-wrap" onClick={openModal}>
            <div className="avatar-circle" id="avatarCircle">
              <img src={displayedSrc} alt="Tu avatar" />
            </div>
            <div className="avatar-edit-btn" id="openModal">
              <svg viewBox="0 0 16 16"><path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.07 13.406a2.25 2.25 0 01-.92.578l-2.8.867.867-2.8a2.25 2.25 0 01.578-.92l8.218-8.218z" /></svg>
            </div>
          </div>
          <div>
            <p className="pf-name" id="displayName">Nombre Apellido</p>
            <p className="pf-sub">usuario@email.com · Miembro desde Enero 2026</p>
          </div>
          <button className="btn-guardar" style={{ marginLeft: 'auto' }}>Guardar cambios</button>
        </div>

        <div className="perfil-grid">
          <div>
            <div className="card">
              <div className="card-titulo">Datos Personales</div>
              <div className="card-sub">Tu información básica de perfil</div>
              <div className="form-2">
                <div className="campo-perfil">
                  <label>Nombre</label>
                  <input type="text" placeholder="Tu nombre" />
                </div>
                <div className="campo-perfil">
                  <label>Apellido</label>
                  <input type="text" placeholder="Tu apellido" />
                </div>
              </div>
              <div className="campo-perfil">
                <label>Correo electrónico</label>
                <input type="email" placeholder="usuario@email.com" />
              </div>
              <div className="form-2">
                <div className="campo-perfil">
                  <label>Edad</label>
                  <input type="number" placeholder="28" />
                </div>
                <div className="campo-perfil">
                  <label>Género</label>
                  <select>
                    <option>Prefiero no decir</option>
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>No binario</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="card-titulo">Datos Físicos</div>
              <div className="card-sub">Información para personalizar tus rutinas y plan nutricional</div>
              <div className="form-2">
                <div className="campo-perfil">
                  <label>Peso (kg)</label>
                  <input type="number" placeholder="70" />
                </div>
                <div className="campo-perfil">
                  <label>Estatura (cm)</label>
                  <input type="number" placeholder="170" />
                </div>
              </div>
              <div className="form-2">
                <div className="campo-perfil">
                  <label>Nivel de actividad</label>
                  <select>
                    <option>Sedentario</option>
                    <option>Moderado</option>
                    <option>Activo</option>
                    <option>Muy activo</option>
                  </select>
                </div>
                <div className="campo-perfil">
                  <label>Objetivo principal</label>
                  <select>
                    <option>Bajar de peso</option>
                    <option>Ganar masa muscular</option>
                    <option>Bienestar general</option>
                    <option>Reducir estrés</option>
                  </select>
                </div>
              </div>
              <div className="campo-perfil">
                <label>Condiciones o restricciones de salud</label>
                <input type="text" placeholder="Ej: diabetes, hipertensión, vegetariano…" />
              </div>
            </div>
          </div>
        </div>

      </main>

      <div className={`av-overlay${modalOpen ? ' open' : ''}`} id="avOverlay">
        <div className="av-modal">
          <div className="av-modal-header">
            <span className="av-modal-title">Elige tu avatar</span>
            <button className="av-modal-close" onClick={closeModal}>✕</button>
          </div>
          <p className="av-modal-sub">Selecciona un personaje predeterminado o sube tu foto</p>

          <div className="av-tabs">
            <button
              className={`av-tab${activeTab === 'personajes' ? ' active' : ''}`}
              onClick={() => setActiveTab('personajes')}
            >
              Personajes
            </button>
            <button
              className={`av-tab${activeTab === 'foto' ? ' active' : ''}`}
              onClick={() => setActiveTab('foto')}
            >
              Mi foto
            </button>
          </div>

          {activeTab === 'personajes' && (
            <div id="tabPersonajes">
              <div className="av-grid" id="avGrid">
                {PRESET_AVATARS.map((av, i) => (
                  <div
                    key={i}
                    className={`av-item${currentAvatar.type === 'preset' && currentAvatar.index === i ? ' sel' : ''}`}
                    onClick={() => selectPreset(i)}
                    title={av.name}
                  >
                    <img src={av.src} alt={av.name} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'foto' && (
            <div id="tabFoto">
              <label className="av-upload-btn" htmlFor="fileInput">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm-1 10V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V13a1 1 0 11-2 0z" />
                </svg>
                Subir foto desde mi dispositivo
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {photoPreview && (
                <div id="photoPreviewWrap">
                  <img id="photoPreview" src={photoPreview} alt="Vista previa" />
                  <br />
                  <button className="av-select-btn" onClick={confirmPhoto}>
                    Usar esta foto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}