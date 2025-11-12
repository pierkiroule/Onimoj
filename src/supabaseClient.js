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

  const arrayResult = () => ({ data: [], error: missingEnvError })
  const nullResult = () => ({ data: null, error: missingEnvError })

  const createBuilder = (mode = 'select') => {
    let promise =
      mode === 'select'
        ? Promise.resolve(arrayResult())
        : Promise.resolve(nullResult())

    const builder = {
      eq: () => builder,
      is: () => builder,
      in: () => builder,
      contains: () => builder,
      order: () => builder,
      limit: () => {
        promise = Promise.resolve(arrayResult())
        return builder
      },
      select: () => {
        promise = Promise.resolve(arrayResult())
        return builder
      },
      single: () => {
        promise = Promise.resolve(nullResult())
        return builder
      },
      maybeSingle: () => {
        promise = Promise.resolve(nullResult())
        return builder
      },
      then: (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected),
      catch: (onRejected) => promise.catch(onRejected),
      finally: (onFinally) => promise.finally(onFinally),
    }

    const noopChainers = ['gte', 'lte', 'neq', 'like', 'ilike', 'range', 'orderBy']
    noopChainers.forEach((fn) => {
      builder[fn] = () => builder
    })

    return builder
  }

  const createMutationBuilder = () => createBuilder('mutation')

  return {
    from: () => ({
      select: () => createBuilder('select'),
      insert: () => createMutationBuilder(),
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