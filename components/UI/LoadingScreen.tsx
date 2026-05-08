'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { GLOBE_CONFIG } from '@/lib/constants/globe'

interface LoadingScreenProps {
  show: boolean
  onHidden: () => void
}

export default function LoadingScreen({ show, onHidden }: LoadingScreenProps) {
  const [scope, animate] = useAnimate()
  const mountTime = useRef(Date.now())

  useEffect(() => {
    if (show) return

    const elapsed = Date.now() - mountTime.current
    const remaining = Math.max(0, GLOBE_CONFIG.loading.minDisplayMs - elapsed)

    const timer = setTimeout(async () => {
      await animate(
        scope.current,
        { opacity: 0 },
        { duration: GLOBE_CONFIG.loading.fadeOutDurationMs / 1000 }
      )
      onHidden()
    }, remaining)

    return () => clearTimeout(timer)
  }, [show, animate, scope, onHidden])

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Atmospheric globe icon */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="text-white/20 animate-pulse"
        >
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="32" cy="32" rx="14" ry="30" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="32" x2="62" y2="32" stroke="currentColor" strokeWidth="1" />
          <line x1="8" y1="16" x2="56" y2="16" stroke="currentColor" strokeWidth="0.75" />
          <line x1="8" y1="48" x2="56" y2="48" stroke="currentColor" strokeWidth="0.75" />
        </svg>

        <p className="text-white/40 text-sm font-light tracking-[0.25em] uppercase">
          Discovering Earth&hellip;
        </p>
      </div>
    </motion.div>
  )
}
