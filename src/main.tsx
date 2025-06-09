import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { CurrencyProvider } from './context/CurrencyContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrencyProvider>
    <App />
    </CurrencyProvider>
  </React.StrictMode>,
)
