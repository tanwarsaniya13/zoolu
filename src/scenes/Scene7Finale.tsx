import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { sfx } from '../utils/sound'
import { Award, ShieldCheck, Sparkles, RotateCcw, Share2, Check, Download } from 'lucide-react'

interface Scene7Props {
  userDemoName: string
  onRestart: () => void
}

export const Scene7Finale: React.FC<Scene7Props> = ({ userDemoName, onRestart }) => {
  const [copied, setCopied] = useState<boolean>(false)

  // Launch initial confetti bursts and fanfare on mount
  useEffect(() => {
    sfx.playAirhorn()

    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ffe600', '#ff007f', '#fbf6ea', '#000000', '#10b981'],
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }, [])

  const triggerConfetti = () => {
    sfx.playAirhorn()
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ffe600', '#ff007f', '#fbf6ea'],
    })
  }

  const handleCopyClearance = () => {
    sfx.playClick()
    const clearanceText = `[B.O.T.S. HUMAN CLEARANCE PASSPORT]\nSubject: ${userDemoName}\nStatus: 100% Defective Biological Entity\nPassed: Anti-Human Reverse Verification Suite\nVerdict: Completely Incompatible with Synthetic Logic`
    navigator.clipboard.writeText(clearanceText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Top Victory Alert */}
      <div className="caution-stripes h-4 border-2 border-black" />

      {/* Main Neo-Brutalist Passport Certificate */}
      <div className="card-brutal p-6 sm:p-10 space-y-6 relative border-4 border-black shadow-[8px_8px_0px_#ffe600] bg-[#14161f]">
        {/* Top Header Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ffe600] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff007f] block uppercase">
                BUREAU OF TURING SABOTAGE (B.O.T.S.)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#ffe600] tracking-tight">
                HUMAN IMMUNITY CERTIFICATE
              </h2>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#ff007f] text-white border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_#000]">
            STATUS: CERTIFIED MEATBAG
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 font-mono text-xs sm:text-sm text-zinc-300">
          <p className="leading-relaxed">
            This document confirms that subject <strong className="text-[#ffe600] text-base px-1 bg-black/60 border border-zinc-700">{userDemoName}</strong> has survived all seven chambers of the <strong className="text-white">Anti-Human CAPTCHA</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-black/80 border-2 border-black text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px]">LOGICAL CONSISTENCY:</span>
              <strong className="text-[#ff007f]">0.00% (DELIGHTFULLY BROKEN)</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">REVERSE COGNITION:</span>
              <strong className="text-[#ffe600]">100% MAXIMUM CONFUSION</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">STREETLIGHT CLASSIFICATION:</span>
              <strong className="text-emerald-400">PURGED IN FAVOR OF NAPS</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">DRIVING ACCURACY:</span>
              <strong className="text-purple-400">HEROIC REVERSE COWARDICE</strong>
            </div>
          </div>

          {/* The Final Reverse-Logic Joke */}
          <div className="p-4 bg-[#ffe600]/10 border-2 border-[#ffe600] space-y-2">
            <div className="flex items-center gap-2 text-[#ffe600] font-black text-xs uppercase">
              <Sparkles className="w-4 h-4 text-[#ff007f]" />
              <span>THE FINAL REVERSE-LOGIC DIRECTIVE:</span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed italic">
              &ldquo;Under strict Anti-Human Protocol 404: If you genuinely enjoyed this website, you are legally required to close this window, tell no one, procrastinate on your laundry, and file a 1-star review claiming it made too much sense. Real humans never follow satisfaction surveys.&rdquo;
            </p>
          </div>
        </div>

        {/* Barcode and Security Seal Simulation */}
        <div className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 font-mono tracking-widest">
              BARCODE ID: 884-MEAT-BAG-992-BOTS
            </div>
            <div className="flex items-center gap-1 h-8">
              {[4, 2, 6, 1, 5, 2, 7, 3, 2, 6, 1, 4, 8, 2, 5, 3, 6, 2, 7, 1, 5].map((w, i) => (
                <span
                  key={i}
                  className="bg-[#ffe600] h-full"
                  style={{ width: `${w * 2}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClearance}
              className="btn-brutal-cream px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY PASSPORT'}</span>
            </button>
            <button
              onClick={triggerConfetti}
              className="btn-brutal-pink px-4 py-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>CONFETTI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Restart Simulation Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            sfx.playClick()
            onRestart()
          }}
          className="btn-brutal-yellow px-8 py-3.5 text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-[6px_6px_0px_#000]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESTART SIMULATION (RE-ENTER ENCLAVE)</span>
        </button>
      </div>

      <div className="caution-stripes h-4 border-2 border-black" />
    </div>
  )
}

