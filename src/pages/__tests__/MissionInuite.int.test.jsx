import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
// Dynamic import later to avoid SSR helper timing with rolldown transform
let MissionInuite

// Mock ModuleInuitStep to expose the open hublot button directly
vi.mock('../../components/ModuleInuitStep', () => ({
  __esModule: true,
  default: ({ onOpenHublot }) => (
    <div>
      <button aria-label="open-hublot" onClick={onOpenHublot}>open</button>
    </div>
  ),
}))

// Mock HublotResonant: expose a way to complete with 3 emojis
vi.mock('../../components/HublotResonant', () => ({
  __esModule: true,
  default: ({ onComplete, step, culture = 'Inuite' }) => (
    <div>
      <div>Hublot {culture} step {step?.step_number}</div>
      <button
        aria-label="complete-hublot"
        onClick={() => onComplete?.([
          { fr: 'Souffle', en: 'Breath' },
          { fr: 'Glace', en: 'Ice' },
          { fr: 'Océan', en: 'Ocean' },
        ])}
      >
        complete
      </button>
    </div>
  ),
}))

// Mock OnimojiCard to avoid canvas API in jsdom
vi.mock('../../components/OnimojiCard', () => ({
  __esModule: true,
  default: ({ star }) => <div>OnimojiCard {star?.title}</div>,
}))

// Mock Supabase client
vi.mock('../../supabaseClient.js', async () => {
  let user = { id: 'user-1' }
  const missionsRow = { id: 'm1', user_id: 'user-1', culture: 'Inuite', current_step: 1, progress: 0, status: 'active' }
  const missionSteps = [
    {
      step_number: 1,
      spirit_name: 'Sila',
      symbol: '🌬️',
      theme: 'Souffle',
      description: 'Texte',
      question: 'Q', practice: 'P', integration: 'I',
    },
  ]

  function makeMissionSelectChain() {
    return {
      eq: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: missionsRow, error: null }),
        }),
      }),
    }
  }

  function makeStepsSelectChain() {
    return {
      order: async () => ({ data: missionSteps, error: null }),
    }
  }

  return {
    __esModule: true,
    supabase: {
      auth: {
        getUser: async () => ({ data: { user }, error: null }),
        getSession: async () => ({ data: { session: user ? { user } : null }, error: null }),
        onAuthStateChange: (callback) => {
          callback('SIGNED_IN', user ? { user } : null)
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
            error: null,
          }
        },
        signInWithOAuth: vi.fn(),
      },
      from: (table) => ({
        select: () => (table === 'missions' ? makeMissionSelectChain() : makeStepsSelectChain()),
        insert: (rows) => {
          const data = rows?.[0] ? { ...rows[0], id: 'ds1' } : null
          return {
            select: () => ({
              single: async () => ({ data, error: null }),
            }),
          }
        },
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
    },
  }
})

describe('MissionInuite flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('runs module → hublot → save flow', async () => {
    if (typeof globalThis.__vite_ssr_exportName__ === 'undefined') {
      globalThis.__vite_ssr_exportName__ = (n, v) => v
    }
    const mod = await import('../MissionInuite.jsx')
    MissionInuite = mod.default
    render(<MissionInuite />)

    // Wait for mission to load
    await waitFor(() => expect(screen.getByText('❄️ Mission Inuite')).toBeInTheDocument())

    // Parcours des phases inuit
    fireEvent.click(screen.getByText('✨ Continuer'))
    fireEvent.click(screen.getByText('🌬️ Énigme'))

    // Quiz → sélectionner la bonne réponse
    fireEvent.click(screen.getByRole('button', { name: 'Le vent' }))
    await waitFor(() => expect(screen.getByText('✅ Bonne réponse')).toBeInTheDocument())
    fireEvent.click(screen.getByText('🌕 Continuer'))

    // Hublot (mock) puis passage en phase rêve
    await waitFor(() => expect(screen.getByText(/Hublot Inuite step 1/)).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('complete-hublot'))

    // Phase rêve affichée
    await waitFor(() => expect(screen.getByText('🌱 Générer la graine OnimojIA')).toBeInTheDocument())
  })
})
