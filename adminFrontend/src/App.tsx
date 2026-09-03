import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/authContext";

import ProtectedRoute from "./components/ProtectedRoutes";

import AdminLayout from "./layouts/layout";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Users from "./pages/users";
import Solicitudes from "./pages/solicitudes";
import Moderacion from "./pages/moderacion";
import Reportes from "./pages/reportes";

export default function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            element={<ProtectedRoute />}
          >

            <Route
              path="/"
              element={<AdminLayout />}
            >

              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="users"
                element={<Users />}
              />

              <Route
                path="solicitudes"
                element={<Solicitudes />}
              />

              <Route
                path="moderacion"
                element={<Moderacion />}
              />

              <Route
                path="reportes"
                element={<Reportes />}
              />

            </Route>

          </Route>

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  );

}