import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './styles/index.css'
import { AuthProvider } from './context/authContext'

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)