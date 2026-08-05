import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/authContext.js";

export default function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth();

  if (loading) {

    return (
      <h2
        style={{
          color: "white",
          padding: "40px",
        }}
      >
        Cargando...
      </h2>
    );

  }

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return <Outlet />;

}