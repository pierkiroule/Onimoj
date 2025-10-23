import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import MissionInuite from '../MissionInuite'

// Mock ModuleInuitStep to expose the open hublot button directly
vi.mock('../../components/ModuleInuitStep.jsx', () => ({
  __esModule: true,
  default: ({ onOpenHublot }) => (
    <div>
      <button aria-label="open-hublot" onClick={onOpenHublot}>open</button>
    </div>
  ),
}))

// Mock HublotResonant: expose a way to complete with 3 emojis
vi.mock('../../components/HublotResonant.jsx', () => ({
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

// Mock Supabase client
vi.mock('../../supabaseClient.js', async () => {
  // implement a lightweight stub that MissionInuite expects
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

  return {
    __esModule: true,
    supabase: {
      auth: {
        getUser: async () => ({ data: { user }, error: null }),
      },
      from: () => ({
        select: () => ({
          order: async () => ({ data: missionSteps, error: null }),
          maybeSingle: async () => ({ data: missionsRow, error: null }),
        }),
        insert: async (rows) => ({ data: rows?.[0] ? { ...rows[0], id: 'ds1' } : null, error: null }),
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
