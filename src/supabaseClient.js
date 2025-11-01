import { createClient } from '@supabase/supabase-js'

// 🌐 Variables d'environnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Vérification de base (non bloquante)
console.log('🧭 Vérification Supabase :')
console.log('🌐 URL  →', SUPABASE_URL || '❌ non définie')
console.log('🔑 KEY  →', SUPABASE_ANON_KEY ? '✅ présente' : '❌ absente')

// 🛡️ Stub minimal (évite plantage hors ligne ou sans .env)
function createSupabaseStub() {
  const missingEnvError = new Error('⚠️ Supabase non configuré (.env manquant)')
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
      delete: async () => ({ error: missingEnvError }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: missingEnvError }),
      getSession: async () => ({ data: { session: null }, error: missingEnvError }),
      signUp: async () => ({ data: { user: null, session: null }, error: missingEnvError }),
      signInWithPassword: async () => ({ data: null, error: missingEnvError }),
      signOut: async () => ({ error: missingEnvError }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      }),
    },
  }
}

// 🚀 Client réel ou stub de secours
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: { eventsPerSecond: 2 },
        },
      })
    : createSupabaseStub()

// 🌍 Test rapide réseau (facultatif, silencieux)
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  const testUrl = `${SUPABASE_URL}/rest/v1/test_table`
  fetch(testUrl, { headers: { apikey: SUPABASE_ANON_KEY } })
    .then((r) =>
      r.text().then((t) =>
        console.log(`📡 Supabase OK [${r.status}] – ${t.slice(0, 100)}...`)
      )
    )
    .catch((err) => console.warn('⚠️ Supabase non joignable →', err.message))
} else {
  console.warn('⛔ Client Supabase en mode STUB (local ou offline).')
}