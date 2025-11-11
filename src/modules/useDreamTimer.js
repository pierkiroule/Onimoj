// src/modules/useDreamTimer.js
import { useState, useEffect } from "react"

/**
 * 🕰️ Hook : Gestion du sablier de rêve (blocage 12 h)
 * - Stocke le dernier rêve dans localStorage
 * - Calcule le temps restant avant prochain rêve
 * - Fournit formatage et réinitialisation
 */
export function useDreamTimer(delayHours = 12) {
  const DELAY = delayHours * 60 * 60 * 1000
  const [remaining, setRemaining] = useState(0)

  // 🔄 Au montage : vérifie si un rêve est encore "en sommeil"
  useEffect(() => {
    const last = parseInt(localStorage.getItem("lastDreamTime") || "0")
    const diff = DELAY - (Date.now() - last)
    if (diff > 0) setRemaining(diff)
  }, [])

  // ⏱️ Décrémentation 1s
  useEffect(() => {
    if (!remaining) return
    const t = setInterval(() => {
      setRemaining(r => (r > 1000 ? r - 1000 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [remaining])

  // 🧮 Format temps HH:MM:SS
  function format(ms) {
    const s = Math.floor(ms / 1000)
    const h = String(Math.floor(s / 3600)).padStart(2, "0")
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
    const sec = String(s % 60).padStart(2, "0")
    return `${h}:${m}:${sec}`
  }

  // 🧭 Marque le rêve actuel comme "fait" → bloque pour 12 h
  function setDreamTimestamp() {
    const now = Date.now()
    localStorage.setItem("lastDreamTime", now.toString())
    setRemaining(DELAY)
  }

  // 🔁 Réinitialise manuellement (ex. admin/dev)
  function resetTimer() {
    localStorage.removeItem("lastDreamTime")
    setRemaining(0)
  }

  return {
    remaining,
    setRemaining,
    format,
    setDreamTimestamp,
    resetTimer,
    DELAY,
  }
}