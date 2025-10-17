import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import InuitVoyage from './pages/InuitVoyage'
import NavBar from './shared/NavBar'
import Compte from './pages/Compte'
import Atlas from './pages/Atlas'
import Dreamteam from './pages/Dreamteam'

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voyage/inuit" element={<InuitVoyage />} />
        <Route path="/compte" element={<Compte />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/dreamteam" element={<Dreamteam />} />
      </Routes>
    </div>
  )
}

export default App
