import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Use the comprehensive translation file (includes Arabic)
import './i18n-complete' // استيراد ملف الترجمة المكتمل (English + Arabic)
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)