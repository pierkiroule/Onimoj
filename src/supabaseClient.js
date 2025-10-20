import { createClient } from '@supabase/supabase-js'

// 🌐 Variables d'environnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🧩 Vérification de base
console.log('✅ Vérification Supabase :')
console.log('🌐 URL  →', SUPABASE_URL || '❌ non définie')
console.log('🔑 KEY  →', SUPABASE_ANON_KEY ? 'présente ✅' : '❌ absente')

// 🛡️ Stub minimal si variables manquantes pour éviter les crashs
function createSupabaseStub() {
  const missingEnvError = new Error('Supabase non configuré: variables .env manquantes')
  const selectable = {
    limit: async () => ({ data: [], error: missingEnvError }),
    eq: () => ({ order: async () => ({ data: [], error: missingEnvError }) }),
    order: async () => ({ data: [], error: missingEnvError }),
  }
  const updatable = {
    eq: async () => ({ data: null, error: missingEnvError }),
  }
  return {
    from: () => ({
      select: () => selectable,
      insert: async () => ({ data: null, error: missingEnvError }),
      update: () => updatable,
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: missingEnvError }),
      signInWithPassword: async () => ({ data: null, error: missingEnvError }),
    },
  }
}

// 🚀 Création du client (réel si config présente, sinon stub)
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createSupabaseStub()

// 🌐 Test direct de connectivité réseau Supabase
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  const url = `${SUPABASE_URL}/rest/v1/test_table`
  console.log('📡 Test réseau direct :', url)
  fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } })
    .then(async (r) => {
      const txt = await r.text()
      console.log(`🌍 Réponse Supabase [${r.status}] :`, txt.slice(0, 200))
    })
    .catch((err) => {
      console.error('🚨 Erreur réseau directe →', err.message)
    })
} else {
  console.warn('⚠️ Variables manquantes : client Supabase inactif (stub).')
}