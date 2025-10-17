import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import InuitVoyage from './pages/InuitVoyage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voyage/inuit" element={<InuitVoyage />} />
    </Routes>
  )
}

export default App
