import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import DreamFriendBubble from "../components/DreamFriendBubble"
import DreamGraph from "../components/DreamGraph"
import DreamScriptCard from "../components/DreamScriptCard"
import ResonantChat from "../components/ResonantChat"
import "./DreamReso.css"

export default function DreamReso({ userId }) {
  const [dreamFriend, setDreamFriend] = useState(null)
  const [network, setNetwork] = useState([])
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("🌌 Connexion au réseau des résonances...")

  useEffect(() => {
    if (!userId) {
      setStatus("⚠️ Connecte-toi pour explorer ton univers résonant.")
      setLoading(false)
      return
    }
    ;(async () => {
      setLoading(true)
      try {
        const { data: friend, error: errFriend } = await supabase.rpc(
          "get_dreamfriend_of_the_hour",
          { p_user_id: userId }
        )
        if (errFriend) console.error("Erreur DreamFriend:", errFriend)

        const f = friend?.dreamfriend_id ? {
          dreamfriend_id: friend.dreamfriend_id,
          username: friend.username || "Anonyme",
          shared_score: typeof friend.shared_score === "number" ? friend.shared_score : 0
        } : null
        setDreamFriend(f)

        const { data: net, error: errNet } = await supabase.rpc("get_resonance_network")
        if (errNet) throw errNet
        setNetwork(Array.isArray(net) ? net : [])

        const { data: shared, error: errScripts } = await supabase
          .from("dream_scripts_shared")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)
        if (errScripts) throw errScripts
        setScripts(shared ?? [])

        setStatus("🌠 Réseau des résonances chargé")
      } catch (e) {
        console.error("⚠️ Erreur chargement réseau:", e)
        setStatus("⚠️ Impossible de charger les résonances.")
      } finally {
        setLoading(false)
      }
    })()
  }, [userId])

  if (loading) return <p className="reso-status">{status}</p>

  return (
    <div className="dreamreso-page fade-in">
      <header className="dreamreso-header">
        <h2>🌌 DreamReso•°</h2>
        <p className="status">{status}</p>
        <p className="dreamfriend-invite">
          🤩 Mais quel est donc ton DreamFriend résonant de l'instant présent ?
        </p>
      </header>

      <DreamFriendBubble friend={dreamFriend} />

      <section className="reso-graph-section">
        <div className="graph-frame">
          {network.length === 0 ? (
            <p className="reso-status">Aucun lien de résonance détecté pour l’instant.</p>
          ) : (
            <DreamGraph
              nodes={network}
              currentUserId={userId}
              dreamFriend={dreamFriend}
            />
          )}
        </div>
      </section>

      <section className="reso-chat-section">
        <ResonantChat userId={userId} dreamFriend={dreamFriend} />
      </section>

      <section className="reso-scripts">
        <h3>📜 Scripts hypno-oniriques partagés</h3>
        {scripts.length === 0 && <p>Aucun script cocréé pour le moment.</p>}
        <div className="script-list">
          {scripts.map((s) => (
            <DreamScriptCard key={s.id} script={s} />
          ))}
        </div>
      </section>

      <footer className="reso-footer">© 2025 Onimoji • Prototype Onirix Beta One</footer>
    </div>
  )
}