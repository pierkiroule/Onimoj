import { useEffect, useState } from "react"
import { assetUrl } from "../utils/assetUrl"
import "./MissionInuiteEditor.css"

export default function MissionInuiteEditor() {
  const [mission, setMission] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("")

  // 📥 Charge le fichier mission.json
  useEffect(() => {
    fetch(assetUrl("/data/missions/inuite/mission.json"))
      .then((res) => res.json())
      .then(setMission)
      .catch((err) => setStatus("Erreur de chargement : " + err.message))
  }, [])

  // 📖 Charge le fichier de l’étape sélectionnée
  async function loadStep(stepFile) {
    try {
      const res = await fetch(assetUrl(`/data/missions/inuite/${stepFile}`))
      const text = await res.text()
      setContent(text)
      setSelectedStep(stepFile)
      setStatus(`✅ Fichier chargé : ${stepFile}`)
    } catch (err) {
      setStatus("⚠️ Erreur de lecture : " + err.message)
    }
  }

  // 💾 Sauvegarde dans localStorage (simulation d'édition locale)
  function saveLocal() {
    if (!selectedStep) return
    localStorage.setItem(selectedStep, content)
    setStatus("💾 Modifications enregistrées localement.")
  }

  // 🔄 Recharge la version originale depuis /data/
  function reloadOriginal() {
    if (!selectedStep) return
    loadStep(selectedStep)
  }

  return (
    <div className="editor-page">
      <h2>🧊 Éditeur de Mission Inuite</h2>
      {status && <p className="status">{status}</p>}

      {!mission && <p>Chargement de la mission...</p>}

      {mission && (
        <div className="editor-grid">
          {/* 📜 Liste des étapes */}
          <div className="panel">
            <h3>Étapes</h3>
            <ul className="steps-list">
              {mission.steps.map((s, i) => (
                <li
                  key={i}
                  className={`step-item ${
                    selectedStep === s.file ? "active" : ""
                  }`}
                  onClick={() => loadStep(s.file)}
                >
                  {s.file.replace("./steps/", "").replace(".json", "")}
                </li>
              ))}
            </ul>
          </div>

          {/* ✏️ Éditeur */}
          <div className="panel">
            {selectedStep ? (
              <>
                <h3>Édition : {selectedStep}</h3>
                <textarea
                  className="json-editor"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="editor-buttons">
                  <button onClick={saveLocal} className="btn-primary">
                    💾 Sauvegarder localement
                  </button>
                  <button onClick={reloadOriginal} className="btn-secondary">
                    ↻ Recharger
                  </button>
                </div>
              </>
            ) : (
              <p className="hint">Sélectionne un fichier à gauche pour éditer.</p>
            )}
          </div>
        </div>
      )}

      <div className="editor-footer">
        <p>
          Les fichiers sont chargés depuis <code>/data/missions/inuite/</code> et
          les modifications sont enregistrées dans <code>localStorage</code>.
        </p>
        <p style={{ opacity: 0.7 }}>
          (Tu pourras plus tard ajouter un bouton “Exporter” pour enregistrer
          définitivement sur disque ou Supabase.)
        </p>
      </div>
    </div>
  )
}