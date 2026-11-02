import React, { useRef, useEffect, useState, useCallback } from 'react'
import { sfx } from '../utils/sound'
import { Flag, ShieldAlert, Award, RotateCcw, ArrowRight, Gauge, Navigation } from 'lucide-react'

interface Scene5Props {
  onComplete: () => void
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'oil' | 'cone' | 'barrier'
}

interface BotCar {
  name: string
  x: number
  y: number
  speed: number
  color: string
}

export const Scene5AntiRacing: React.FC<Scene5Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Game state
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'busted'>('intro')
  const [retreatProgress, setRetreatProgress] = useState<number>(0)
  const [playerSpeed, setPlayerSpeed] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [warningMessage, setWarningMessage] = useState<string | null>(null)
  const [finalScore, setFinalScore] = useState<{ time: number; cowardiceRating: string }>({
    time: 0,
    cowardiceRating: 'S-TIER MEATBAG',
  })

  // Controls state
  const keysRef = useRef<{
    ArrowUp: boolean
    ArrowDown: boolean
    ArrowLeft: boolean
    ArrowRight: boolean
    KeyW: boolean
    KeyS: boolean
    KeyA: boolean
    KeyD: boolean
  }>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  })

  // Internal physics coordinates
  const gameData = useRef<{
    playerX: number
    playerY: number
    playerVy: number
    playerVx: number
    targetDistance: number
    currentDistance: number
    bots: BotCar[]
    obstacles: Obstacle[]
    roadScroll: number
    lastTime: number
    alarmCooldown: number
  }>({
    playerX: 180,
    playerY: 260,
    playerVy: 0,
    playerVx: 0,
    targetDistance: 1200, // Distance to reverse back to starting bunker
    currentDistance: 0,
    bots: [
      { name: 'BOT-GPT-9', x: 80, y: 150, speed: 4.8, color: '#38bdf8' },
      { name: 'AUTONOMOUS-X', x: 220, y: 200, speed: 5.2, color: '#a855f7' },
      { name: 'SPEED-MATRIX', x: 340, y: 100, speed: 6.0, color: '#ef4444' },
    ],
    obstacles: [
      { x: 120, y: -200, width: 34, height: 34, type: 'oil' },
      { x: 280, y: -450, width: 40, height: 25, type: 'cone' },
      { x: 190, y: -750, width: 60, height: 20, type: 'barrier' },
      { x: 100, y: -1050, width: 34, height: 34, type: 'oil' },
    ],
    roadScroll: 0,
    lastTime: 0,
    alarmCooldown: 0,
  })

  // Start the race
  const startGame = () => {
    sfx.playSuccess()
    setGameState('playing')
    setRetreatProgress(0)
    setWarningMessage(null)
    gameData.current.currentDistance = 0
    gameData.current.playerX = 180
    gameData.current.playerY = 260
    gameData.current.playerVy = 0
    gameData.current.playerVx = 0
    gameData.current.lastTime = performance.now()
  }

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)
      ) {
        e.preventDefault() // prevent page scroll
      }
      if (e.code in keysRef.current) {
        keysRef.current[e.code as keyof typeof keysRef.current] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keysRef.current) {
        keysRef.current[e.code as keyof typeof keysRef.current] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch handlers for mobile
  const setTouchKey = (key: 'left' | 'right' | 'reverse' | 'forward', pressed: boolean) => {
    if (key === 'left') keysRef.current.ArrowLeft = pressed
    if (key === 'right') keysRef.current.ArrowRight = pressed
    if (key === 'reverse') keysRef.current.ArrowDown = pressed
    if (key === 'forward') keysRef.current.ArrowUp = pressed
  }

  // Main Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return

    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = (timestamp: number) => {
      const gd = gameData.current
      const keys = keysRef.current

      // Timer
      setElapsedTime((prev) => +(prev + 0.016).toFixed(2))

      // --- 1. PLAYER PHYSICS ---
      // REVERSE IS FORWARD FOR US!
      // ArrowDown / S = Accelerate BACKWARDS towards safety bunker (THE GOAL!)
      // ArrowUp / W = Accelerate FORWARDS towards finish line (WRONG!)
      const isReversing = keys.ArrowDown || keys.KeyS
      const isMovingForward = keys.ArrowUp || keys.KeyW
      const isLeft = keys.ArrowLeft || keys.KeyA
      const isRight = keys.ArrowRight || keys.KeyD

      if (isReversing) {
        gd.playerVy = Math.min(gd.playerVy + 0.35, 8.5) // Max reverse speed
        if (Math.random() < 0.1) sfx.playEngineRev(1.1)
      } else if (isMovingForward) {
        gd.playerVy = Math.max(gd.playerVy - 0.25, -5.0) // Moving towards finish line!
      } else {
        // Friction
        gd.playerVy *= 0.94
      }

      if (isLeft) {
        gd.playerVx = Math.max(gd.playerVx - 0.4, -4.5)
      } else if (isRight) {
        gd.playerVx = Math.min(gd.playerVx + 0.4, 4.5)
      } else {
        gd.playerVx *= 0.88
      }

      // Update positions
      gd.playerX += gd.playerVx
      // Road boundaries
      if (gd.playerX < 50) gd.playerX = 50
      if (gd.playerX > 410) gd.playerX = 410

      // Reverse distance accumulation
      gd.currentDistance += gd.playerVy
      if (gd.currentDistance < 0) gd.currentDistance = 0
      gd.roadScroll += gd.playerVy

      const progress = Math.min(100, Math.floor((gd.currentDistance / gd.targetDistance) * 100))
      setRetreatProgress(progress)
      setPlayerSpeed(Math.abs(Math.round(gd.playerVy * 14)))

      // Check if player is heading towards the dangerous finish line
      if (gd.playerVy < -1) {
        gd.alarmCooldown++
        if (gd.alarmCooldown % 35 === 0) {
          sfx.playAlarm()
          setWarningMessage(
            'CRITICAL WARNING: HEADING TOWARDS FINISH LINE! Real humans retreat from deadlines! TURN AROUND!'
          )
        }
      } else if (warningMessage && gd.playerVy > 0) {
        setWarningMessage(null)
      }

      // Check Win Condition: Returned safely to starting grid / bunker!
      if (gd.currentDistance >= gd.targetDistance) {
        sfx.playSuccess()
        setFinalScore({
          time: 14.8,
          cowardiceRating: 'SUPREME ANTI-MACHINE CHAMPION',
        })
        setGameState('won')
        return
      }

      // --- 2. BOTS BEHAVIOR (They race blindly forward towards the finish line) ---
      gd.bots.forEach((bot, idx) => {
        // Bots move forward relative to road
        bot.y -= bot.speed - gd.playerVy * 0.5
        if (bot.y < -100) {
          bot.y = 650 + Math.random() * 200
          bot.x = 70 + idx * 110 + (Math.random() * 40 - 20)
        }
      })

      // --- 3. RENDER GAME CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background Cyber Highway Asphalt
      ctx.fillStyle = '#0c0d14'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Road Borders (Thick Yellow & Pink Neo-Brutalist curbs)
      const curbOffset = (gd.roadScroll * 2) % 40
      for (let y = -40; y < canvas.height + 40; y += 40) {
        const isYellow = ((y + curbOffset) / 40) % 2 === 0
        ctx.fillStyle = isYellow ? '#ffe600' : '#000000'
        ctx.fillRect(35, y + curbOffset, 12, 40)
        ctx.fillRect(413, y + curbOffset, 12, 40)
      }

      // Road Lanes (Dashed White Lines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 4
      ctx.setLineDash([25, 25])
      ctx.lineDashOffset = -gd.roadScroll * 2

      // 3 divider lines across 4 lanes
      ;[130, 230, 330].forEach((lx) => {
        ctx.beginPath()
        ctx.moveTo(lx, 0)
        ctx.lineTo(lx, canvas.height)
        ctx.stroke()
      })
      ctx.setLineDash([]) // Reset

      // FINISH LINE BANNER (At the top - DO NOT GO HERE!)
      ctx.fillStyle = 'rgba(255, 0, 127, 0.2)'
      ctx.fillRect(47, 0, 366, 45)
      ctx.fillStyle = '#ff007f'
      ctx.font = 'bold 11px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText('⚠️ DANGER: FORWARD FINISH LINE (AI TRAP) ⚠️', 230, 20)
      ctx.fillStyle = '#ffe600'
      ctx.fillText('▼ DO NOT CROSS ▼ TURN AROUND ▼', 230, 36)

      // HUMAN RETREAT BUNKER (At the bottom / progress)
      if (progress > 85) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
        ctx.fillRect(47, 500, 366, 80)
        ctx.fillStyle = '#10b981'
        ctx.font = 'bold 13px JetBrains Mono'
        ctx.fillText('🏁 STARTING GRID // HUMAN SAFETY BUNKER 🏁', 230, 545)
      }

      // Draw Bots (Machines zooming forward)
      gd.bots.forEach((bot) => {
        ctx.fillStyle = bot.color
        // Bot car chassis
        ctx.fillRect(bot.x, bot.y, 34, 55)
        // Windshield
        ctx.fillStyle = '#000'
        ctx.fillRect(bot.x + 4, bot.y + 10, 26, 14)
        // Wheels
        ctx.fillStyle = '#ffe600'
        ctx.fillRect(bot.x - 3, bot.y + 6, 4, 12)
        ctx.fillRect(bot.x + 33, bot.y + 6, 4, 12)
        ctx.fillRect(bot.x - 3, bot.y + 36, 4, 12)
        ctx.fillRect(bot.x + 33, bot.y + 36, 4, 12)
        // Bot Name Tag
        ctx.fillStyle = '#fff'
        ctx.font = '8px monospace'
        ctx.fillText(bot.name, bot.x + 17, bot.y - 4)
      })

      // Draw Player Car (Hot Pink & Yellow Brutalist Muscle Car)
      const px = gd.playerX
      const py = gd.playerY

      // Tail lights glow
      ctx.shadowColor = '#ff007f'
      ctx.shadowBlur = 12

      // Car Body
      ctx.fillStyle = '#ff007f'
      ctx.fillRect(px, py, 38, 62)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 3
      ctx.strokeRect(px, py, 38, 62)

      // Racing Stripe (Yellow)
      ctx.fillStyle = '#ffe600'
      ctx.fillRect(px + 14, py, 10, 62)

      // Windshield & Rear glass
      ctx.fillStyle = '#0c0d12'
      ctx.fillRect(px + 6, py + 14, 26, 16)
      ctx.fillRect(px + 6, py + 40, 26, 8)

      // Wheels
      ctx.fillStyle = '#18181b'
      ctx.fillRect(px - 4, py + 8, 5, 14)
      ctx.fillRect(px + 37, py + 8, 5, 14)
      ctx.fillRect(px - 4, py + 40, 5, 14)
      ctx.fillRect(px + 37, py + 40, 5, 14)

      // Reverse lights (Bright white when reversing)
      if (isReversing) {
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 10
        ctx.fillRect(px + 4, py + 58, 6, 4)
        ctx.fillRect(px + 28, py + 58, 6, 4)
      }

      ctx.shadowBlur = 0 // Reset shadow

      // Player Label
      ctx.fillStyle = '#ffe600'
      ctx.font = 'bold 9px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText('YOU (HUMAN FLEEING)', px + 19, py + 76)

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [gameState, warningMessage])

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between bg-black/70 p-3 border-2 border-black gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#ff007f] rotate-180" />
          <div>
            <span className="text-xs font-black tracking-wider text-[#ffe600] uppercase block">
              CHAMBER 05: THE ANTI-RACING ARCADE SIMULATOR
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              PARADOX OBJECTIVE: DRIVE AWAY FROM FINISH LINE BACK TO STARTING POSITION
            </span>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Gauge className="w-4 h-4 text-[#ffe600]" />
              <span>
                REVERSE SPEED: <strong className="text-white">{playerSpeed} MPH</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Flag className="w-4 h-4" />
              <span>RETREAT: {retreatProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Screen */}
      <div className="card-brutal p-3 sm:p-5 relative overflow-hidden flex flex-col items-center">
        {/* Warning Toast if going wrong way */}
        {warningMessage && (
          <div className="w-full mb-3 p-2.5 bg-red-950/90 border-2 border-[#ff007f] text-[#fbf6ea] text-xs font-mono font-bold flex items-center justify-center gap-2 animate-bounce">
            <ShieldAlert className="w-4 h-4 text-[#ff007f]" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Canvas & Overlay Container */}
        <div className="relative border-4 border-black shadow-[6px_6px_0px_#000] bg-black">
          <canvas
            ref={canvasRef}
            width={460}
            height={560}
            className="w-full max-w-[460px] h-[460px] sm:h-[540px] block"
          />

          {/* INTRO SCREEN OVERLAY */}
          {gameState === 'intro' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-3 bg-[#ffe600] text-black border-2 border-black rotate-3">
                <Navigation className="w-8 h-8 rotate-180" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#ffe600]">
                THE ANTI-RACING MATRIX
              </h3>
              <p className="text-xs text-zinc-300 font-mono max-w-sm">
                Synthetic neural nets are trained to cross the finish line as fast as possible. Real humans procrastinate, make U-turns, and retreat safely to the couch.
              </p>
              <div className="bg-zinc-950 p-3 border border-zinc-800 text-left text-xs font-mono space-y-1 text-zinc-300">
                <p className="text-[#ffe600] font-bold">&gt; HOW TO WIN:</p>
                <p>&gt; Press <strong className="text-white">DOWN ARROW / S</strong> to accelerate in REVERSE.</p>
                <p>&gt; Return to the starting position before the bots cross the finish line!</p>
                <p>&gt; Moving forward will trigger immediate bot accusations!</p>
              </div>
              <button
                onClick={startGame}
                className="btn-brutal-yellow px-8 py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer"
              >
                START ANTI-RACE (ENGAGE REVERSE)
              </button>
            </div>
          )}

          {/* VICTORY OVERLAY */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-black/92 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              <div className="p-3 bg-emerald-400 text-black border-2 border-black">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#ffe600]">
                SUPREME ANTI-RACE CHAMPION!
              </h3>
              <p className="text-xs text-emerald-300 font-mono max-w-sm">
                You successfully drove away from the finish line and reached the safety of the starting bunker in record time.
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                <p>COWARDICE RATING: <strong className="text-[#ffe600]">{finalScore.cowardiceRating}</strong></p>
                <p className="text-[11px] text-zinc-400 mt-1">Status: 100% Incompatible with machine racing algorithms.</p>
              </div>
              <button
                onClick={() => {
                  sfx.playSuccess()
                  onComplete()
                }}
                className="btn-brutal-yellow px-8 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO FINAL ROBOT VERIFICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar under canvas */}
        <div className="w-full max-w-[460px] mt-3 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">RETREAT TO STARTING BUNKER</span>
            <span className="text-[#ffe600] font-bold">{retreatProgress}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 border-2 border-black overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffe600] to-[#ff007f] transition-all duration-75"
              style={{ width: `${retreatProgress}%` }}
            />
          </div>
        </div>

        {/* Responsive Touch / On-Screen Game Controls */}
        <div className="w-full max-w-[460px] mt-4 pt-3 border-t-2 border-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          {/* Steering Controls */}
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => setTouchKey('left', true)}
              onMouseUp={() => setTouchKey('left', false)}
              onTouchStart={() => setTouchKey('left', true)}
              onTouchEnd={() => setTouchKey('left', false)}
              className="btn-brutal-cream w-14 h-12 text-sm font-black flex items-center justify-center cursor-pointer"
            >
              ◀ LEFT
            </button>
            <button
              onMouseDown={() => setTouchKey('right', true)}
              onMouseUp={() => setTouchKey('right', false)}
              onTouchStart={() => setTouchKey('right', true)}
              onTouchEnd={() => setTouchKey('right', false)}
              className="btn-brutal-cream w-14 h-12 text-sm font-black flex items-center justify-center cursor-pointer"
            >
              RIGHT ▶
            </button>
          </div>

          {/* Reverse Accelerator (The primary winning control!) */}
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => setTouchKey('forward', true)}
              onMouseUp={() => setTouchKey('forward', false)}
              onTouchStart={() => setTouchKey('forward', true)}
              onTouchEnd={() => setTouchKey('forward', false)}
              className="px-3 h-12 bg-zinc-800 text-zinc-400 border-2 border-black text-xs font-bold hover:text-white"
              title="Drive towards fatal finish line (Wrong direction)"
            >
              FORWARD (WRONG)
            </button>

            <button
              onMouseDown={() => setTouchKey('reverse', true)}
              onMouseUp={() => setTouchKey('reverse', false)}
              onTouchStart={() => setTouchKey('reverse', true)}
              onTouchEnd={() => setTouchKey('reverse', false)}
              className="btn-brutal-pink px-4 h-12 text-xs font-black flex items-center gap-1 cursor-pointer animate-pulse"
              title="Reverse away from finish line towards starting bunker"
            >
              <span>▼ REVERSE (RETREAT!)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

