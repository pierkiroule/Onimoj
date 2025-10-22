import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Notifications({ session }) {
  const user = session?.user
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [bubbles, setBubbles] = useState([])

  // 🔔 Charger les ressources
  useEffect(() => {
    if (!user) return
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("echoressources")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)
      if (error) console.error("Erreur notifications:", error.message)
      else {
        setNotifications(data || [])
        setUnreadCount(data?.filter((n) => n.visible)?.length || 0)
        spawnBubbles()
      }
    }
    fetchNotifications()
  }, [user])

  // ✅ Archiver les anciennes visibles
  async function archiveOldNotifications() {
    const visibles = notifications.filter((n) => n.visible)
    if (!visibles.length) return
    const ids = visibles.map((n) => n.id)
    await supabase
      .from("echoressources")
      .update({ visible: false, user_read: true })
      .in("id", ids)
  }

  // 🌕 Ouvrir / Fermer
  function openModal() {
    if (!showModal && unreadCount > 0) archiveOldNotifications()
    setShowModal(true)
  }
  function closeModal() {
    setShowModal(false)
    setExpanded(null)
  }

  // 🌬️ Bulles animées décoratives (autour de la cloche)
  function spawnBubbles() {
    const newBubbles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 10,
      duration: 3 + Math.random() * 4,
    }))
    setBubbles(newBubbles)
    setTimeout(() => setBubbles([]), 6000)
  }

  if (!user) return null

  return (
    <>
      {/* 🔔 Cloche fixe */}
      <div
        onClick={openModal}
        style={{
          position: "fixed",
          top: "22px",
          right: "22px",
          background: "white",
          color: "#000",
          borderRadius: "50%",
          width: "54px",
          height: "54px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 0 18px rgba(255,255,255,0.6)",
          zIndex: 2000,
        }}
        title="Voir les Rêvonances"
      >
        <span style={{ fontSize: "24px" }}>🔔</span>
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            background: unreadCount > 0 ? "#e74c3c" : "#888",
            color: "#fff",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {unreadCount}
        </div>
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              bottom: "0px",
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
              animation: `floatBubble ${b.duration}s ease-in-out infinite`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* 🌌 MODALE scrollable */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2100,
          }}
        >
          <div
            style={{
              background: "#101020",
              borderRadius: "14px",
              padding: "1.4rem",
              width: "90%",
              maxWidth: "480px",
              boxShadow: "0 0 25px rgba(127,255,212,0.3)",
              color: "#fff",
              textAlign: "center",
              animation: "fadeIn 0.4s ease-out",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#7fffd4", marginBottom: "1rem" }}>💫 ÉchoRessources</h3>

            {notifications.length === 0 ? (
              <p style={{ opacity: 0.7 }}>Aucune ÉchoRessource 🌙</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                  style={{
                    background: expanded === n.id ? "#1f2b68" : "#273469",
                    borderRadius: "50px",
                    padding: expanded === n.id ? "1.4rem" : "1rem",
                    margin: "0.6rem auto",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    boxShadow:
                      expanded === n.id
                        ? "0 0 18px rgba(127,255,212,0.4)"
                        : "0 0 10px rgba(127,255,212,0.15)",
                    transform: expanded === n.id ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <p style={{ fontWeight: "bold", color: "#7fffd4", marginBottom: "0.4rem" }}>
                    {n.titre}
                  </p>

                  {expanded === n.id && (
                    <>
                      <p style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "0.4rem" }}>
                        {n.description || "Aucune description."}
                      </p>
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "0.3rem",
                          color: "#fff",
                          background: "#7fffd4",
                          padding: "0.4rem 1rem",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        🔗 Ouvrir
                      </a>
                    </>
                  )}
                </div>
              ))
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: "1.5rem",
                background: "#7fffd4",
                color: "#111",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.4rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Fermer la fenêtre
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes floatBubble {
            0% { transform: translateY(0) scale(1); opacity: 0.9; }
            50% { transform: translateY(-30px) scale(1.1); opacity: 0.6; }
            100% { transform: translateY(-60px) scale(1); opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  )
}