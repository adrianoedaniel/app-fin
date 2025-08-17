import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transacoes from './components/Transacoes'
import CDBs from './components/CDBs'
import Metas from './components/Metas'
import Relatorios from './components/Relatorios'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/cdbs" element={<CDBs />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
