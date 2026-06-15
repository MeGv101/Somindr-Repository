import { useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import ModalAuth, { type ModalAuthRef } from './components/modal-auth'
import Index from './pages/index'
import Perfil from './pages/perfil'
import PsicoEmocional from './pages/psicoemocional'
import Fitness from './pages/fitness'
import type { AuthTab } from './types/auth'

function App() {
  const modalRef = useRef<ModalAuthRef>(null)

  const openAuth = (tab: AuthTab = 'login') => {
    modalRef.current?.mostrarModal(tab)
  }

  return (
    <BrowserRouter>
      <Navbar onOpenAuth={openAuth} />
      <ModalAuth ref={modalRef} />
      <Routes>
        <Route path="/" element={<Index onOpenAuth={openAuth} />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/psicoemocional" element={<PsicoEmocional />} />
        <Route path="/fitness" element={<Fitness />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
