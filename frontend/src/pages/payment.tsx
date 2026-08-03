import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import '../styles/payment.css';

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
      <main className="payment-page loading">
        <h1>Validando pago...</h1>
      </main>
    );
  }

  if(success){
    return (
      <main className="payment-page success">
        <div className="icon-circle success-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
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
    <main className="payment-page error">
      <div className="icon-circle error-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1>Error procesando pago</h1>
    </main>
  );

}