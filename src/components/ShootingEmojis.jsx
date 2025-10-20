import { useEffect, useRef, useState } from "react";

const EMOJIS = ['🌙','💫','⭐','🌕','🌈','🪐','☄️','🌠','✨'];

export default function ShootingEmojis({ onCatch }) {
  const [stars, setStars] = useState([]);
  const rafRef = useRef(0);

  // 🌌 Apparition régulière des étoiles
  useEffect(() => {
    const spawn = setInterval(() => {
      const newStar = {
        id: Date.now(),
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        top: Math.random() * 70 + 10,
        left: -50,
        size: Math.random() * 1.4 + 1.2,
        speed: Math.random() * 2.2 + 1.2,
        glow: Math.random() > 0.5,
      };
      setStars((s) => [...s.slice(-10), newStar]);
    }, 800); // apparition un peu plus rythmée
    return () => clearInterval(spawn);
  }, []);

  // 🌬️ Mouvement horizontal fluide via requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setStars((s) =>
        s
          .map((star) => ({
            ...star,
            left: (star.left || 0) + star.speed,
          }))
          .filter((star) => (star.left || 0) < window.innerWidth + 80)
      );
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // 🌟 Capture d’une étoile
  const handleCatch = (id, emoji) => {
    onCatch(emoji);
    // effet de disparition rapide
    setStars((s) =>
      s.map((st) =>
        st.id === id ? { ...st, caught: true, scale: 1.6 } : st
      )
    );
    setTimeout(() => setStars((s) => s.filter((st) => st.id !== id)), 300);
  };

  return (
    <>
      {stars.map((star) => (
        <button
          key={star.id}
          onClick={() => handleCatch(star.id, star.emoji)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCatch(star.id, star.emoji);
            }
          }}
          aria-label={`Attraper ${star.emoji}`}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}px`,
            fontSize: `${star.size}rem`,
            cursor: "pointer",
            userSelect: "none",
            transform: star.caught ? "scale(1.8)" : "scale(1)",
            opacity: star.caught ? 0 : 1,
            transition: "transform 0.3s ease, opacity 0.4s ease",
            filter: star.glow
              ? "drop-shadow(0 0 8px rgba(180,220,255,0.9))"
              : "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
            background: 'transparent',
            border: 'none',
            lineHeight: 1,
            padding: 0,
            color: 'inherit',
          }}
        >
          {star.emoji}
        </button>
      ))}
    </>
  );
}