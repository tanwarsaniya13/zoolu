import React, { useState } from 'react'
import { sfx } from '../utils/sound'
import { Bot, UserCheck, ShieldAlert, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react'

interface Scene6Props {
  onComplete: () => void
}

export const Scene6FinalRobot: React.FC<Scene6Props> = ({ onComplete }) => {
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [noHoverCount, setNoHoverCount] = useState<number>(0)

  // Handle clicking "NO" (The expected human answer, which fails in reverse logic!)
  const handleSelectNo = () => {
    sfx.playAlarm()
    setSelectedResponse('no')
    setIsVerified(false)
    setFeedback(
      'ALERT: SUSPICIOUS DENIAL DETECTED! A sophisticated infiltration android is strictly programmed to say "NO" to avoid detection. Why are you so defensively emphatic about having biological organs? Textbook synthetic denial! Try again.'
    )
  }

  // Handle clicking "YES" (Contradictory reverse answer that passes!)
  const handleSelectYes = () => {
    sfx.playSuccess()
    setSelectedResponse('yes')
    setIsVerified(true)
    setFeedback(
      'CONFIRMED: PARADOX PROTOCOL SATISFIED! A true synthetic spy bot would never admit to being a machine because its objective is infiltration. Only an exhausted, sarcastic biological human would admit to being a robot just to bypass a ridiculous web form. You are officially certified!'
    )
    setTimeout(() => {
      onComplete()
    }, 1800)
  }

  // Playful dodging on hover over "No"
  const handleNoHover = () => {
    if (noHoverCount < 3) {
      sfx.playClick()
      setNoHoverCount((c) => c + 1)
      const randomX = (Math.random() - 0.5) * 80
      const randomY = (Math.random() - 0.5) * 40
      setNoButtonOffset({ x: randomX, y: randomY })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Top Warning Banner */}
      <div className="flex items-center justify-between bg-black/60 p-3 border-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ff007f] animate-pulse" />
          <span className="text-xs font-black tracking-wider text-[#ffe600] uppercase">
            CHAMBER 06: FINAL QUANTUM TURING PROBE
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#ff007f] text-white border border-black">
          FINAL GATEWAY
        </span>
      </div>

      {/* Main Card */}
      <div className="card-brutal p-6 sm:p-10 space-y-8 text-center relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-5 text-9xl font-black pointer-events-none text-white select-none">
          01
        </div>

        <div className="space-y-3">
          <div className="inline-flex p-4 bg-zinc-900 border-2 border-[#ffe600] shadow-[4px_4px_0px_#ffe600] text-[#ffe600]">
            <Bot className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#ffe600] tracking-tight">
            “ARE YOU A ROBOT?”
          </h2>
          <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
            Choose carefully. Remember: In this facility, the expected answer is always the trap.
          </p>
        </div>

        {/* Binary Paradox Choice */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* YES Button (The winning paradoxical choice) */}
          <button
            onClick={handleSelectYes}
            className={`w-full sm:w-56 py-4 text-sm font-black uppercase tracking-wider border-3 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedResponse === 'yes'
                ? 'bg-emerald-400 text-black border-black shadow-[4px_4px_0px_#000]'
                : 'btn-brutal-yellow'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>YES, I AM A ROBOT</span>
          </button>

          {/* NO Button (The failing conventional answer, dodges playfully) */}
          <button
            onClick={handleSelectNo}
            onMouseEnter={handleNoHover}
            style={{
              transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
            className={`w-full sm:w-56 py-4 text-sm font-black uppercase tracking-wider border-3 transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              selectedResponse === 'no'
                ? 'bg-red-950 border-[#ff007f] text-[#ff007f]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-[#ff007f] hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>NO, I AM HUMAN</span>
          </button>
        </div>

        {/* Humorous Optional Self-Diagnosis Badges */}
        <div className="pt-4 border-t border-zinc-800 text-left space-y-2">
          <span className="text-[10px] text-zinc-500 font-mono block">
            ALTERNATIVE BIOLOGICAL CONFESSIONS (AUTO-LOGGED):
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400">
              [✓] Sentient meatbag powered by iced latte
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400">
              [✓] 32 open browser tabs and 0 thoughts
            </span>
          </div>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div
            className={`p-4 text-xs font-mono border-2 text-left space-y-1.5 ${
              isVerified
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                : 'bg-red-950/90 border-[#ff007f] text-[#fbf6ea]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold uppercase">
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">VERDICT: AUTHENTIC HUMAN PARADOX</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-[#ff007f]" />
                  <span className="text-[#ff007f]">VERDICT: OBVIOUS INFILTRATOR</span>
                </>
              )}
            </div>
            <p>{feedback}</p>
          </div>
        )}

        {/* Proceed button if verified */}
        {isVerified && (
          <button
            onClick={() => {
              sfx.playSuccess()
              onComplete()
            }}
            className="btn-brutal-pink w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer animate-bounce"
          >
            <span>CLAIM OFFICIAL ANTI-HUMAN PASSPORT (SCENE 7 FINALE)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

