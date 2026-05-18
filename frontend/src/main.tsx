import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Index from './pages'
import Perfil from './pages/perfil'


ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  </BrowserRouter>
)