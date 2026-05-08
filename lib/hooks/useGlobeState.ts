import { create } from 'zustand'
import type { LoadingStatus } from '@/lib/types/globe'

interface GlobeState {
  status: LoadingStatus
  setReady: () => void
  setError: () => void
}

export const useGlobeState = create<GlobeState>((set, get) => ({
  status: 'loading',
  setReady: () => {
    if (get().status === 'loading') set({ status: 'ready' })
  },
  setError: () => {
    if (get().status === 'loading') set({ status: 'error' })
  },
}))
