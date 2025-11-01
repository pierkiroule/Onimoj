// src/components/DreamFriendBubble.jsx
import "./DreamFriendBubble.css"

export default function DreamFriendBubble({ friend }) {
  if (!friend) {
    return (
      <div className="dreamfriend-bubble">
        <p>Il semble que ton univers entre en résonance avec un voyageur onirique !</p>
      </div>
    )
  }
  const score = typeof friend.shared_score === "number"
    ? friend.shared_score.toFixed(2)
    : "0.00"

  return (
    <div className="dreamfriend-bubble">
      <div className="df-avatar">🤩</div>
      <div className="df-info">
        <h3>{friend.username || "Anonyme"}</h3>
        <p>💞 Résonance : {score}</p>
      </div>
    </div>
  )
}