import { useRef , useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/navbar'

import ModalAuth, { type ModalAuthRef } from './components/modal-auth'

import Index from './pages/index'

import Perfil from './pages/perfil'

import Comunidad from './pages/comunidad'

import AboutUs from './pages/aboutus'

import Professionals from './pages/professionals'

import Clients from './pages/clients'

import ClientDashboard from './pages/client-dashboard'

import PsicoEmocional from './pages/psicoemocional'

import Fitness from './pages/fitness'

import NotFound from "./pages/notFound";

import type { AuthTab } from './types/auth'


import ProtectedRoute from './components/protected'

import { useModal } from "./context/modelContext";

import AI from "./pages/ai";

import Verificacion from "./pages/verificacion";

import Profiles from "./pages/profiles";

import PaymentSuccess from "./pages/payment";

import LanguageSwitcher from './components/LanguageSwitcher'

function App() {

  console.log("App cargado");
  
  const modalRef = useRef<ModalAuthRef>(null)

  const {
    authMessage,
    setAuthMessage,
  } = useModal();

  useEffect(() => {
    if (authMessage) {
      modalRef.current?.mostrarError(
        authMessage
      );

      setAuthMessage(null);
    }
  }, [authMessage]);
  const openAuth = (tab: AuthTab = 'login') => {

    modalRef.current?.mostrarModal(tab)

  }

  return (

    <BrowserRouter>

      <Navbar onOpenAuth={openAuth} />

      <LanguageSwitcher />

      <ModalAuth ref={modalRef} />

      <Routes>
        <Route path="/" element={<Index onOpenAuth={openAuth} />} />

        <Route
          path="/profile/configuration"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/psicoemocional"
          element={
            <ProtectedRoute>
              <PsicoEmocional />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fitness"
          element={
            <ProtectedRoute>
              <Fitness />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
  
              <Verificacion />
            
          }
        />

        <Route
          path="/comunidad"
          element={
            <ProtectedRoute>
              <Comunidad />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil/:username"
          element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          }
        />

        <Route
        path="/payment/success"
        element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
        }
        />

        <Route
          path="/professionals/me"
          element={
            <ProtectedRoute>
              <Professionals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/me"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aboutus"
          element={
            <AboutUs />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>

  )

}



export default App