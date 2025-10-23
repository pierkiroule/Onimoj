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
  default: ({ onComplete, step, culture }) => (
    <div>
      <div>Hublot {culture} step {step?.step_number}</div>
      <button aria-label="complete-hublot" onClick={() => onComplete?.({
        title: `${culture} — ${step?.spirit_name || 'Bulle mythonirique'}`,
        emojis: ['🌬️','🐋','🦌'],
        culture,
        spirit: step?.spirit_name || '',
        step_number: step?.step_number || 1,
      })}>complete</button>
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

    // Open hublot via module button
    fireEvent.click(screen.getByLabelText('open-hublot'))

    // Complete hublot selection
    await waitFor(() => expect(screen.getByText(/Hublot Inuite/)).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('complete-hublot'))

    // Enter title and save
    const input = await screen.findByPlaceholderText('Titre de ta bulle mythonirique…')
    fireEvent.change(input, { target: { value: 'Ma bulle' } })
    const saveBtn = screen.getByRole('button', { name: /Enregistrer dans l’échocreation/ })
    fireEvent.click(saveBtn)

    // Expect success status to appear
    await waitFor(() => expect(screen.getByText(/Bulle enregistrée/)).toBeInTheDocument())
  })
})
