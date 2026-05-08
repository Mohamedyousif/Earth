'use client'

export default function WebGLErrorState() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black gap-8">
      {/* Atmospheric globe outline */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="text-white/15"
      >
        <circle cx="40" cy="40" r="37" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="40" cy="40" rx="17" ry="37" stroke="currentColor" strokeWidth="1" />
        <line x1="3" y1="40" x2="77" y2="40" stroke="currentColor" strokeWidth="1" />
        {/* Diagonal crack — subtle suggestion of inaccessibility */}
        <line x1="20" y1="15" x2="60" y2="65" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>

      <div className="flex flex-col items-center gap-3 max-w-sm text-center px-8">
        <h1 className="text-white/60 text-base font-light tracking-widest uppercase">
          Wonder Earth cannot be rendered
        </h1>
        <p className="text-white/30 text-sm font-light leading-relaxed">
          This experience requires WebGL 2.0. Try opening it in Chrome, Firefox,
          or Edge.
        </p>
      </div>
    </div>
  )
}
