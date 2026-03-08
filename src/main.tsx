import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Usar requestIdleCallback para renderizar cuando el navegador esté inactivo
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
} else {
  // Fallback para navegadores que no soportan requestIdleCallback
  setTimeout(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }, 1)
}
