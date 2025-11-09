export default function MeteoOnirique({ meteo, onRefresh }) {
  return (
    <div
      style={{
        background: "rgba(0,25,35,0.4)",
        border: "1px solid rgba(127,255,212,0.3)",
        borderRadius: "12px",
        padding: "0.6rem 1rem",
        margin: "1rem auto",
        display: "inline-block",
      }}
    >
      <p style={{ margin: 0 }}>
        {meteo.emoji} <b>Météo onirique :</b> {meteo.humeur}
      </p>
      <p style={{ fontSize: ".8rem", opacity: 0.8 }}>
        {meteo.mots} mots reliés • fréquence moyenne {meteo.avgFreq}
      </p>
      <button
        onClick={onRefresh}
        style={{
          border: "1px solid rgba(127,255,212,.4)",
          background: "transparent",
          borderRadius: "6px",
          padding: ".3rem .7rem",
          color: "#7fffd4",
          fontSize: ".8rem",
          cursor: "pointer",
        }}
      >
        🔄 Rafraîchir
      </button>
    </div>
  )
}