import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/playful-tokens.css'
import './styles/playful-global.css'
import './styles/playful-primitives.css'
import './styles/playful-shell.css'
import './styles/playful-pages.css'
import './styles/playful-motion.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
