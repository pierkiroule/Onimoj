import { createClient } from '@supabase/supabase-js'

// 🧭 Mode d'exécution (commenté car non utilisé)
// const isLocal = import.meta.env.DEV

// 🌐 Variables d'environnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🧩 Vérification de base
console.log('✅ Vérification Supabase :')
console.log('🌐 URL  →', SUPABASE_URL || '❌ non définie')
console.log('🔑 KEY  →', SUPABASE_ANON_KEY ? 'présente ✅' : '❌ absente')

// 🚀 Création du client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 🌐 Test direct de connectivité réseau Supabase
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  const url = `${SUPABASE_URL}/rest/v1/test_table`
  console.log('📡 Test réseau direct :', url)

  fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  })
    .then(async (r) => {
      const txt = await r.text()
      console.log(`🌍 Réponse Supabase [${r.status}] :`, txt.slice(0, 200))
    })
    .catch((err) => {
      console.error('🚨 Erreur réseau directe →', err.message)
    })
} else {
  console.warn('⚠️ Variables manquantes : impossible de tester la connexion.')
}