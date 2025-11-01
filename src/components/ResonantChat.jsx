// src/components/ResonantChat.jsx
import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import "./ResonantChat.css"

export default function ResonantChat({ userId, dreamFriend }) {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (!dreamFriend) return
    loadMessages()
    const id = setInterval(loadMessages, 10000)
    return () => clearInterval(id)
  }, [dreamFriend])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    const { data, error } = await supabase
      .from("offrandes_oniriques")
      .select("*")
      .eq("visibility", "chat")
      .or(`user_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true })
      .limit(100)
    if (!error) setMessages(data || [])
  }

  async function sendMessage(e) {
    e?.preventDefault()
    if (!dreamFriend || !newMsg.trim() || loading) return
    setLoading(true)
    try {
      const { error } = await supabase.from("offrandes_oniriques").insert({
        user_id: userId,
        receiver_id: dreamFriend.dreamfriend_id,
        message: newMsg.trim(),
        visibility: "chat",
        culture: "résonant",
        intention: "dialogue éphémère"
      })
      if (error) throw error
      setNewMsg("")
      await loadMessages()
    } catch (err) {
      console.error("chat send error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!dreamFriend) return null

  return (
    <div className="resonant-chat fade-in">
      <h3>💬 Chat résonant avec {dreamFriend.username || "DreamFriend"}</h3>

      <div className="chat-messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.user_id === userId ? "mine" : "theirs"}`}>
            <p>{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="empty">Commence la danse des mots...</p>}
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Écris ton écho..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button
          type="submit"
          onClick={sendMessage}
          disabled={loading || !newMsg.trim()}
          aria-disabled={loading || !newMsg.trim()}
        >
          ✨
        </button>
      </form>
    </div>
  )
}