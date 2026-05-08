import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('hasWebGL2', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false when getContext returns null', async () => {
    const mockCanvas = { getContext: vi.fn().mockReturnValue(null) }
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any)

    const { hasWebGL2 } = await import('./webgl')
    expect(hasWebGL2()).toBe(false)
  })

  it('returns true when getContext returns a context object', async () => {
    const mockContext = {}
    const mockCanvas = { getContext: vi.fn().mockReturnValue(mockContext) }
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any)

    const { hasWebGL2 } = await import('./webgl')
    expect(hasWebGL2()).toBe(true)
  })
})
