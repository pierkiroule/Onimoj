import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Notifications({ session }) {
  const user = session?.user
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [bubbles, setBubbles] = useState([])
  const [showFX, setShowFX] = useState(false)

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
        const visibles = data?.filter((n) => n.visible) || []
        if (visibles.length > unreadCount) triggerFX()
        setNotifications(data || [])
        setUnreadCount(visibles.length)
        spawnBubbles()
      }
    }
    fetchNotifications()
  }, [user])

  // 🌠 Effet plein écran + flou
  function triggerFX() {
    setShowFX(true)
    setTimeout(() => setShowFX(false), 5000) // visible 5 s
  }

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

  // 🌕 Gérer modale
  function openModal() {
    if (!showModal && unreadCount > 0) archiveOldNotifications()
    setShowModal(true)
  }
  function closeModal() {
    setShowModal(false)
    setExpanded(null)
  }

  // 🌬️ bulles décoratives
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
      {/* 🌌 FX notification */}
      {showFX && (
        <div className="dream-overlay">
          <div className="dream-message">
            🌠 Vous avez reçu une notification<br />des Gardiens du Rêve
          </div>
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      )}

      {/* 🌟 Icône principale */}
      <div
        onClick={openModal}
        className={`notif-icon ${unreadCount > 0 ? "vibrate" : ""}`}
        title="Messages des Gardiens du Rêve"
      >
        <span style={{ fontSize: "22px" }}>🌟</span>
        {unreadCount > 0 && (
          <div className="notif-badge">{unreadCount}</div>
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

      {/* 🌙 Modale */}
      {showModal && (
        <div className="notif-modal">
          <div className="notif-box">
            <h3>🌙 Messages des Gardiens du Rêve</h3>
            {notifications.length === 0 ? (
              <p>Aucune notification.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                  className={`notif-item ${
                    expanded === n.id ? "active" : ""
                  }`}
                >
                  <p className="notif-title">🌠 Félicitations, explorateur onirique</p>
                  {expanded === n.id ? (
                    <p className="notif-text">
                      Grâce à vos contributions, l’activité des Gardiens se porte à merveille.  
                      Ils vous offrent une onde de rêve —  
                      un fragment poétique pour veiller sur votre sommeil  
                      et nourrir vos songes.  
                      {n.description ? `\n\n${n.description}` : ""}
                    </p>
                  ) : (
                    <p className="notif-tease">Une offrande onirique vous attend...</p>
                  )}
                  {expanded === n.id && n.url && (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="notif-link">
                      🔗 Découvrir l’offrande
                    </a>
                  )}
                </div>
              ))
            )}
            <button onClick={closeModal} className="notif-close">Fermer</button>
          </div>
        </div>
      )}

      {/* 🎨 Styles */}
      <style>
        {`
          /* 🌟 Icône */
          .notif-icon {
            position: fixed;
            top: 18px;
            right: 18px;
            background: rgba(255,255,255,0.15);
            color: #fff;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            backdrop-filter: blur(6px);
            box-shadow: 0 0 10px rgba(127,255,212,0.4);
            z-index: 2000;
            transition: transform 0.2s;
          }

          .vibrate {
            animation: vibrate 1.2s infinite ease-in-out;
          }

          @keyframes vibrate {
            0%,100% { transform: translate(0,0) scale(1); }
            25% { transform: translate(1px,-2px) scale(1.05); }
            50% { transform: translate(-1px,2px) scale(1.1); }
            75% { transform: translate(2px,0) scale(1.05); }
          }

          .notif-badge {
            position: absolute;
            top: 3px;
            right: 3px;
            background: #7fffd4;
            color: #000;
            border-radius: 50%;
            padding: 1px 5px;
            font-size: 10px;
            font-weight: 600;
            box-shadow: 0 0 6px rgba(127,255,212,0.7);
          }

          /* 🌌 Effet onirique */
          .dream-overlay {
            position: fixed;
            inset: 0;
            z-index: 3000;
            backdrop-filter: blur(12px);
            background: radial-gradient(circle at center, rgba(10,20,40,0.6), rgba(0,0,0,0.2) 70%);
            overflow: hidden;
            animation: fadeInOut 5s ease-in-out forwards;
          }

          .dream-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #bfffe5;
            font-size: 1.4rem;
            text-align: center;
            font-style: italic;
            text-shadow: 0 0 20px rgba(127,255,212,0.7);
            animation: messagePulse 5s ease-in-out forwards;
          }

          @keyframes messagePulse {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            15%,85% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          }

          .particle {
            position: absolute;
            background: radial-gradient(circle, #bfffe5 0%, #7fffd4 40%, transparent 80%);
            border-radius: 50%;
            width: 6px;
            height: 6px;
            opacity: 0.9;
            top: 50%;
            left: 50%;
            animation: explode 5s ease-out forwards;
            filter: blur(1px);
          }

          @keyframes explode {
            0% { transform: translate(0,0) scale(0.2); opacity: 1; }
            100% { 
              transform: translate(${Math.random() * 1200 - 600}px, ${Math.random() * 800 - 400}px) scale(1); 
              opacity: 0; 
            }
          }

          @keyframes fadeInOut {
            0%,100% { opacity: 0; }
            15%,85% { opacity: 1; }
          }

          /* 🌙 Modale */
          .notif-modal {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex; justify-content: center; align-items: center;
            z-index: 2100; animation: fadeIn 0.3s ease;
          }

          .notif-box {
            background: rgba(15,15,30,0.9);
            border-radius: 12px;
            padding: 1.2rem;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 0 16px rgba(127,255,212,0.25);
            color: #fff; text-align: center;
            backdrop-filter: blur(10px);
          }

          .notif-item {
            background: #232848;
            border-radius: 10px;
            margin: 0.6rem 0;
            padding: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .notif-item.active {
            background: #1c2445;
            box-shadow: 0 0 12px rgba(127,255,212,0.3);
          }

          .notif-title { color: #7fffd4; font-weight: 600; }
          .notif-tease { opacity: 0.7; font-style: italic; }
          .notif-link { background: #7fffd4; color: #000; padding: 0.4rem 0.8rem; border-radius: 20px; text-decoration: none; display: inline-block; margin-top: 0.5rem; }
          .notif-close { background: rgba(127,255,212,0.15); border: none; color: #7fffd4; border-radius: 20px; padding: 0.4rem 1rem; cursor: pointer; margin-top: 1rem; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  )
}