import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SavedPostsProvider } from './context/SavedPostsContext.jsx'
import { CounselorAuthProvider } from './context/CounselorAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CounselorAuthProvider>
            <ToastProvider>
              <SavedPostsProvider>
                <App />
              </SavedPostsProvider>
            </ToastProvider>
          </CounselorAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
