import { supabase } from '../supabaseClient'

// ...

const handleSend = async () => {
  if (message.trim() === '') return

  try {
    // 🔐 Récupération sécurisée de l'utilisateur
    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const user = data?.user
    if (!user) {
      setHint('⚠️ Connecte-toi avant d’offrir un rêve.')
      return
    }

    // 💾 Enregistrement de l’offrande
    const { error } = await supabase.from('offrandes_oniriques').insert([
      {
        user_id: user.id,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    // ✨ Feedback visuel
    setSent(true)
    setHint(inspirations[Math.floor(Math.random() * inspirations.length)])

    setTimeout(() => {
      setMessage('')
      setSent(false)
      setHint('')
    }, 2800)
  } catch (err) {
    console.error('❌ Erreur handleSend :', err)
    setHint('❌ Erreur : offrande non envoyée.')
  }
}