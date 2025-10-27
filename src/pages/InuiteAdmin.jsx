import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import { supabase } from "../supabaseClient"
import "./InuiteAdmin.css"

export default function InuiteAdmin({ onNavigate, session }) {
  const [steps, setSteps] = useState([])
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const ADMIN_ID = "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97"
  const isAdmin = session?.user?.id === ADMIN_ID

  useEffect(() => { fetchSteps() }, [])

  async function fetchSteps() {
    const { data, error } = await supabase
      .from("mission_steps_inuite")
      .select("*")
      .order("step_number", { ascending: true })
    if (error) setError(error.message)
    setSteps(data || [])
  }

  async function saveStep(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...editing }
    payload.step_number = Number(payload.step_number)
    if (payload.type === "quiz" && typeof payload.quiz === "string") {
      try { payload.quiz = JSON.parse(payload.quiz) } catch {}
    }

    const { error } = payload.id
      ? await supabase.from("mission_steps_inuite").update(payload).eq("id", payload.id)
      : await supabase.from("mission_steps_inuite").insert([payload])

    if (error) setError(error.message)
    else { setEditing(null); fetchSteps() }
    setSaving(false)
  }

  if (!isAdmin)
    return (
      <div className="admin-denied">
        <h2>⛔ Accès réservé</h2>
        <button onClick={() => onNavigate("labo-login")} className="btn-secondary">
          Aller au Labo
        </button>
      </div>
    )

  // === Instances d'éditeur Tiptap ===
  const textEditor = useEditor({
    extensions: [StarterKit, Image, Youtube],
    content: editing?.text || "",
    onUpdate: ({ editor }) => {
      setEditing((prev) => ({ ...prev, text: editor.getHTML() }))
    },
  })

  const ritualEditor = useEditor({
    extensions: [StarterKit],
    content: editing?.ritual || "",
    onUpdate: ({ editor }) => {
      setEditing((prev) => ({ ...prev, ritual: editor.getHTML() }))
    },
  })

  return (
    <div className="admin-page">
      <h2>❄️ Admin — Mission Inuite</h2>
      <div className="admin-grid">
        {/* Liste */}
        <div className="panel">
          <button
            onClick={() =>
              setEditing({
                step_number: (steps.at(-1)?.step_number || 0) + 1,
                type: "text",
              })
            }
            className="btn-primary"
          >
            + Nouvelle étape
          </button>

          <ul className="steps-list">
            {steps.map((s) => (
              <li key={s.id} className="step-item">
                <div>
                  <b>Étape {s.step_number}</b> — {s.spirit_name || "?"}
                  <small> ({s.type})</small>
                </div>
                <button onClick={() => setEditing(s)} className="btn-small">
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulaire */}
        <div className="panel">
          {editing ? (
            <form onSubmit={saveStep} className="admin-form">
              <label>
                Numéro
                <input
                  type="number"
                  value={editing.step_number || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, step_number: e.target.value })
                  }
                />
              </label>

              <label>
                Esprit
                <input
                  type="text"
                  value={editing.spirit_name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, spirit_name: e.target.value })
                  }
                />
              </label>

              <label>
                Symbole
                <input
                  type="text"
                  value={editing.symbol || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, symbol: e.target.value })
                  }
                />
              </label>

              <label>
                Type
                <select
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value })
                  }
                >
                  <option value="text">Texte</option>
                  <option value="quiz">Quiz</option>
                  <option value="video">Vidéo</option>
                </select>
              </label>

              {editing.type === "text" && (
                <>
                  <label>Titre</label>
                  <input
                    type="text"
                    value={editing.title || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />

                  <label>Texte culturel</label>
                  <div className="editor-wrapper">
                    <EditorContent editor={textEditor} />
                  </div>

                  <label>Rituel du soir</label>
                  <div className="editor-wrapper ritual">
                    <EditorContent editor={ritualEditor} />
                  </div>
                </>
              )}

              {editing.type === "video" && (
                <label>
                  URL vidéo (YouTube, Vimeo…)
                  <input
                    type="text"
                    value={editing.media_url || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, media_url: e.target.value })
                    }
                  />
                </label>
              )}

              {editing.type === "quiz" && (
                <label>
                  Quiz (JSON)
                  <textarea
                    rows="5"
                    placeholder={`{
  "question": "Quel est le souffle du monde ?",
  "options": ["Sila", "Sedna"],
  "correct": 0
}`}
                    value={JSON.stringify(editing.quiz || "", null, 2)}
                    onChange={(e) =>
                      setEditing({ ...editing, quiz: e.target.value })
                    }
                  />
                </label>
              )}

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "💾…" : "💾 Enregistrer"}
              </button>
            </form>
          ) : (
            <p>Sélectionne ou crée une étape à gauche.</p>
          )}
        </div>
      </div>
    </div>
  )
}