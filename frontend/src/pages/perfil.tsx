import { useState, useEffect } from "react";

import "../styles/perfil.css";

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

interface Professional {
  id:number;
  profession:string;
  description:string;
  pricePerHour:number;
  active:boolean;
  acceptingClients:boolean;
  contacts:{
    id:number;
    type:string;
    value:string;
  }[];
}

interface ProfessionalRequest {
  id:number;
  profession:string;
  message:string;
  status:string;
}

// Claves posibles para identificar qué acción de guardado
// está mostrando el ícono de resultado (check / x)
type SaveKey = "perfil" | "professional";

interface SaveStatus {
  key:SaveKey;
  status:"success" | "error";
  // Identificador único por cada disparo, para forzar que
  // React remonte el ícono (y así reinicie su animación)
  // incluso si se guarda dos veces seguidas con el mismo resultado
  token:number;
}

// Ícono animado de resultado de guardado (check o x).
// Maneja su propio ciclo de vida: entra, se mantiene visible
// y luego sale con la misma transición pero en reversa,
// avisando al padre (onDone) cuando ya puede desmontarse.
function SaveStatusIcon({
  status,
  onDone,
}:{
  status:"success" | "error";
  onDone:()=>void;
}){

  const [phase,setPhase] =
    useState<"enter" | "visible" | "leaving">("enter");

  useEffect(()=>{

    // Se espera un frame para que el navegador pinte el
    // estado inicial ("enter") antes de pasar a "visible",
    // así la transición de entrada sí se reproduce
    const raf = requestAnimationFrame(()=>{
      setPhase("visible");
    });

    const leaveTimer = setTimeout(()=>{
      setPhase("leaving");
    },2600);

    const doneTimer = setTimeout(()=>{
      onDone();
    },3000);

    return ()=>{
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };

  },[]);

  return(
    <span
      className={`save-status-icon ${status} ${phase}`}
      role="status"
      aria-label={
        status === "success"
        ? "Guardado correctamente"
        : "Error al guardar"
      }
    >

      {
        status === "success"
        ?
        <svg viewBox="0 0 24 24">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
        :
        <svg viewBox="0 0 24 24">
          <path d="M5 5l14 14" />
          <path d="M19 5L5 19" />
        </svg>
      }

    </span>
  );

}


export default function Perfil(){

  const [loading,setLoading] = useState(true);

  const [perfil,setPerfil] = useState({
    nombre:"",
    apellido:"",
    username:"",
    email:"",
    genero:"",
    fechaNacimiento:"",
    pesoKg:0,
    estaturaCm:0,
    nivelActividad:"",
    biografia:"",
    fotoPerfil:1,
  });

  const [professional,setProfessional] =
    useState<Professional | null>(null);

  const [professionalRequest,setProfessionalRequest] =
    useState<ProfessionalRequest | null>(null);

  const [professionalModal,setProfessionalModal] =
    useState(false);

  const [professionalForm,setProfessionalForm] =
    useState({
      profession:"",
      message:"",
    });

  const [tempPreset,setTempPreset] =
    useState(0);

  const [modalOpen,setModalOpen] =
    useState(false);

  // Estado del ícono de resultado de guardado (check / x).
  // El tiempo de vida (entrada, espera y salida) lo maneja
  // internamente el propio SaveStatusIcon.
  const [saveStatus,setSaveStatus] =
    useState<SaveStatus | null>(null);

  // Muestra el ícono de check o x junto al botón correspondiente.
  // Un token distinto por cada llamada obliga a React a montar
  // una instancia nueva del ícono, así la animación siempre
  // se reproduce desde el principio.
  function showSaveStatus(key:SaveKey,status:"success" | "error"){

    setSaveStatus({ key, status, token:Date.now() });

  }

  useEffect(()=>{
    cargarPerfil();
    cargarProfessionalData();
  },[]);


  async function cargarPerfil(){

    try{

      const token =
        localStorage.getItem("token");

      const response =
        await fetch("/api/profile",{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });

      if(!response.ok){
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

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  }


  async function cargarProfessionalData(){

    try{

      const token =
        localStorage.getItem("token");


      const professionalResponse =
        await fetch("/api/professionals/me",{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });


      if(professionalResponse.ok){

        const data =
          await professionalResponse.json();

        setProfessional(data);
        setProfessionalRequest(null);

        return;

      }


      const requestResponse =
        await fetch("/api/professional-requests/me",{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });


      if(requestResponse.ok){

        const data =
          await requestResponse.json();

        if(data.status === "PENDING"){
          setProfessionalRequest(data);
        }

      }

    }catch(error){

      console.error(error);

    }

  }


  async function guardarPerfil(){

    try{

      const token =
        localStorage.getItem("token");


      const response =
        await fetch("/api/profile",{

          method:"PATCH",

          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
          },

          body:JSON.stringify(perfil),

        });


      if(!response.ok){

        showSaveStatus("perfil","error");

        return;

      }


      await cargarPerfil();

      showSaveStatus("perfil","success");


    }catch(error){

      console.error(error);

      showSaveStatus("perfil","error");

    }

  }
    async function sendProfessionalRequest(){

    try{

      const token =
        localStorage.getItem("token");


      const response =
        await fetch("/api/professional-requests",{

          method:"POST",

          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
          },

          body:JSON.stringify(
            professionalForm
          ),

        });


      if(!response.ok){

        alert(
          "No se pudo enviar la solicitud."
        );

        return;

      }


      setProfessionalModal(false);

      setProfessionalForm({
        profession:"",
        message:"",
      });


      await cargarProfessionalData();


      alert(
        "Solicitud enviada correctamente."
      );


    }catch(error){

      console.error(error);

    }

  }



  async function updateProfessional(){

    try{

      const token =
        localStorage.getItem("token");


      const response =
        await fetch("/api/professionals/me",{

          method:"PATCH",

          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
          },

          body:JSON.stringify(
            professional
          ),

        });


      if(!response.ok){

        showSaveStatus("professional","error");

        return;

      }


      await cargarProfessionalData();

      showSaveStatus("professional","success");


    }catch(error){

      console.error(error);

      showSaveStatus("professional","error");

    }

  }




  async function deactivateProfessional(){

    try{

      const token =
        localStorage.getItem("token");


      await fetch(
        "/api/professionals/me/deactivate",
        {
          method:"PATCH",
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      await cargarProfessionalData();


    }catch(error){

      console.error(error);

    }

  }



  async function reactivateProfessional(){

    try{

      const token =
        localStorage.getItem("token");


      await fetch(
        "/api/professionals/me/reactivate",
        {
          method:"PATCH",
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      await cargarProfessionalData();


    }catch(error){

      console.error(error);

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



  if(loading){

    return(
      <>
        <main className="main">
          <h2>Cargando perfil...</h2>
        </main>

        <Footer/>
      </>
    );

  }
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


        <div
          className="guardar-action"
          style={{
            marginLeft:"auto"
          }}
        >

          <button
            className="btn-guardar"
            onClick={guardarPerfil}
          >
            Guardar cambios
          </button>

          {
            saveStatus?.key === "perfil" && (
              <SaveStatusIcon
                key={saveStatus.token}
                status={saveStatus.status}
                onDone={()=>setSaveStatus(null)}
              />
            )
          }

        </div>


      </div>



      <div className="perfil-grid">


        <div className="card">


          <div className="card-titulo">
            Datos personales
          </div>


          <div className="card-sub">
            Información básica de tu cuenta.
          </div>


          <div className="form-2">


            <div className="campo-perfil">

              <label>
                Nombre
              </label>


              <input
                value={perfil.nombre}
                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    nombre:e.target.value
                  })
                }
              />

            </div>



            <div className="campo-perfil">

              <label>
                Apellido
              </label>


              <input
                value={perfil.apellido}
                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    apellido:e.target.value
                  })
                }
              />

            </div>


          </div>



          <div className="campo-perfil">

            <label>
              Biografía
            </label>


            <textarea
              rows={4}
              value={perfil.biografia}
              onChange={(e)=>
                setPerfil({
                  ...perfil,
                  biografia:e.target.value
                })
              }
            />


          </div>



          <div className="form-2">


            <div className="campo-perfil">

              <label>
                Fecha de nacimiento
              </label>


              <input
                type="date"
                value={perfil.fechaNacimiento}
                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    fechaNacimiento:e.target.value
                  })
                }
              />

            </div>



            <div className="campo-perfil">

              <label>
                Género
              </label>


              <select

                value={perfil.genero}

                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    genero:e.target.value
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
                <div className="card">

          <div className="card-titulo">
            Datos físicos
          </div>

          <div className="card-sub">
            Información visible únicamente para tus profesionales.
          </div>


          <div className="form-2">

            <div className="campo-perfil">

              <label>
                Peso (kg)
              </label>

              <input
                type="number"
                value={perfil.pesoKg}
                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    pesoKg:Number(
                      e.target.value
                    )
                  })
                }
              />

            </div>


            <div className="campo-perfil">

              <label>
                Estatura (cm)
              </label>

              <input
                type="number"
                value={perfil.estaturaCm}
                onChange={(e)=>
                  setPerfil({
                    ...perfil,
                    estaturaCm:Number(
                      e.target.value
                    )
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

              onChange={(e)=>
                setPerfil({
                  ...perfil,
                  nivelActividad:e.target.value
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



        <div className="card">


          <div className="card-titulo">
            Cuenta profesional
          </div>


          <div className="card-sub">
            Gestiona tus funciones como especialista.
          </div>



          {
            professional ?


            <>


              <p>

                <strong>
                  Estado:
                </strong>

                {" "}

                {
                  professional.active
                  ?
                  "Activo"
                  :
                  "Desactivado"
                }


              </p>



              <div className="campo-perfil">

                <label>
                  Profesión
                </label>


                <input

                  value={
                    professional.profession
                  }

                  onChange={(e)=>
                    setProfessional({

                      ...professional,

                      profession:
                        e.target.value

                    })
                  }

                />


              </div>



              <div className="campo-perfil">


                <label>
                  Descripción
                </label>


                <textarea

                  rows={4}

                  value={
                    professional.description
                  }

                  onChange={(e)=>
                    setProfessional({

                      ...professional,

                      description:
                        e.target.value

                    })
                  }

                />


              </div>



              <div className="campo-perfil">

                <label>
                  Precio por hora
                </label>


                <input

                  type="number"

                  value={
                    professional.pricePerHour
                  }

                  onChange={(e)=>
                    setProfessional({

                      ...professional,

                      pricePerHour:
                        Number(
                          e.target.value
                        )

                    })
                  }

                />


              </div>

              <div className="campo-perfil">

                <label>
                  Medios de contacto
                </label>

                {

                  professional.contacts.map((contact,index)=>(

                    <div
                      key={index}
                      className="professional-contact-row"
                    >

                      <select

                        value={contact.type}

                        onChange={(e)=>{

                          const contacts=[...professional.contacts];

                          contacts[index].type=e.target.value;

                          setProfessional({

                            ...professional,

                            contacts,

                          });

                        }}

                      >

                        <option value="">
                          Seleccionar...
                        </option>

                        <option value="WhatsApp">
                          WhatsApp
                        </option>

                        <option value="Telegram">
                          Telegram
                        </option>

                        <option value="Discord">
                          Discord
                        </option>

                        <option value="Instagram">
                          Instagram
                        </option>

                        <option value="Facebook">
                          Facebook
                        </option>

                        <option value="Correo">
                          Correo
                        </option>

                        <option value="Otro">
                          Otro
                        </option>

                      </select>


                      <input

                        placeholder="Usuario o enlace"

                        value={contact.value}

                        onChange={(e)=>{

                          const contacts=[...professional.contacts];

                          contacts[index].value=e.target.value;

                          setProfessional({

                            ...professional,

                            contacts,

                          });

                        }}

                      />


                      <button

                        type="button"

                        onClick={()=>{

                          const contacts=
                            professional.contacts.filter(
                              (_,i)=>i!==index
                            );

                          setProfessional({

                            ...professional,

                            contacts,

                          });

                        }}

                      >

                        Eliminar

                      </button>

                    </div>

                  ))

                }


                <button

                  type="button"

                  className="btn-guardar"

                  onClick={() => {
                    setProfessional({
                      ...professional,
                      contacts: [
                        ...professional.contacts,

                        {
                          id: 0,
                          type: "",
                          value: "",
                        }
                      ],
                    });
                  }}
                >
                  + Agregar contacto
                </button>

              </div>

              


              <div className="guardar-action">

                <button

                  className="btn-guardar"

                  onClick={
                    updateProfessional
                  }

                >

                  Guardar datos profesionales

                </button>

                {
                  saveStatus?.key === "professional" && (
                    <SaveStatusIcon
                      key={saveStatus.token}
                      status={saveStatus.status}
                      onDone={()=>setSaveStatus(null)}
                    />
                  )
                }

              </div>




              {
                professional.active ?

                <button

                  className="btn-guardar"

                  onClick={
                    deactivateProfessional
                  }

                >

                  Desactivar funciones profesionales

                </button>


                :


                <button

                  className="btn-guardar"

                  onClick={
                    reactivateProfessional
                  }

                >

                  Reactivar cuenta profesional

                </button>

              }


            </>



            :


            professionalRequest ?


            <p>
              Solicitud pendiente de revisión.
            </p>


            :


            <button

              className="btn-guardar"

              onClick={()=>
                setProfessionalModal(true)
              }

            >

              ¿Quieres ser uno de nuestros especialistas?

            </button>


          }


        </div>


      </div>


    </main>
        {
      professionalModal && (

        <div className="av-overlay open">

          <div className="av-modal">


            <div className="av-modal-header">

              <span className="av-modal-title">
                Solicitar cuenta profesional
              </span>


              <button

                className="av-modal-close"

                onClick={()=>
                  setProfessionalModal(false)
                }

              >
                ✕
              </button>


            </div>



            <p className="av-modal-sub">

              Cuéntanos qué tipo de especialista eres.

            </p>




            <div className="campo-perfil">

              <label>
                Profesión
              </label>


              <input

                value={
                  professionalForm.profession
                }

                onChange={(e)=>
                  setProfessionalForm({

                    ...professionalForm,

                    profession:
                      e.target.value

                  })
                }

                placeholder="Ej: Psicólogo"

              />


            </div>



            <div className="campo-perfil">

              <label>
                Descripción
              </label>


              <textarea

                rows={5}

                value={
                  professionalForm.message
                }

                onChange={(e)=>
                  setProfessionalForm({

                    ...professionalForm,

                    message:
                      e.target.value

                  })
                }

                placeholder="Describe tu experiencia..."

              />


            </div>




            <button

              className="av-select-btn"

              onClick={
                sendProfessionalRequest
              }

            >

              Enviar solicitud

            </button>



          </div>

        </div>

      )
    }




    {
      modalOpen && (

        <div className="av-overlay open">

          <div className="av-modal">


            <div className="av-modal-header">


              <span className="av-modal-title">
                Elige tu avatar
              </span>



              <button

                className="av-modal-close"

                onClick={
                  closeModal
                }

              >
                ✕
              </button>


            </div>



            <p className="av-modal-sub">

              Selecciona un avatar predeterminado.

            </p>




            <div className="av-grid">


              {
                PRESET_AVATARS.map(
                  (avatar,index)=>(

                    <div

                      key={index}

                      className={
                        `av-item ${
                          tempPreset === index
                          ?
                          "sel"
                          :
                          ""
                        }`
                      }


                      onClick={()=>
                        setTempPreset(index)
                      }

                    >


                      <img

                        src={avatar}

                        alt={
                          `Avatar ${index + 1}`
                        }

                        className="avatar-option"

                      />


                    </div>


                  )
                )
              }



            </div>




            <button

              className="av-select-btn"

              onClick={
                confirmPreset
              }

            >

              Usar este avatar

            </button>



          </div>

        </div>

      )
    }




    <Footer />


  </>
);
}