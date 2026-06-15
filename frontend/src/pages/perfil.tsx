import '../styles/perfil.css'
import Navbar from '../components/navbar'
export default function Perfil() {
  return (
  <>

<main className="main">
  
  <div className="pf-header">
  <div className="avatar-wrap">
    <div className="avatar-circle" id="avatarCircle">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" id="currentSvg">
        <circle cx="50" cy="50" r="50" fill="#c8eed9"/>
        <ellipse cx="50" cy="40" rx="18" ry="20" fill="#3CB878"/>
        <ellipse cx="50" cy="80" rx="28" ry="22" fill="#3CB878"/>
        <circle cx="50" cy="38" r="15" fill="#FFDBB5"/>
        <ellipse cx="44" cy="36" rx="2.5" ry="3" fill="#333"/>
        <ellipse cx="56" cy="36" rx="2.5" ry="3" fill="#333"/>
        <path d="M44 44 Q50 49 56 44" stroke="#c0856a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
    </div>
    <div className="avatar-edit-btn" id="openModal">
      <svg viewBox="0 0 16 16"><path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.07 13.406a2.25 2.25 0 01-.92.578l-2.8.867.867-2.8a2.25 2.25 0 01.578-.92l8.218-8.218z"/></svg>
    </div>
  </div>
  <div>
    <p className="pf-name" id="displayName">Nombre Apellido</p>
    <p className="pf-sub">usuario@email.com · Miembro desde Enero 2025</p>
  </div>
  <button className="btn-guardar">Guardar cambios</button>
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
            <option selected>Moderado</option>
            <option>Activo</option>
            <option>Muy activo</option>
          </select>
        </div>
        <div className="campo-perfil">
          <label>Objetivo principal</label>
          <select>
            <option>Bajar de peso</option>
            <option>Ganar masa muscular</option>
            <option selected>Bienestar general</option>
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

<div className="av-overlay" id="avOverlay">
  <div className="av-modal" >
    <div className="av-modal-header">
      <span className="av-modal-title">Elige tu avatar</span>
      <button className="av-modal-close" id="closeModal">✕</button>
    </div>
    <p className="av-modal-sub">Selecciona un personaje predeterminado o sube tu foto</p>

    <div className="av-tabs">
      <button className="av-tab active" >Personajes</button>
      <button className="av-tab" >Mi foto</button>
    </div>

    <div id="tabPersonajes">
      <div className="av-grid" id="avGrid"></div>
      <button className="av-select-btn" >Usar este avatar</button>
    </div>

    <div id="tabFoto" >
      <label className="av-upload-btn" htmlFor="fileInput">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm-1 10V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V13a1 1 0 11-2 0z"/>
        </svg>
        Subir foto desde mi dispositivo
      </label>
      <input type="file" id="fileInput" accept="image/*"/>
      <div id="photoPreviewWrap" >
        <img id="photoPreview"/>
        <br/>
        <button className="av-select-btn">Usar esta foto</button>
      </div>
    </div>
  </div>
</div>
  </>
  )
  }