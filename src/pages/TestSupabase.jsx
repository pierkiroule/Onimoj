import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function TestSupabase() {
  const [status, setStatus] = useState('⏳ Test de connexion en cours...')
  const [details, setDetails] = useState('')
  const [data, setData] = useState([])
  const [duration, setDuration] = useState(null)
  const [color, setColor] = useState('#ffcc66')

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
        setColor('#ff6b6b')
        return
      }

      const start = performance.now()

      try {
        // Test sur table "test_table"
        let { data, error } = await supabase.from('test_table').select('*').limit(5)

        // Si la table n'existe pas → fallback sur offrandes
        if (error && error.message.includes('does not exist')) {
          console.warn('⚠️ test_table absente → fallback vers offrandes_oniriques')
          const res = await supabase.from('offrandes_oniriques').select('*').limit(5)
          data = res.data
          error = res.error
        }

        const time = (performance.now() - start).toFixed(0)
        setDuration(time + ' ms')

        if (error) {
          console.error('❌ Erreur Supabase:', error.message)
          setStatus('❌ Connexion Supabase échouée')
          setDetails(error.message)
          setColor('#ff6b6b')
        } else if (!data || data.length === 0) {
          console.warn('⚠️ Aucune donnée trouvée.')
          setStatus('⚠️ Connexion OK mais vide')
          setDetails(`Réponse en ${time} ms`)
          setColor('#ffaa33')
        } else {
          console.log('✅ Connexion OK, données:', data)
          setStatus('✅ Connexion Supabase réussie')
          setDetails(`Réponse en ${time} ms`)
          setData(data)
          setColor('#6eff8d')
        }
      } catch (err) {
        console.error('🚨 Erreur inattendue:', err)
        setStatus('🚨 Erreur inattendue')
        setDetails(String(err))
        setColor('#ff4444')
      }
    }

    runTest()
  }, [])

  return (
    <div
      className="fade-in"
      style={{
        padding: '1rem',
        textAlign: 'center',
        fontFamily: 'monospace',
        color: color,
      }}
    >
      <h2>🧪 Test Supabase</h2>
      <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{status}</p>
      {details && <p style={{ opacity: 0.8, color: '#ccc' }}>{details}</p>}
      {duration && <p style={{ color: '#bbb' }}>⏱️ Durée : {duration}</p>}

      {data && data.length > 0 && (
        <div style={{ marginTop: '1.5rem', textAlign: 'left', color: '#eee' }}>
          <h3>
            📦 Contenu de <code>{data[0].table || 'test_table'}</code> :
          </h3>
          <ul>
            {data.map((row) => (
              <li key={row.id || row.name}>
                🟢 {row.name || JSON.stringify(row).slice(0, 50)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer style={{ marginTop: '2rem', opacity: 0.6, color: '#aaa' }}>
        © 2025 Onimoji • Diagnostic Supabase
      </footer>
    </div>
  )
}