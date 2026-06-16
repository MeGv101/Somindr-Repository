import { useRef , useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/navbar'

import ModalAuth, { type ModalAuthRef } from './components/modal-auth'

import Index from './pages/index'

import Perfil from './pages/perfil'

import PsicoEmocional from './pages/psicoemocional'

import Fitness from './pages/fitness'

import type { AuthTab } from './types/auth'

import ProtectedRoute from './components/protected'

import { useModal } from "./context/modelContext";


function App() {

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

      <ModalAuth ref={modalRef} />

      <Routes>

        <Route path="/" element={<Index onOpenAuth={openAuth} />} />

        <Route
          path="/perfil"
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

      </Routes>

    </BrowserRouter>

  )

}



export default App

