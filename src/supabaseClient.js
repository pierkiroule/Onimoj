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
  const arrayResponse = { data: [], error: missingEnvError }
  const singleResponse = { data: null, error: missingEnvError }

  const resolveArray = () => Promise.resolve(arrayResponse)
  const resolveSingle = () => Promise.resolve(singleResponse)

  const chainMethod = (builder) => () => builder

  const createSelectBuilder = () => {
    const builder = {}
    const proxy = new Proxy(builder, {
      get(_target, prop) {
        switch (prop) {
          case 'maybeSingle':
            return resolveSingle
          case 'single':
            return resolveSingle
          case 'limit':
          case 'order':
          case 'eq':
          case 'in':
          case 'range':
          case 'gte':
          case 'lte':
          case 'neq':
          case 'ilike':
          case 'contains':
            return chainMethod(proxy)
          case 'then':
            return (resolve, reject) => resolveArray().then(resolve, reject)
          case 'catch':
            return (onRejected) => resolveArray().catch(onRejected)
          case 'finally':
            return (onFinally) => resolveArray().finally(onFinally)
          default:
            return chainMethod(proxy)
        }
      },
    })
    return proxy
  }

  const createMutationBuilder = () => {
    const builder = {}
    const proxy = new Proxy(builder, {
      get(_target, prop) {
        switch (prop) {
          case 'then':
            return (resolve, reject) => resolveSingle().then(resolve, reject)
          case 'catch':
            return (onRejected) => resolveSingle().catch(onRejected)
          case 'finally':
            return (onFinally) => resolveSingle().finally(onFinally)
          default:
            return chainMethod(proxy)
        }
      },
    })
    return proxy
  }

  return {
    from: () => ({
      select: () => createSelectBuilder(),
      insert: () => resolveArray(),
      update: () => createMutationBuilder(),
      delete: () => createMutationBuilder(),
    }),
    rpc: async () => ({ data: null, error: missingEnvError }),
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
      resetPasswordForEmail: async () => ({ data: null, error: missingEnvError }),
      signInWithOAuth: async () => ({ data: null, error: missingEnvError }),
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