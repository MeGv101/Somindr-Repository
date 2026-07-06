import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './styles/index.css'
import { AuthProvider } from './context/authContext'
import { ModalProvider } from './context/modelContext'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <AuthProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </AuthProvider>
)