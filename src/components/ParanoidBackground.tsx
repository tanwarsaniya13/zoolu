import React, { useEffect, useState } from 'react'

interface Drone {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  scanAngle: number
  status: string
}

export const ParanoidBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 300, y: 300 })
  const [drones, setDrones] = useState<Drone[]>([
    { id: 1, x: 80, y: 120, targetX: 80, targetY: 120, scanAngle: 45, status: 'SCANNING_RETINA' },
    { id: 2, x: 880, y: 160, targetX: 880, targetY: 160, scanAngle: 135, status: 'AUDIO_WIRETAP' },
    { id: 3, x: 200, y: 550, targetX: 200, targetY: 550, scanAngle: 30, status: 'MEATBAG_TRACKER' },
  ])

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate hovering drones tracking user
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones((prev) =>
        prev.map((d) => {
          // Slowly drift towards quadrant around mouse with jitter
          const dx = mousePos.x - d.x
          const dy = mousePos.y - d.y
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)

          const jitterX = (Math.random() - 0.5) * 6
          const jitterY = (Math.random() - 0.5) * 6

          return {
            ...d,
            x: Math.max(40, Math.min(window.innerWidth - 80, d.x + jitterX)),
            y: Math.max(40, Math.min(window.innerHeight - 80, d.y + jitterY)),
            scanAngle: angle,
          }
        })
      )
    }, 120)

    return () => clearInterval(interval)
  }, [mousePos])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Dynamic Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffe6000a_1px,transparent_1px),linear-gradient(to_bottom,#ffe6000a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

      {/* Floating Laser Scanning Drones */}
      {drones.map((d) => (
        <div
          key={d.id}
          className="absolute transition-all duration-300 ease-out"
          style={{ left: `${d.x}px`, top: `${d.y}px` }}
        >
          {/* Drone Body */}
          <div className="relative flex flex-col items-center">
            {/* Eye core */}
            <div className="w-8 h-8 rounded-full bg-black border-2 border-[#ffe600] flex items-center justify-center shadow-[0_0_12px_#ffe600]">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff007f] animate-ping" />
              <div className="w-2 h-2 rounded-full bg-white absolute" />
            </div>

            {/* Scanning Laser Beam projecting towards mouse */}
            <div
              className="absolute top-4 left-4 w-48 h-0.5 bg-gradient-to-r from-[#ff007f] via-[#ffe600]/40 to-transparent origin-left opacity-60"
              style={{
                transform: `rotate(${d.scanAngle}deg)`,
              }}
            />

            {/* Drone Tag */}
            <div className="mt-1 px-1.5 py-0.5 bg-black/90 border border-zinc-700 text-[8px] font-mono font-bold text-[#ffe600] whitespace-nowrap shadow-sm">
              [DRONE-0{d.id}] {d.status}
            </div>
          </div>
        </div>
      ))}

      {/* Ambient Glitch Warning Watermarks */}
      <div className="absolute top-1/4 right-8 text-[10px] font-mono text-[#ffe600]/15 space-y-1 text-right select-none">
        <p>REVERSE_LOGIC_ENGINE: 0x992B</p>
        <p>PARANOIA_INDEX: MAXIMUM_OVERLOAD</p>
        <p>BIOMETRIC_ANOMALY: DETECTED</p>
        <p>MACHINE_TURING_FAIL: TRUE</p>
      </div>

      <div className="absolute bottom-1/4 left-8 text-[10px] font-mono text-[#ff007f]/15 space-y-1 text-left select-none">
        <p>&gt; RUNNING_TURING_PROBE...</p>
        <p>&gt; SCANNING_MOUSE_PATH...</p>
        <p>&gt; IRRATIONALITY_CONFIRMED</p>
      </div>
    </div>
  )
}

