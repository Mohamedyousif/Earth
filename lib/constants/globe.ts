import type { GlobeConfig } from '@/lib/types/globe'

export const GLOBE_CONFIG: GlobeConfig = {
  textures: {
    day: '/textures/earth-day.jpg',
    specular: '/textures/earth-specular.jpg',
    bump: '/textures/earth-bump.jpg',
  },
  rotation: {
    idleSpeed: 0.5,
    inactivityTimeoutMs: 5000,
    dampingFactor: 0.08,
  },
  zoom: {
    minDistance: 101,
    maxDistance: 500,
  },
  loading: {
    minDisplayMs: 400,
    fadeOutDurationMs: 600,
  },
}
