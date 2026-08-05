import { useEffect, useState } from "react";

type DashboardData = {
  totalUsers: number;
  totalProfessionals: number;
};

export default function Dashboard() {

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error(
          "No autorizado."
        );
      }

      const data =
        await response.json();

      setDashboard(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (

    <main
      style={{
        padding: "40px",
        color: "white",
      }}
    >

      <h1>Panel de Administración</h1>

      <br />

      <h2>
        Usuarios:
        {" "}
        {dashboard?.totalUsers}
      </h2>

      <h2>
        Profesionales:
        {" "}
        {dashboard?.totalProfessionals}
      </h2>

    </main>

  );

}