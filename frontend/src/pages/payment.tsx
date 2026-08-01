import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    async function capturePayment() {
      const orderId = params.get("token");
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/professionals/capture/${orderId}`,
          {
            method: "POST",
            headers:{
              Authorization: `Bearer ${token}`,
              "Content-Type":"application/json"
            },
            body: JSON.stringify({})
          }
        );

        const data = await response.json();

        console.log("CAPTURE RESPONSE:", response.status, data);

        if(response.ok){
        setSuccess(true);
        }} 
        catch(error){
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    capturePayment();
  }, []);
  if(loading){
    return (
      <main>
        <h1>Validando pago...</h1>
      </main>
    );
  }
  if(success){
    return (
      <main>
        <h1>Pago confirmado</h1>
        <p>Ya tienes acceso al profesional.</p>

        <button
          onClick={() => navigate("/")}
        >
          Continuar
        </button>

      </main>
    );
  }
  return (
    <main>
      <h1>Error procesando pago</h1>
    </main>
  );

}