import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom' // ← Importar aquí
import App from './App'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* ← Mover Router aquí */}
      <App />
    </Router>
  </React.StrictMode>
)