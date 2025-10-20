import { useEffect, useState } from "react";

export default function DreamGate({ onEnter }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("🌠 La DreamGate s’ouvre...");

  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(true);
      setMsg("🌌 Tu es prêt à entrer dans le CosmoDream.");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="dreamgate fade-in">
      <div className={`gate-circle ${open ? "open" : ""}`}>
        <div className="halo"></div>
        <div className="symbol">🪐</div>
      </div>

      <h2 className="title">DreamGate</h2>
      <p className="subtitle">{msg}</p>

      {open && (
        <button className="enter-btn" onClick={onEnter}>
          🚀 Entrer dans le CosmoDream
        </button>
      )}
    </div>
  );
}