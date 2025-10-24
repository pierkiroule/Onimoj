import { useState } from "react"
import PropTypes from "prop-types"
import "./ModuleInuitStep.css"
import Video from "./Video"
import videoMeta from "../data/videoMeta.json"

export default function ModuleInuitStep({ step = {} }) {
  const {
    spirit_name = "",
    symbol = "",
    title = "",
    text = "",
    ritual = "",
    step_number,
  } = step || {}

  const [openVideo, setOpenVideo] = useState(false)
  const [videoSrc, setVideoSrc] = useState("")
  const [selectedMeta, setSelectedMeta] = useState(null)
  const [userTags, setUserTags] = useState("")
  const [showTagForm, setShowTagForm] = useState(false)

  // 🎬 Lecture vidéo onirique
  const handleVideoClick = async (meta) => {
    try {
      const videoFile = await import(`../assets/video/${meta.file}`)
      setVideoSrc(videoFile.default)
      setSelectedMeta(meta)
      setOpenVideo(true)
      setShowTagForm(false)
    } catch {
      console.warn(`⚠️ Vidéo introuvable : ${meta.file}`)
    }
  }

  // 🪶 Ajout d’un mot-clé de résonance
  const handleAddTag = () => {
    if (!userTags.trim()) return
    console.log("✨ Résonance ajoutée :", userTags)
    setUserTags("")
    setShowTagForm(false)
  }

  return (
    <section className="module-inuit fade-in">
      {/* 🌙 En-tête */}
      <header className="module-inuit__header">
        <div className="module-inuit__step">Étape {step_number || "—"}</div>
        <h3 className="module-inuit__title">
          {spirit_name} {symbol}
        </h3>
        {title && <div className="module-inuit__theme">« {title} »</div>}
      </header>

      {/* 🧭 Description + rituel */}
      {text && <p className="module-inuit__description">{text}</p>}

      {ritual && (
        <div className="module-inuit__block">
          <div className="module-inuit__label">🌙 Rituel du soir</div>
          <p className="module-inuit__content">{ritual}</p>
        </div>
      )}

      {/* 🌌 Galerie onirique */}
      <div className="dream-gallery">
        {videoMeta.map((meta, i) => (
          <div
            key={i}
            className="dream-card"
            onClick={() => handleVideoClick(meta)}
          >
            <video
              src={new URL(`../assets/video/${meta.file}`, import.meta.url).href}
              className="dream-thumb"
              muted
              loop
              autoPlay
              playsInline
            />
            <div className="dream-caption">
              <h4>{meta.title}</h4>
              <p>{meta.legend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🎥 Modale vidéo */}
      {openVideo && selectedMeta && (
        <Video
          open={openVideo}
          onClose={() => {
            setOpenVideo(false)
            setShowTagForm(true)
          }}
          src={videoSrc}
          title={selectedMeta.title}
          legend={selectedMeta.legend}
        />
      )}

      {/* ✍️ Carnet de résonance */}
      {showTagForm && (
        <div className="dream-tag-form fade-in">
          <p>🪶 Que t’inspire ce rêve ?</p>
          <input
            type="text"
            placeholder="Un mot, une image, une sensation..."
            value={userTags}
            onChange={(e) => setUserTags(e.target.value)}
            className="dream-input"
          />
          <button className="dream-btn" onClick={handleAddTag}>
            ✨ Ajouter au carnet
          </button>
        </div>
      )}
    </section>
  )
}

ModuleInuitStep.propTypes = {
  step: PropTypes.object,
}