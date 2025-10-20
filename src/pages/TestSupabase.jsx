import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function TestSupabase() {
  const [status, setStatus] = useState('⏳ Test en cours...')
  const [details, setDetails] = useState('')
  const [data, setData] = useState([])
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    async function runTest() {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY

      console.log('🔍 Début test Supabase')
      console.log('🌐 URL:', url)
      console.log('🔑 Clé présente:', !!key)

      if (!url || !key) {
        setStatus('❌ Variables .env manquantes')
        setDetails('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY absente')
        return
      }

      const start = performance.now()
      try {
        const { data, error } = await supabase.from('test_table').select('*').limit(5)
        const time = (performance.now() - start).toFixed(0)
        setDuration(time + ' ms')

        if (error) {
          console.error('❌ Erreur Supabase:', error.message)
          setStatus('❌ Erreur Supabase')
          setDetails(error.message)
        } else {
          console.log('✅ Connexion OK, données:', data)
          setStatus('✅ Connexion Supabase OK')
          setDetails(`Réponse en ${time} ms`)
          setData(data)
        }
      } catch (err) {
        console.error('⚠️ Erreur inattendue:', err)
        setStatus('⚠️ Erreur inattendue')
        setDetails(String(err))
      }
    }

    runTest()
  }, [])

  return (
    <div
      className="fade-in"
      style={{
        padding: '1rem',
        color: '#eee',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <h2>🧪 Test Supabase</h2>
      <p>{status}</p>
      {details && <p style={{ opacity: 0.7 }}>{details}</p>}
      {duration && <p>⏱️ Durée : {duration}</p>}

      {data && data.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'left' }}>
          <h3>📦 Contenu de <code>test_table</code> :</h3>
          <ul>
            {data.map((row) => (
              <li key={row.id}>🟢 {row.name}</li>
            ))}
          </ul>
        </div>
      )}

      <footer style={{ marginTop: '2rem', opacity: 0.6 }}>
        © 2025 Onimoji • Diagnostic Supabase
      </footer>
    </div>
  )
}