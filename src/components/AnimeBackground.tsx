import React, { useEffect, useRef, useState } from 'react'
import { Flame, Sparkles, Eye, Film, VolumeX } from 'lucide-react'

interface AnimeBackgroundProps {
  opacity?: number
  showVideo?: boolean
}

export const AnimeBackground: React.FC<AnimeBackgroundProps> = ({
  opacity = 0.55,
  showVideo = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)

  // Anime flame ember sparks particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Flame embers
    interface Ember {
      x: number
      y: number
      radius: number
      speedY: number
      speedX: number
      alpha: number
      color: string
    }

    const colors = ['#ff2a14', '#ff7700', '#ffb800', '#ffe600', '#ff007f']
    const embers: Ember[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 3 + 1,
      speedY: -(Math.random() * 2 + 1),
      speedX: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      embers.forEach((e) => {
        e.y += e.speedY
        e.x += e.speedX + Math.sin(e.y * 0.02) * 0.5
        e.alpha -= 0.003

        if (e.y < -10 || e.alpha <= 0) {
          e.y = canvas.height + 10
          e.x = Math.random() * canvas.width
          e.alpha = Math.random() * 0.8 + 0.3
        }

        ctx.save()
        ctx.shadowBlur = 8
        ctx.shadowColor = e.color
        ctx.fillStyle = e.color
        ctx.globalAlpha = Math.max(0, e.alpha)
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 
        Muted Anime YouTube Video Loop: "Dhurandhar x Demon Slayer | AARI AARI" (4zaqWUkqvIg)
        Notice: strictly muted (mute=1&volume=0) to ensure zero sound interference with dialog/music,
        and scaled 1.35x to eliminate any black bars or YouTube control overlays!
      */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
          <iframe
            src="https://www.youtube.com/embed/4zaqWUkqvIg?autoplay=1&mute=1&controls=0&loop=1&playlist=4zaqWUkqvIg&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1"
            title="Anime Demon Slayer Background Loop"
            className="w-[140vw] h-[140vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none transition-opacity duration-1000"
            style={{
              opacity: isVideoLoaded ? opacity : 0.2,
              filter: 'contrast(125%) saturate(140%) brightness(85%)',
            }}
            onLoad={() => setIsVideoLoaded(true)}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {/* Cyber Anime Overlay Gradient (Ensures foreground UI remains perfectly readable) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/75 to-[#0c0d12]/60 backdrop-blur-[1px]" />

      {/* Anime Embers Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Anime Speedlines Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(12,13,18,0.85)_100%)] pointer-events-none" />

      {/* Anime Kanji Cyber Watermarks */}
      <div className="absolute top-20 right-6 text-right pointer-events-none opacity-20">
        <div className="text-4xl sm:text-6xl font-black text-[#ffe600] tracking-widest font-display">
          全集中
        </div>
        <div className="text-[10px] font-mono font-bold text-[#ff007f] tracking-widest">
          TOTAL CONCENTRATION // BREATH OF LOGIC REVERSAL
        </div>
      </div>

      <div className="absolute bottom-16 left-6 text-left pointer-events-none opacity-20">
        <div className="text-3xl sm:text-5xl font-black text-[#ff2a14] tracking-widest font-display">
          鬼殺隊
        </div>
        <div className="text-[10px] font-mono font-bold text-[#ffe600] tracking-widest">
          DEMON SLAYER MATRIX // ANTI-BOT DIVISION
        </div>
      </div>

      {/* Subtle indicator tag for muted anime visual feed */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-black/70 border border-zinc-800 text-[9px] font-mono text-zinc-400 flex items-center gap-1.5 z-10 backdrop-blur-sm">
        <Flame className="w-2.5 h-2.5 text-[#ff2a14] animate-pulse" />
        <span>ANIME THEME: DEMON SLAYER CINEMATIC (MUTED BACKGROUND)</span>
        <VolumeX className="w-2.5 h-2.5 text-zinc-500" />
      </div>
    </div>
  )
}

