import { useEffect } from 'react'
import { GLOBE_CONFIG } from '@/lib/constants/globe'

interface UseGlobeControlsOptions {
  globeRef: React.RefObject<any>
}

export function useGlobeControls({ globeRef }: UseGlobeControlsOptions): void {
  // Basic rotation, damping, zoom constraints
  useEffect(() => {
    if (!globeRef.current) return

    const controls = globeRef.current.controls()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = GLOBE_CONFIG.rotation.idleSpeed
    controls.enableDamping = true
    controls.dampingFactor = GLOBE_CONFIG.rotation.dampingFactor
    controls.minDistance = GLOBE_CONFIG.zoom.minDistance
    controls.maxDistance = GLOBE_CONFIG.zoom.maxDistance
  }, [globeRef])

  // Pause/resume auto-rotation on interaction
  useEffect(() => {
    if (!globeRef.current) return

    const controls = globeRef.current.controls()
    if (!controls) return

    let inactivityTimer: ReturnType<typeof setTimeout>

    const pauseHandler = () => {
      controls.autoRotate = false
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        controls.autoRotate = true
      }, GLOBE_CONFIG.rotation.inactivityTimeoutMs)
    }

    controls.addEventListener('change', pauseHandler)

    return () => {
      controls.removeEventListener('change', pauseHandler)
      clearTimeout(inactivityTimer)
    }
  }, [globeRef])

}
