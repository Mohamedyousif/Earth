export type LoadingStatus = 'loading' | 'ready' | 'error'

export interface GlobeConfig {
  textures: {
    day: string
    specular: string
    bump: string
  }
  rotation: {
    idleSpeed: number
    inactivityTimeoutMs: number
    dampingFactor: number
  }
  zoom: {
    minDistance: number
    maxDistance: number
  }
  loading: {
    minDisplayMs: number
    fadeOutDurationMs: number
  }
}
