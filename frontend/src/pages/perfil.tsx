import { useState, useRef, useEffect } from "react";

import "../styles/perfil.css";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import avatar1 from "../assets/avatars/avatar1.jpeg";
import avatar2 from "../assets/avatars/avatar2.jpeg";
import avatar3 from "../assets/avatars/avatar3.jpeg";
import avatar4 from "../assets/avatars/avatar4.jpeg";
import avatar5 from "../assets/avatars/avatar5.jpeg";
import avatar6 from "../assets/avatars/avatar6.jpeg";
import avatar7 from "../assets/avatars/avatar7.jpeg";
import avatar8 from "../assets/avatars/avatar8.jpeg";

const PRESET_AVATARS = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
];

export default function Perfil() {

  const [loading, setLoading] =
    useState(true);

  const [perfil, setPerfil] =
    useState({

      nombre: "",
      apellido: "",
      username: "",
      email: "",
      genero: "",
      fechaNacimiento: "",
      pesoKg: 0,
      estaturaCm: 0,
      nivelActividad: "",
      biografia: "",
      fotoPerfil: 1,

    });

  const [modalOpen, setModalOpen] =
    useState(false);

  const [tempPreset, setTempPreset] =
    useState(0);

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (loading) {

    return (
      <>

        <main className="main">
          <h2>Cargando perfil...</h2>
        </main>

        <Footer />
      </>
    );

  }
  async function cargarPerfil() {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch("/api/profile", {

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

      });

    if (!response.ok) {
      throw new Error(
        "No se pudo cargar el perfil."
      );
    }

    const data =
      await response.json();

    setPerfil(data);

    setTempPreset(
      data.fotoPerfil - 1
    );

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

}

async function guardarPerfil() {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch("/api/profile", {

        method: "PATCH",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body: JSON.stringify(perfil),

      });

    if (!response.ok) {

      alert(
        "No se pudo actualizar el perfil."
      );

      return;

    }

    await cargarPerfil();

    alert(
      "Perfil actualizado correctamente."
    );

  } catch (err) {

    console.error(err);

    alert(
      "Error del servidor."
    );

  }

}

const openModal = () => {

  setTempPreset(
    perfil.fotoPerfil - 1
  );
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
};

const confirmPreset = () => {
  setPerfil({
    ...perfil,
    fotoPerfil:
      tempPreset + 1,
  });
  setModalOpen(false);
};

  return (
    <>
      <main className="main">

        <div className="pf-header">

          <div
            className="avatar-wrap"
            onClick={openModal}
          >

            <div className="avatar-circle">

              <img
                src={
                  PRESET_AVATARS[
                    perfil.fotoPerfil - 1
                  ]
                }
                alt="Avatar"
              />

            </div>

            <div className="avatar-edit-btn">

              <svg viewBox="0 0 16 16">
                <path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.07 13.406a2.25 2.25 0 01-.92.578l-2.8.867.867-2.8a2.25 2.25 0 01.578-.92l8.218-8.218z" />
              </svg>

            </div>

          </div>

          <div>

            <p className="pf-name">
              {perfil.nombre} {perfil.apellido}
            </p>

            <p className="pf-sub">
              {perfil.username}
            </p>

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
                *Información visible únicamente para tus profesionales
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
                    className={`av-item ${tempPreset === i ? "sel" : ""}`}
                    onClick={() => setTempPreset(i)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${i + 1}`}
                      className="avatar-option"
                    />
                  </div>
                ))}
              </div>
              <button className="av-select-btn" onClick={confirmPreset}>
                Usar este avatar
              </button>
            </div>
        </div>
      </div>
      <Footer />
    </>
  )
}