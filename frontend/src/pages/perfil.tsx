import { useState, useRef } from 'react'
import '../styles/perfil.css'
import Navbar from '../components/navbar'

const PRESET_AVATARS = [
  { hair: '#3CB878', bg: '#DCF3E6' },
  { hair: '#0EA8A0', bg: '#DAF3F1' },
  { hair: '#3B82F6', bg: '#DDEAFE' },
  { hair: '#8B5CF6', bg: '#EDE6FE' },
  { hair: '#EC4899', bg: '#FCE4F0' },
  { hair: '#64748B', bg: '#E7EBEF' },
  { hair: '#14B8A6', bg: '#D9F5F0' },
  { hair: '#F97316', bg: '#FEE9DA' },
]

function FaceSVG({ hair, bg }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill={bg} />
      <ellipse cx="50" cy="40" rx="18" ry="20" fill={hair} />
      <ellipse cx="50" cy="80" rx="28" ry="22" fill={hair} />
      <circle cx="50" cy="38" r="15" fill="#FFDBB5" />
      <ellipse cx="44" cy="36" rx="2.5" ry="3" fill="#333" />
      <ellipse cx="56" cy="36" rx="2.5" ry="3" fill="#333" />
      <path d="M44 44 Q50 49 56 44" stroke="#c0856a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Perfil() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('personajes') // 'personajes' | 'foto'
  const [currentAvatar, setCurrentAvatar] = useState({ type: 'preset', index: 0 })
  const [tempPreset, setTempPreset] = useState(0)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const openModal = () => {
    setActiveTab('personajes')
    setTempPreset(currentAvatar.type === 'preset' ? currentAvatar.index : 0)
    setPhotoPreview(currentAvatar.type === 'photo' ? currentAvatar.src : null)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const confirmPreset = () => {
    setCurrentAvatar({ type: 'preset', index: tempPreset })
    setModalOpen(false)
  }

  const confirmPhoto = () => {
    if (!photoPreview) return
    setCurrentAvatar({ type: 'photo', src: photoPreview })
    setModalOpen(false)
  }

  return (
    <>
      <main className="main">

        <div className="pf-header">
          <div className="avatar-wrap" onClick={openModal}>
            <div className="avatar-circle" id="avatarCircle">
              {currentAvatar.type === 'photo' ? (
                <img src={currentAvatar.src} alt="Tu avatar" />
              ) : (
                <FaceSVG {...PRESET_AVATARS[currentAvatar.index]} />
              )}
            </div>
            <div className="avatar-edit-btn" id="openModal">
              <svg viewBox="0 0 16 16"><path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.07 13.406a2.25 2.25 0 01-.92.578l-2.8.867.867-2.8a2.25 2.25 0 01.578-.92l8.218-8.218z" /></svg>
            </div>
          </div>
          <div>
            <p className="pf-name" id="displayName">Nombre Apellido</p>
            <p className="pf-sub">usuario@email.com · Miembro desde Enero 2025</p>
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
                    className={`av-item${tempPreset === i ? ' sel' : ''}`}
                    onClick={() => setTempPreset(i)}
                  >
                    <FaceSVG {...av} />
                  </div>
                ))}
              </div>
              <button className="av-select-btn" onClick={confirmPreset}>
                Usar este avatar
              </button>
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