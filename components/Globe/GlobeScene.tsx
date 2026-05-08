'use client'

import { useRef } from 'react'
import Globe from 'react-globe.gl'
import { GLOBE_CONFIG } from '@/lib/constants/globe'
import { useGlobeControls } from './useGlobeControls'

interface GlobeSceneProps {
  onReady: () => void
  onError: () => void
}

export default function GlobeScene({ onReady, onError }: GlobeSceneProps) {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGlobeControls({ globeRef, containerRef })

  return (
    <div ref={containerRef} className="w-full h-full">
      <Globe
        ref={globeRef}
        globeImageUrl={GLOBE_CONFIG.textures.day}
        bumpImageUrl={GLOBE_CONFIG.textures.bump}
        showAtmosphere={true}
        showGraticules={false}
        backgroundColor="rgba(0,0,0,0)"
        onGlobeReady={onReady}
      />
    </div>
  )
}
