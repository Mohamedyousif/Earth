import { describe, it, expect, beforeEach } from 'vitest'
import { useGlobeState } from './useGlobeState'

describe('useGlobeState', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useGlobeState.setState({ status: 'loading' })
  })

  it('initial status is loading', () => {
    expect(useGlobeState.getState().status).toBe('loading')
  })

  it('setReady transitions status to ready', () => {
    useGlobeState.getState().setReady()
    expect(useGlobeState.getState().status).toBe('ready')
  })

  it('setError transitions status to error', () => {
    useGlobeState.getState().setError()
    expect(useGlobeState.getState().status).toBe('error')
  })

  it('setReady after setError does not change status (terminal state)', () => {
    useGlobeState.getState().setError()
    useGlobeState.getState().setReady()
    expect(useGlobeState.getState().status).toBe('error')
  })

  it('setError after setReady does not change status (terminal state)', () => {
    useGlobeState.getState().setReady()
    useGlobeState.getState().setError()
    expect(useGlobeState.getState().status).toBe('ready')
  })
})
