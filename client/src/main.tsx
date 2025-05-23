import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/navbar-style.css'
import './styles/main-content-view.css'
import './styles/categories.css'
import './styles/info-card.css'
import './styles/click-scroller.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
