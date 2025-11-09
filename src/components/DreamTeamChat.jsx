import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabaseClient"

export default function DreamTeamChat({ roomId, user }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  // Charger les messages existants
  useEffect(() => {
    if (!roomId) return
    loadMessages()
    const sub = supabase
      .channel(`dreamteam_messages:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dreamteam_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [roomId])

  async function loadMessages() {
    const { data, error } = await supabase
      .from("dreamteam_messages")
      .select("id,user_id,pseudo,message,created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
    if (!error) setMessages(data)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    await supabase.from("dreamteam_messages").insert([
      {
        room_id: roomId,
        user_id: user.id,
        pseudo: user.username || "anonyme",
        message: input.trim(),
      },
    ])
    setInput("")
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.8)",
        border: "1px solid rgba(127,255,212,0.3)",
        borderRadius: "12px",
        padding: "1rem",
        width: "100%",
        maxWidth: "480px",
        margin: "1rem auto",
        color: "#e9fffd",
      }}
    >
      <h3 style={{ color: "#7fffd4", marginBottom: ".5rem" }}>💬 Salon DreamTeam</h3>

      <div
        style={{
          maxHeight: "260px",
          overflowY: "auto",
          background: "rgba(0,20,25,.4)",
          borderRadius: "10px",
          padding: ".5rem",
          marginBottom: ".6rem",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              textAlign: m.user_id === user.id ? "right" : "left",
              marginBottom: ".4rem",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background:
                  m.user_id === user.id
                    ? "linear-gradient(90deg,#7fffd4,#6a5acd)"
                    : "rgba(127,255,212,0.1)",
                color: m.user_id === user.id ? "#111" : "#e9fffd",
                borderRadius: "10px",
                padding: ".4rem .7rem",
                maxWidth: "80%",
              }}
            >
              <b>{m.pseudo}:</b> {m.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: ".5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton écho..."
          style={{
            flex: 1,
            border: "1px solid rgba(127,255,212,.4)",
            background: "rgba(0,25,30,.6)",
            borderRadius: "8px",
            color: "#e9fffd",
            padding: ".4rem .6rem",
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
            border: "none",
            borderRadius: "8px",
            padding: ".4rem .8rem",
            color: "#111",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </form>
    </div>
  )
}