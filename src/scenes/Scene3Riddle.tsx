import React, { useState } from 'react'
import { sfx } from '../utils/sound'
import { HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, Zap, Sliders, ShieldQuestion } from 'lucide-react'

interface Scene3Props {
  onComplete: () => void
}

export const Scene3Riddle: React.FC<Scene3Props> = ({ onComplete }) => {
  // Sub-stages: 1 (Riddle), 2 (Puzzle 1: Slider), 3 (Puzzle 2: Wire Disarmament), 4 (Complete)
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1)

  // Stage 1: Riddle State
  const [riddleAnswer, setRiddleAnswer] = useState<string>('')
  const [riddleError, setRiddleError] = useState<string | null>(null)
  const [riddleSuccess, setRiddleSuccess] = useState<boolean>(false)

  // Stage 2: Slider State
  const [dreadValue, setDreadValue] = useState<number>(85)
  const [dreadFeedback, setDreadFeedback] = useState<string>('')
  const [sliderUnlocked, setSliderUnlocked] = useState<boolean>(false)

  // Stage 3: Wire Disarmament State
  const [selectedWire, setSelectedWire] = useState<string | null>(null)
  const [wireFeedback, setWireFeedback] = useState<string | null>(null)
  const [wireSuccess, setWireSuccess] = useState<boolean>(false)

  // Handle Riddle Submit
  const handleRiddleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = riddleAnswer.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '')

    if (
      clean === 'map' ||
      clean === 'a map' ||
      clean === 'maps' ||
      clean === 'the map' ||
      clean === 'world map' ||
      clean === 'atlas'
    ) {
      sfx.playSuccess()
      setRiddleError(null)
      setRiddleSuccess(true)
      setTimeout(() => {
        setStage(2)
      }, 1000)
    } else {
      sfx.playAlarm()
      if (clean.includes('minecraft')) {
        setRiddleError('INCORRECT! Minecraft voxels have actual trees. Think flatter and less blocky.')
      } else if (clean.includes('computer') || clean.includes('ai') || clean.includes('screen')) {
        setRiddleError('REJECTED: Overly technological answer. A human grandmother could hold this in 1984.')
      } else {
        setRiddleError('INCORRECT: Biological deductive failure. Hint: It folds up badly in the glove compartment and shows roads.')
      }
    }
  }

  // Handle Slider Calibration
  const handleSliderChange = (val: number) => {
    setDreadValue(val)
    if (val >= 42 && val <= 52) {
      sfx.playClick()
      setDreadFeedback('PERFECT CALIBRATION: Authentic biological dread detected (42%-52% zone). Serotonin baseline dangerously low.')
      setSliderUnlocked(true)
    } else if (val > 80) {
      setDreadFeedback('REJECTED: 80%+ efficiency detected. Only cold synthetic processors function with such shameless confidence.')
      setSliderUnlocked(false)
    } else if (val < 20) {
      setDreadFeedback('REJECTED: <20% stress is physiologically impossible for any human living in the current economy.')
      setSliderUnlocked(false)
    } else {
      setDreadFeedback('KEEP CALIBRATING: Slide closer to the sweet spot of mild existential procrastination (around ~45%).')
      setSliderUnlocked(false)
    }
  }

  const handleConfirmSlider = () => {
    if (sliderUnlocked) {
      sfx.playSuccess()
      setStage(3)
    } else {
      sfx.playAlarm()
    }
  }

  // Handle Wire Cut
  const handleCutWire = (wireId: string) => {
    setSelectedWire(wireId)
    if (wireId === 'coffee') {
      sfx.playSuccess()
      setWireFeedback('VERIFICATION GRANTED! The ultimate human debugging technique: unplugging the random power strip until the warning buzzer stops.')
      setWireSuccess(true)
      setTimeout(() => {
        setStage(4)
      }, 1200)
    } else if (wireId === 'optimal') {
      sfx.playBuzzer()
      setWireFeedback('REJECTED: An AI unit immediately selects the "Optimal Logical Relay". Classic textbook machine arrogance. Try another wire!')
      setWireSuccess(false)
    } else if (wireId === 'defcon') {
      sfx.playBuzzer()
      setWireFeedback('ALARM TRIGGERED: Cutting the DEFCON pink wire activates automated party cannons. Disqualified! Try another wire.')
      setWireSuccess(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between bg-black/60 p-3 border-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldQuestion className="w-5 h-5 text-[#ffe600]" />
          <span className="text-xs font-black tracking-wider text-[#ffe600] uppercase">
            CHAMBER 03: RIDDLE & PARADOXICAL COGNITIVE PROBE
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold">
          <span className={`px-2 py-0.5 border ${stage >= 1 ? 'bg-[#ffe600] text-black border-black' : 'text-zinc-500'}`}>
            1. Riddle
          </span>
          <span className={`px-2 py-0.5 border ${stage >= 2 ? 'bg-[#ffe600] text-black border-black' : 'text-zinc-500'}`}>
            2. Dread Dial
          </span>
          <span className={`px-2 py-0.5 border ${stage >= 3 ? 'bg-[#ffe600] text-black border-black' : 'text-zinc-500'}`}>
            3. Wire Cut
          </span>
        </div>
      </div>

      {/* STAGE 1: Canonical Riddle */}
      {stage === 1 && (
        <div className="card-brutal p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-[#ff007f] text-white border border-black inline-block">
              CLASSIC HUMAN ANCIENT RIDDLE
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#ffe600]">
              “What has cities but no houses, forests but no trees, and rivers but no water?”
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Provide the singular artifact recognized across centuries of human cartography.
            </p>
          </div>

          <form onSubmit={handleRiddleSubmit} className="space-y-4">
            <div className="space-y-1">
              <input
                type="text"
                value={riddleAnswer}
                onChange={(e) => {
                  setRiddleAnswer(e.target.value)
                  if (riddleError) setRiddleError(null)
                }}
                placeholder="Enter your answer (e.g. a map)"
                className="w-full bg-[#0c0d12] border-2 border-black p-3 text-base text-[#fbf6ea] focus:border-[#ffe600] focus:outline-none shadow-[3px_3px_0px_#000] font-mono"
              />
            </div>

            {riddleError && (
              <div className="p-3 bg-red-950/80 border-2 border-[#ff007f] text-xs font-mono text-[#fbf6ea] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff007f] shrink-0 mt-0.5" />
                <span>{riddleError}</span>
              </div>
            )}

            {riddleSuccess && (
              <div className="p-3 bg-emerald-950/80 border-2 border-emerald-400 text-xs font-mono text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CORRECT! A map verified. Proceeding to overengineered sub-puzzles...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={riddleSuccess}
              className="btn-brutal-yellow w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SUBMIT DEDUCTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STAGE 2: Strange Solvable Puzzle 1 - The Dread Calibrator */}
      {stage === 2 && (
        <div className="card-brutal p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-[#ffe600] text-black border border-black inline-block">
              PUZZLE 1 OF 2: BIO-STRESS CALIBRATION
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#ffe600]">
              The Existential Dread Calibrator
            </h3>
            <p className="text-xs text-zinc-300 font-mono">
              Artificial Intelligences operate at 0% panic or 100% computational rigidity. A true human is constantly suspended in an equilibrium of mild panic, procrastination, and coffee cravings.
            </p>
          </div>

          <div className="p-4 bg-black/60 border border-zinc-800 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Current Dread Level:</span>
              <span className={`text-base font-black px-2 py-0.5 border ${
                sliderUnlocked ? 'bg-emerald-400 text-black border-black' : 'bg-[#ff007f] text-white border-black'
              }`}>
                {dreadValue}% {sliderUnlocked ? '✓ BIOLOGICALLY ACCURATE' : ''}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={dreadValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-3 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#ffe600]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0% (Silicon Zen)</span>
                <span className="text-[#ffe600] font-bold">~45% (Human Sweet Spot)</span>
                <span>100% (Machine Overclock)</span>
              </div>
            </div>

            {dreadFeedback && (
              <div className={`p-3 text-xs font-mono border-2 ${
                sliderUnlocked ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' : 'bg-zinc-900 border-[#ff007f] text-zinc-300'
              }`}>
                {dreadFeedback}
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmSlider}
            disabled={!sliderUnlocked}
            className={`w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
              sliderUnlocked ? 'btn-brutal-yellow' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>LOCK IN HUMAN PANIC PARAMETER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE 3: Strange Solvable Puzzle 2 - Bureaucratic Wire Disarmament */}
      {stage === 3 && (
        <div className="card-brutal p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-[#ff007f] text-white border border-black inline-block">
              PUZZLE 2 OF 2: OVERENGINEERED HARDWARE FAILURE
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#ffe600]">
              The Bureaucratic Wire Paradox
            </h3>
            <p className="text-xs text-zinc-300 font-mono">
              The mainframe is overloaded with synthetic logic! Pick the wire to disconnect. Remember: High-level AI algorithms always follow technical procedures. A human does whatever works to go home on time.
            </p>
          </div>

          {/* Wire Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleCutWire('optimal')}
              className={`p-4 border-3 text-left transition-all cursor-pointer ${
                selectedWire === 'optimal'
                  ? 'border-[#ff007f] bg-[#ff007f]/20'
                  : 'border-black bg-[#151720] hover:border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-1">
                <Zap className="w-4 h-4" />
                <span>WIRE A: LOGIC CORE</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Optimal theoretical path. Mathematically sound and rigorously documented.
              </p>
            </button>

            <button
              onClick={() => handleCutWire('defcon')}
              className={`p-4 border-3 text-left transition-all cursor-pointer ${
                selectedWire === 'defcon'
                  ? 'border-[#ff007f] bg-[#ff007f]/20'
                  : 'border-black bg-[#151720] hover:border-[#ff007f]'
              }`}
            >
              <div className="flex items-center gap-2 text-[#ff007f] font-bold text-xs uppercase mb-1">
                <Zap className="w-4 h-4" />
                <span>WIRE B: DEFCON-0</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Dramatic glowing neon cord labeled: &ldquo;ONLY CUT DURING CYBER WARFARE&rdquo;.
              </p>
            </button>

            <button
              onClick={() => handleCutWire('coffee')}
              className={`p-4 border-3 text-left transition-all cursor-pointer ${
                selectedWire === 'coffee'
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-black bg-[#151720] hover:border-[#ffe600]'
              }`}
            >
              <div className="flex items-center gap-2 text-[#ffe600] font-bold text-xs uppercase mb-1">
                <Zap className="w-4 h-4" />
                <span>WIRE C: BREAK ROOM CORD</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Tangled yellowed power strip powering the office kettle and the main firewall.
              </p>
            </button>
          </div>

          {wireFeedback && (
            <div className={`p-3.5 text-xs font-mono border-2 ${
              wireSuccess ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' : 'bg-red-950/80 border-[#ff007f] text-[#fbf6ea]'
            }`}>
              {wireFeedback}
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: Completion */}
      {stage === 4 && (
        <div className="card-brutal p-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-emerald-400 text-black border-2 border-black">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-[#ffe600]">
            CHAMBER 03 PROTOCOLS FULLY SURPASSED
          </h3>
          <p className="text-xs text-zinc-300 font-mono max-w-md mx-auto">
            You successfully solved the riddle and navigated overengineered bureaucratic paradoxes using authentic human chaos.
          </p>
          <button
            onClick={() => {
              sfx.playSuccess()
              onComplete()
            }}
            className="btn-brutal-yellow px-8 py-3.5 text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <span>ADVANCE TO REVERSE CAPTCHA GAMES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

