import { useEffect, useState, useRef } from "react";
import inuitData from "../data/inuit.json";
import "./HublotOnirique.css";

export default function HublotOnirique({ step, onComplete, userId }) {
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!step) return;
    const esprit = inuitData.esprits.find(e => e.id === step.step_number);
    if (!esprit) return;

    // 12 emojis + 12 tags
    const all = [
      ...esprit.emojis.slice(0, 12).map(e => ({ type: "emoji", value: e })),
      ...esprit.tags.slice(0, 12).map(t => ({ type: "tag", value: t }))
    ];
    // Positions aléatoires dans un cercle
    setNodes(
      all.map(item => ({
        ...item,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      }))
    );
  }, [step]);

  // Animation douce + rebonds
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const animate = () => {
      ctx.clearRect(0, 0, 300, 300);
      ctx.save();
      ctx.translate(150, 150);
      for (let n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        const r = Math.sqrt(n.x ** 2 + n.y ** 2);
        if (r > 120) {
          n.vx *= -1;
          n.vy *= -1;
        }

        // Dessin
        ctx.fillStyle = selected.includes(n.value)
          ? "rgba(110,255,140,0.9)"
          : "rgba(180,255,250,0.7)";
        ctx.font = n.type === "emoji" ? "22px serif" : "12px Poppins";
        ctx.textAlign = "center";
        ctx.fillText(n.value, n.x, n.y);
      }
      ctx.restore();

      // Si 6 sélectionnés → tracer l’étoile
      if (selected.length === 6) {
        ctx.save();
        ctx.translate(150, 150);
        ctx.strokeStyle = "#6eff8d";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        selected.forEach((v, i) => {
          const n = nodes.find(nd => nd.value === v);
          if (i === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };
    animate();
  }, [nodes, selected]);

  // Clic : choisir
  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 150;
    const clicked = nodes.find(
      n => Math.hypot(n.x - x, n.y - y) < (n.type === "emoji" ? 15 : 25)
    );
    if (clicked && !selected.includes(clicked.value) && selected.length < 6)
      setSelected([...selected, clicked.value]);
    else if (selected.length === 6) onComplete(selected);
  };

  return (
    <div className="hublot-container">
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        onClick={handleClick}
        className="hublot-canvas"
      />
      <p style={{ opacity: 0.7 }}>
        {selected.length < 6
          ? `Choisis ${6 - selected.length} éléments...`
          : "🌟 Étoile tissée !"}
      </p>
    </div>
  );
}