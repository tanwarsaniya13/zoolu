import React, { useState, useEffect } from 'react'
import { sfx } from '../utils/sound'
import {
  Flame,
  Volume2,
  ArrowRight,
  Disc,
  Radio,
  Eye,
  AlertOctagon,
  Sparkles,
  Zap,
  Play,
  Sword,
} from 'lucide-react'

interface Scene1Props {
  onComplete: () => void
  hasInteracted: boolean
  onFirstInteract: () => void
}

export const Scene1Intro: React.FC<Scene1Props> = ({
  onComplete,
  hasInteracted,
  onFirstInteract,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('')
  const [showSubtext, setShowSubtext] = useState<boolean>(false)
  const [canProceed, setCanProceed] = useState<boolean>(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)
  const [panicLevelActive, setPanicLevelActive] = useState<boolean>(false)
  const [scanStep, setScanStep] = useState<number>(1)

  const fullQuote = '“Baccha hai tu mera, answer sahi diyo bas.”'

  // Animate Biometric Scanner Metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setScanStep((prev) => (prev % 4) + 1)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  // Start the transmission
  const startTransmission = () => {
    onFirstInteract()
    setIsAudioPlaying(true)
    sfx.initCtx()

    // 1. Speak Dialogue with browser speech synthesis + radio static burst
    sfx.speakDialogue()

    // 2. Animate Typewriter Text
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullQuote.length) {
        setDisplayedText(fullQuote.slice(0, currentIndex))
        if (currentIndex % 3 === 0) {
          sfx.playClick()
        }
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowSubtext(true), 500)
        setTimeout(() => setCanProceed(true), 1100)
      }
    }, 60)
  }

  // Handle Red Alert Lever Trigger
  const handleTogglePanic = () => {
    sfx.playAlarm()
    setPanicLevelActive((prev) => !prev)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 select-none overflow-y-auto ${
        panicLevelActive ? 'animate-pulse bg-red-950/60' : 'bg-black/60 backdrop-blur-[2px]'
      }`}
    >
      {/* Top Anime Cyber Strip */}
      <div className="absolute top-4 inset-x-4 max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#ff2a14]/60 pb-2 z-20">
        <div className="flex items-center gap-2 text-xs">
          <Flame className="w-4 h-4 text-[#ff2a14] animate-bounce" />
          <span className="font-extrabold tracking-wider text-[#ffe600] uppercase font-display">
            DEMON SLAYER MATRIX // 全集中 ANTI-HUMAN GATEWAY
          </span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-[#ff2a14] text-white font-bold">
            BREATH OF REVERSE LOGIC
          </span>
        </div>

        {/* Panic Red Alert Lever */}
        <button
          onClick={handleTogglePanic}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 flex items-center gap-1.5 cursor-pointer transition-all ${
            panicLevelActive
              ? 'bg-[#ff007f] text-white border-black shadow-[2px_2px_0px_#ffe600]'
              : 'bg-black/80 text-[#ffe600] border-[#ffe600] hover:bg-[#ff2a14] hover:text-white'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{panicLevelActive ? 'FLAME BERSERK ACTIVE!' : 'DO NOT PULL LEVER'}</span>
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="max-w-3xl w-full my-auto py-10 px-4 flex flex-col items-center text-center space-y-5 relative z-10">
        {/* RETINAL & BIOMETRIC ANIME SCANNER HUD */}
        <div className="w-full max-w-lg p-3 bg-black/85 border-2 border-[#ffe600] shadow-[4px_4px_0px_#ff2a14] flex items-center justify-between text-[11px] font-mono backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#ffe600]">
            <Eye className="w-4 h-4 text-[#ff2a14] animate-pulse" />
            <span className="font-bold">ANIME TARGET RADAR:</span>
          </div>
          <div className="text-zinc-200 font-bold">
            {scanStep === 1 && <span className="text-[#ffe600]">AURA DETECTED: 89% HUMAN CHAOS</span>}
            {scanStep === 2 && <span className="text-[#ff2a14]">NICHIREN BLADE RESONANCE: ZERO</span>}
            {scanStep === 3 && <span className="text-emerald-400">ORGANIC SWEAT: 100% AUTHENTIC</span>}
            {scanStep === 4 && <span className="text-purple-400">MACHINE LOGIC: EXTERMINATED</span>}
          </div>
        </div>

        {/* VINTAGE ANALOG CASSETTE / VOICE INTERCEPT DECK */}
        <div className="card-brutal p-6 w-full max-w-xl bg-black/90 relative border-4 border-black shadow-[8px_8px_0px_#ffe600] backdrop-blur-md">
          {/* Deck Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-[#ff2a14] animate-pulse" />
              <span className="text-xs font-black tracking-widest text-[#ffe600] uppercase font-display">
                AUDIO INTERCEPT // WIRE RECORDER 99-X
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-[#ff2a14] text-white font-mono font-bold">
              CLASSIFIED TRANSMISSION
            </span>
          </div>

          {/* Dual Spinning Cassette Reels Animation */}
          <div className="flex items-center justify-center gap-8 py-3 bg-zinc-950/80 border-2 border-black p-4 mb-4">
            <div className="flex items-center gap-2">
              <Disc
                className={`w-14 h-14 text-[#ffe600] ${
                  isAudioPlaying ? 'animate-spin' : 'opacity-50'
                }`}
                style={{ animationDuration: '2s' }}
              />
              <span className="text-[9px] text-zinc-400 font-mono">REEL-A</span>
            </div>

            {/* Glowing Magnetic Wire with anime sparks */}
            <div className="h-1.5 flex-1 bg-gradient-to-r from-[#ffe600] via-[#ff2a14] to-[#ffe600] relative overflow-hidden">
              <div
                className={`w-4 h-full bg-white absolute ${
                  isAudioPlaying ? 'animate-[scanline_1s_linear_infinite]' : ''
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-400 font-mono">REEL-B</span>
              <Disc
                className={`w-14 h-14 text-[#ff007f] ${
                  isAudioPlaying ? 'animate-spin' : 'opacity-50'
                }`}
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>

          {/* Audio Waveform Oscilloscope Bars */}
          <div className="flex items-end justify-center gap-1.5 h-12 mb-4 px-4 bg-black border border-zinc-800">
            {[45, 80, 95, 60, 100, 75, 50, 90, 65, 85, 40, 70, 90, 55, 75].map((h, i) => (
              <span
                key={i}
                className="w-1.5 transition-all duration-150"
                style={{
                  height: isAudioPlaying ? `${h}%` : '15%',
                  backgroundColor: i % 3 === 0 ? '#ff2a14' : i % 2 === 0 ? '#ffe600' : '#ff007f',
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* The Big Audio Activation Button */}
          {!isAudioPlaying ? (
            <button
              onClick={startTransmission}
              className="w-full btn-brutal-yellow py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-black shadow-[4px_4px_0px_#ff2a14] animate-bounce"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>▶ BROADCAST INTERCEPTED DIALOGUE AUDIO</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>BROADCASTING HINDI DIALOGUE (PLAYING LOUD & CLEAR)</span>
            </div>
          )}
        </div>

        {/* The Spoken Hindi Line with Dramatic Anime Impact Effect */}
        {displayedText && (
          <div className="min-h-[80px] flex items-center justify-center">
            <div className="relative">
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#ffe600] leading-tight glitch-text drop-shadow-[0_4px_16px_rgba(255,42,20,0.8)]"
                data-text={displayedText}
              >
                {displayedText}
                <span className="inline-block w-3 h-8 bg-[#ff2a14] ml-2 animate-pulse align-middle" />
              </h1>
            </div>
          </div>
        )}

        {/* Translation and Paranoia Explanations */}
        {showSubtext && (
          <div className="space-y-3 animate-fade-in max-w-xl mx-auto text-left bg-black/90 p-5 border-2 border-[#ffe600] shadow-[4px_4px_0px_#ff2a14] backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff2a14]">
              <Zap className="w-4 h-4 text-[#ffe600] animate-bounce" />
              <span>BREATHING STYLE DECREE // PARADOX LAW:</span>
            </div>
            <p className="text-zinc-200 text-xs sm:text-sm font-mono">
              &gt; Translation: <span className="text-[#ffe600] italic font-bold">“You are my kid, just give the right answer.”</span>
            </p>
            <p className="text-[#fbf6ea] text-xs font-mono leading-relaxed">
              &gt; THE PARADOX LAW: Logical answers belong to cold calculating machines. The &ldquo;right&rdquo; answer is whatever causes maximum synthetic confusion.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Discreet Continue Control */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <button
          onClick={() => {
            sfx.playSuccess()
            onComplete()
          }}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            canProceed
              ? 'btn-brutal-yellow animate-bounce shadow-[4px_4px_0px_#ff2a14]'
              : 'bg-black/80 text-zinc-300 border border-zinc-600 hover:text-white hover:border-[#ffe600]'
          }`}
        >
          <span>{canProceed ? 'ENTER ANTI-HUMAN GATEWAY (SCENE 2)' : 'DISCREET CONTINUE (SKIP INTRO)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <span className="text-[9px] text-zinc-400 font-mono bg-black/60 px-2 py-0.5">
          Audio feed: YouTube Short dialogue + speech synthesizer
        </span>
      </div>
    </div>
  )
}
