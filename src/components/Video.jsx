import PropTypes from "prop-types"
import "./Video.css"

export default function Video({ open, onClose, src, title, legend }) {
  if (!open) return null

  return (
    <div className="video-overlay" onClick={onClose}>
      <div className="video-container" onClick={(e) => e.stopPropagation()}>
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="dream-video"
        />
        <h3 className="video-title">{title}</h3>
        <p className="video-legend">{legend}</p>
        <button className="close-btn" onClick={onClose}>
          ✖ Fermer
        </button>
      </div>
    </div>
  )
}

Video.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  src: PropTypes.string,
  title: PropTypes.string,
  legend: PropTypes.string,
}