import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import InuitFlow from "../components/InuitFlow"

export default function MissionInuite() {
  const [userId, setUserId] = useState(null)
  const [ready, setReady] = useState(false)

  // 🔐 Session
  useEffect(() => {
    let sub
    (async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data?.session?.user?.id || null)
      setReady(true)
    })()
    const listener = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserId(sess?.user?.id || null)
    })
    sub = listener?.data?.subscription
    return () => sub?.unsubscribe?.()
  }, [])

  if (!ready) return <div style={{color:"#7fffd4",textAlign:"center",marginTop:"30vh"}}>🌌 Chargement…</div>

  // Si non connecté
  if (!userId) {
    return (
      <div style={{maxWidth:720,margin:"10vh auto",padding:"1rem",color:"#e9fffd",textAlign:"center"}}>
        <h2 style={{color:"#7fffd4",marginBottom:"0.5rem"}}>Constellation Inuite</h2>
        <p style={{opacity:.85,marginBottom:"1rem"}}>Connecte-toi pour commencer le voyage.</p>
        <a href="#" onClick={async (e)=>{e.preventDefault(); await supabase.auth.signInWithOAuth({provider:"google"})}}
           style={{display:"inline-block",padding:"0.7rem 1.2rem",borderRadius:12,
                   background:"rgba(127,255,212,.15)",border:"1px solid rgba(127,255,212,.35)",color:"#7fffd4"}}>
          🔑 Se connecter
        </a>
      </div>
    )
  }

  // Flux principal
  return (
    <div style={{minHeight:"100vh",padding:"1rem",color:"#e9fffd"}}>
      <InuitFlow userId={userId} />
    </div>
  )
}