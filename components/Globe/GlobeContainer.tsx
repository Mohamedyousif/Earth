'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGlobeState } from '@/lib/hooks/useGlobeState'
import { hasWebGL2 } from '@/lib/utils/webgl'
import LoadingScreen from '@/components/UI/LoadingScreen'
import WebGLErrorState from '@/components/UI/WebGLErrorState'

const GlobeScene = dynamic(() => import('./GlobeScene'), { ssr: false })

export default function GlobeContainer() {
  const { status, setReady, setError } = useGlobeState()
  const [showLoader, setShowLoader] = useState(true)

  // WebGL 2.0 detection — runs once on mount (client only)
  useEffect(() => {
    if (!hasWebGL2()) {
      setError()
    }
  }, [setError])

  if (status === 'error') {
    return <WebGLErrorState />
  }

  return (
    <div className="w-full h-full relative">
      {showLoader && (
        <LoadingScreen
          show={status === 'loading'}
          onHidden={() => setShowLoader(false)}
        />
      )}
      {/* GlobeScene mounts immediately — initializes WebGL behind the loading screen */}
      <GlobeScene onReady={setReady} onError={setError} />
    </div>
  )
}
