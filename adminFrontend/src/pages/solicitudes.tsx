import { useEffect, useState } from "react";


interface ProfessionalRequest {

  id:number;

  userId:number;

  profession:string;

  message:string;

  status:string;

  createdAt:string;

}

interface RequestDetails {

  id:number;

  userId:number;

  profession:string;

  message:string;

  status:string;

  createdAt:string;

  adminComment:string | null;

}

export default function Solicitudes(){

  const [loading,setLoading]=
    useState(true);

  const [requests,setRequests]=
    useState<ProfessionalRequest[]>([]);

  const [selected,setSelected]=
    useState<RequestDetails | null>(null);

  const [rejectModal,setRejectModal]=
    useState(false);

  const [comment,setComment]=
    useState("");

  useEffect(()=>{

    loadRequests();

  },[]);

  async function loadRequests(){

    try{

      const token=
        localStorage.getItem("token");

      const response=
        await fetch(
          "/api/admin/professional-requests",
          {
            headers:{
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if(!response.ok){
        throw new Error();
      }

      setRequests(
        await response.json()
      );

    }

    catch(error){

      console.error(error);

    }

    finally{

      setLoading(false);

    }

  }

  async function viewRequest(
    id:number
  ){

    try{

      const token=
        localStorage.getItem("token");

      const response=
        await fetch(
          `/api/admin/professional-requests/${id}`,
          {
            headers:{
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if(!response.ok){
        return;
      }

      setSelected(
        await response.json()
      );

    }

    catch(error){

      console.error(error);

    }

  }

  async function approve(){

    if(!selected){
      return;
    }

    try{

      const token=
        localStorage.getItem("token");

      const response=
        await fetch(

          `/api/admin/professional-requests/${selected.id}/approve`,

          {

            method:"PATCH",

            headers:{
              Authorization:
                `Bearer ${token}`
            }

          }

        );

      if(!response.ok){

        alert(
          "No se pudo aprobar."
        );

        return;

      }

      alert(
        "Solicitud aprobada."
      );

      setSelected(null);

      loadRequests();

    }

    catch(error){

      console.error(error);

    }

  }

  async function reject(){

    if(!selected){
      return;
    }

    try{

      const token=
        localStorage.getItem("token");

      const response=
        await fetch(

          `/api/admin/professional-requests/${selected.id}/reject`,

          {

            method:"PATCH",

            headers:{

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body:JSON.stringify({

              adminComment:
                comment

            })

          }

        );

      if(!response.ok){

        alert(
          "No se pudo rechazar."
        );

        return;

      }

      alert(
        "Solicitud rechazada."
      );

      setRejectModal(false);

      setSelected(null);

      setComment("");

      loadRequests();

    }

    catch(error){

      console.error(error);

    }

  }

  return(

    <>


      <main className="admin-page">

        <h1>
          Solicitudes de profesionales
        </h1>

        {

          loading ?

          <p>
            Cargando...
          </p>

          :

          requests.length===0 ?

          <p>
            No hay solicitudes pendientes.
          </p>

          :

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Profesión
                </th>

                <th>
                  Estado
                </th>

                <th>
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {

                requests.map(request=>(

                  <tr key={request.id}>

                    <td>
                      {request.userId}
                    </td>

                    <td>
                      {request.profession}
                    </td>

                    <td>
                      {request.status}
                    </td>

                    <td>

                      <button
                        onClick={()=>
                          viewRequest(
                            request.id
                          )
                        }
                      >

                        Ver

                      </button>

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        }

        {

          selected &&

          <div className="admin-modal">

            <div className="admin-modal-content">

              <h2>
                Solicitud
              </h2>

              <p>

                <strong>
                  Profesión:
                </strong>

                {" "}

                {selected.profession}

              </p>

              <p>

                <strong>
                  Descripción:
                </strong>

              </p>

              <p>
                {selected.message}
              </p>

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"20px"
                }}
              >

                <button
                  onClick={approve}
                >
                  Aprobar
                </button>

                <button
                  onClick={()=>
                    setRejectModal(true)
                  }
                >
                  Rechazar
                </button>

                <button
                  onClick={()=>
                    setSelected(null)
                  }
                >
                  Cerrar
                </button>

              </div>

            </div>

          </div>

        }

        {

          rejectModal &&

          <div className="admin-modal">

            <div className="admin-modal-content">

              <h2>
                Motivo del rechazo
              </h2>

              <textarea

                rows={6}

                value={comment}

                onChange={(e)=>
                  setComment(
                    e.target.value
                  )
                }

              />

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"20px"
                }}
              >

                <button
                  onClick={reject}
                >
                  Confirmar rechazo
                </button>

                <button
                  onClick={()=>
                    setRejectModal(false)
                  }
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        }

      </main>

    </>

  );

}