import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

export default function Recevoir() {
  const [offrande, setOffrande] = useState(null)
  const [status, setStatus] = useState('🔮 Connexion au flux onirique...')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOffrande()
  }, [])

  async function fetchOffrande() {
    setLoading(true)
    setStatus('🌬️ Recherche d’une offrande dans le vent cosmique...')

    try {
      // ✅ on sélectionne sans dépendre de colonnes optionnelles
      const { data, error } = await supabase
        .from('offrandes_oniriques')
        .select('id, message, created_at, received')
        .limit(20)

      if (error) throw error

      if (!data || data.length === 0) {
        setOffrande(null)
        setStatus('🌙 Aucun message en attente. Reviens bientôt.')
      } else {
        // on filtre localement (plus sûr)
        const disponibles = data.filter((o) => o.received !== true)
        if (disponibles.length === 0) {
          setOffrande(null)
          setStatus('🌙 Toutes les offrandes ont déjà trouvé preneur.')
        } else {
          const random = disponibles[Math.floor(Math.random() * disponibles.length)]
          setOffrande(random)
          setStatus('✨ Une offrande t’a choisi.')

          // ✅ mise à jour sécurisée
          const { error: updateError } = await supabase
            .from('offrandes_oniriques')
            .update({ received: true })
            .eq('id', random.id)

          if (updateError) console.warn('⚠️ Impossible de marquer comme reçue:', updateError.message)
        }
      }
    } catch (err) {
      console.error('Erreur Recevoir:', err)
      setStatus('⚠️ Impossible de capter les ondes oniriques.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ padding: '1.2rem', textAlign: 'center', color: '#eee' }}>
      <h2>🌠 Recevoir</h2>
      <p className="subtitle" style={{ opacity: 0.8 }}>
        Laisse venir à toi un rêve, un souffle, ou une parole offerte par un autre voyageur.
      </p>

      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '1rem',
          marginTop: '1rem',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {offrande ? (
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '1.1rem',
              lineHeight: '1.4',
              color: '#bfe',
            }}
          >
            “{offrande.message}”
          </p>
        ) : (
          <p style={{ opacity: 0.7 }}>{status}</p>
        )}
      </div>

      <button
        onClick={fetchOffrande}
        disabled={loading}
        className="dream-button"
        style={{
          marginTop: '1rem',
          background: '#6eff8d',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
          fontWeight: 'bold',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? '🌬️ En écoute...' : '🔁 Recevoir une nouvelle offrande'}
      </button>

      <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>
    </div>
  )
}