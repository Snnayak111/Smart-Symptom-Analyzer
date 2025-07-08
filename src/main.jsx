import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle.js'
import AiContextProvider from './context/AIContext.jsx'
import ProfileContextProvider from './context/ProfileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProfileContextProvider>
        <AiContextProvider>
          <GlobalStyle />
          <App />
        </AiContextProvider>
      </ProfileContextProvider>
    </BrowserRouter>
  </StrictMode>
)
