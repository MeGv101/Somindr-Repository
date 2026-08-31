import ReactDOM from 'react-dom/client'
import App from './app'
import './styles/theme.css'
import './styles/index.css'
import { ThemeProvider } from './context/themeContext'
import { AuthProvider } from './context/authContext'
import { ModalProvider } from './context/modelContext'



ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <ThemeProvider>
    <AuthProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AuthProvider>
  </ThemeProvider>
)