import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Notifications({ session }) {
  const user = session?.user
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [bubbles, setBubbles] = useState([])

  // 📡 Charger les notifications
  useEffect(() => {
    if (!user) return
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("echoressources")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)
      if (error) console.error("Erreur notifications:", error.message)
      else {
        setNotifications(data || [])
        setUnreadCount(data?.filter((n) => n.visible)?.length || 0)
        spawnBubbles()
      }
    }
    fetchNotifications()
  }, [user])

  // 🕊️ Marquer comme lues
  async function archiveOldNotifications() {
    const visibles = notifications.filter((n) => n.visible)
    if (!visibles.length) return
    const ids = visibles.map((n) => n.id)
    await supabase
      .from("echoressources")
      .update({ visible: false, user_read: true })
      .in("id", ids)
  }

  // 🌕 Gérer la modale
  function openModal() {
    if (!showModal && unreadCount > 0) archiveOldNotifications()
    setShowModal(true)
  }
  function closeModal() {
    setShowModal(false)
    setExpanded(null)
  }

  // 🌬️ Mini bulles subtiles
  function spawnBubbles() {
    const newBubbles = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 6,
      duration: 3 + Math.random() * 3,
    }))
    setBubbles(newBubbles)
    setTimeout(() => setBubbles([]), 4000)
  }

  if (!user) return null

  return (
    <>
      {/* 🔔 Cloche mini */}
      <div
        onClick={openModal}
        style={{
          position: "fixed",
          top: "18px",
          right: "18px",
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          boxShadow: "0 0 8px rgba(127,255,212,0.3)",
          zIndex: 2000,
          transition: "all 0.3s ease",
        }}
        title="ÉchoRessources"
      >
        <span style={{ fontSize: "18px" }}>🔔</span>
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "3px",
              right: "3px",
              background: "#7fffd4",
              color: "#000",
              borderRadius: "50%",
              padding: "1px 5px",
              fontSize: "10px",
              fontWeight: "600",
              boxShadow: "0 0 6px rgba(127,255,212,0.7)",
            }}
          >
            {unreadCount}
          </div>
        )}
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
              background: "rgba(255,255,255,0.25)",
              animation: `floatBubble ${b.duration}s ease-in-out infinite`,
              filter: "blur(0.6px)",
            }}
          />
        ))}
      </div>

      {/* 🌌 Modale minimaliste */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2100,
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              background: "rgba(15,15,30,0.9)",
              borderRadius: "12px",
              padding: "1.2rem",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 0 16px rgba(127,255,212,0.25)",
              color: "#fff",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#7fffd4", marginBottom: "0.8rem", fontSize: "1rem" }}>
              🌙 ÉchoRessources
            </h3>

            {notifications.length === 0 ? (
              <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>Aucune notification.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                  style={{
                    background: expanded === n.id ? "#1c2445" : "#232848",
                    borderRadius: "0.8rem",
                    padding: expanded === n.id ? "1rem" : "0.6rem",
                    margin: "0.5rem auto",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow:
                      expanded === n.id
                        ? "0 0 12px rgba(127,255,212,0.3)"
                        : "0 0 6px rgba(127,255,212,0.1)",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "500",
                      color: "#7fffd4",
                      marginBottom: "0.3rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    {n.titre}
                  </p>

                  {expanded === n.id && (
                    <>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          opacity: 0.85,
                          marginBottom: "0.4rem",
                          lineHeight: "1.4",
                        }}
                      >
                        {n.description || "Aucune description."}
                      </p>
                      {n.url && (
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "0.2rem",
                            color: "#000",
                            background: "#7fffd4",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "20px",
                            fontWeight: "500",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                          }}
                        >
                          🔗 Ouvrir
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: "1rem",
                background: "rgba(127,255,212,0.15)",
                color: "#7fffd4",
                border: "none",
                borderRadius: "20px",
                padding: "0.4rem 1rem",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes floatBubble {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-15px) scale(1.1); opacity: 0.5; }
            100% { transform: translateY(-30px) scale(1); opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  )
}