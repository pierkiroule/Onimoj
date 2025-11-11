export const btnPrimary = {
  marginTop: "1rem",
  padding: ".65rem 1.4rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(100deg, #7fffd4, #6a5acd)",
  color: "#0a0a0a",
  fontWeight: "700",
  letterSpacing: "0.03em",
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(127,255,212,0.25)",
  transition: "all 0.25s ease",
  outline: "none",
}

export const btnGhost = {
  padding: ".55rem 1.2rem",
  borderRadius: "12px",
  border: "1px solid rgba(127,255,212,.45)",
  background: "rgba(127,255,212,.08)",
  color: "#aefcf5",
  fontWeight: "600",
  letterSpacing: "0.02em",
  cursor: "pointer",
  boxShadow: "0 0 8px rgba(127,255,212,0.15)",
  transition: "all 0.25s ease",
  outline: "none",
}

/* --- Petites animations globales --- */
export const buttonHoverStyles = `
  button:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 3px 12px rgba(127,255,212,0.4);
  }
  button:active {
    transform: scale(0.98);
    box-shadow: 0 0 6px rgba(127,255,212,0.3);
  }
`