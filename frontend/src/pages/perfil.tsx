import { useState, useRef } from 'react'
import '../styles/perfil.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer';

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

  const displayedSrc =
    currentAvatar.type === 'photo' ? currentAvatar.src : PRESET_AVATARS[currentAvatar.index].src

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

            <div className="avatar-edit-btn">

              <svg viewBox="0 0 16 16">
                <path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.07 13.406a2.25 2.25 0 01-.92.578l-2.8.867.867-2.8a2.25 2.25 0 01.578-.92l8.218-8.218z" />
              </svg>

            </div>

          </div>

          <div>
            <p className="pf-name" id="displayName">Nombre Apellido</p>
            <p className="pf-sub">usuario@email.com · Miembro desde Enero 2025</p>
          </div>

          <button
            className="btn-guardar"
            style={{ marginLeft: "auto" }}
            onClick={guardarPerfil}
          >
            Guardar cambios
          </button>

        </div>

        <div className="perfil-grid">

          <div>

            <div className="card">

              <div className="card-titulo">
                Datos personales
              </div>

              <div className="card-sub">
                Información básica de tu cuenta.
              </div>

              <div className="form-2">

                <div className="campo-perfil">

                  <label>Nombre</label>

                  <input
                    value={perfil.nombre}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        nombre: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="campo-perfil">

                  <label>Apellido</label>

                  <input
                    value={perfil.apellido}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        apellido: e.target.value,
                      })
                    }
                  />

                </div>

              </div>



              <div className="campo-perfil">

                <label>Biografía</label>

                <textarea
                  rows={4}
                  value={perfil.biografia}
                  onChange={(e) =>
                    setPerfil({
                      ...perfil,
                      biografia: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-2">

                <div className="campo-perfil">

                  <label>Fecha de nacimiento</label>

                  <input
                    type="date"
                    value={perfil.fechaNacimiento}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        fechaNacimiento:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="campo-perfil">

                  <label>Género</label>

                  <select
                    value={perfil.genero}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        genero: e.target.value,
                      })
                    }
                  >

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

              </div>

            </div>

          </div>

          <div>

            <div className="card">

              <div className="card-titulo">
                Datos físicos
              </div>

              <div className="card-sub">
                *Esta información no aparecerá en tu perfil
              </div>

              <div className="form-2">

                <div className="campo-perfil">

                  <label>Peso (kg)</label>

                  <input
                    type="number"
                    value={perfil.pesoKg}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        pesoKg: Number(
                          e.target.value
                        ),
                      })
                    }
                  />

                </div>

                <div className="campo-perfil">

                  <label>Estatura (cm)</label>

                  <input
                    type="number"
                    value={perfil.estaturaCm}
                    onChange={(e) =>
                      setPerfil({
                        ...perfil,
                        estaturaCm: Number(
                          e.target.value
                        ),
                      })
                    }
                  />

                </div>

              </div>

              <div className="campo-perfil">

                <label>
                  Nivel de actividad
                </label>

                <select
                  value={perfil.nivelActividad}
                  onChange={(e) =>
                    setPerfil({
                      ...perfil,
                      nivelActividad:
                        e.target.value,
                    })
                  }
                >

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
            <div id="tabPersonajes">
              <div className="av-grid" id="avGrid">
                {PRESET_AVATARS.map((avatar, i) => (
                  <div
                    key={i}
                    className={`av-item${tempPreset === i ? ' sel' : ''}`}
                    onClick={() => setTempPreset(i)}
                  >
                    <FaceSVG {...av} />
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </>
  )
}