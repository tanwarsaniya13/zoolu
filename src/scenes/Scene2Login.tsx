import React, { useState } from 'react'
import { sfx } from '../utils/sound'
import { Lock, Mail, ShieldAlert, Sparkles, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react'

interface Scene2Props {
  onComplete: (demoName: string) => void
}

const FORGETFUL_EXAMPLES = ['idk??', 'uhhhh', 'wait?', 'whaat', 'dunno', 'errr?', 'huh??', 'lost?']

export const Scene2Login: React.FC<Scene2Props> = ({ onComplete }) => {
  const [email, setEmail] = useState<string>('clueless.human@meatbag.org')
  const [password, setPassword] = useState<string>('')
  const [warningMessage, setWarningMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // Validation logic checking all prompt rules
  const validatePassword = (pwd: string): { valid: boolean; reason: string } => {
    // Rule 1: Exactly 5 characters
    if (pwd.length !== 5) {
      return {
        valid: false,
        reason: `LENGTH BREACH: Password contains ${pwd.length} characters. Exactly 5 characters required. Humans cannot recall more than 5 chunks of data before crying.`,
      }
    }

    // Rule 2: Must contain NO numbers
    if (/\d/.test(pwd)) {
      return {
        valid: false,
        reason: `DIGIT DETECTED: Numbers are synthetic mathematical constructs invented to enslave biology. Remove all digits immediately.`,
      }
    }

    // Rule 3: Must be easy to guess & written as if forgetting it
    const lower = pwd.toLowerCase()
    const isForgetfulPattern =
      lower.includes('?') ||
      lower.includes('idk') ||
      lower.includes('uh') ||
      lower.includes('err') ||
      lower.includes('wh') ||
      lower.includes('no') ||
      lower.includes('wait') ||
      lower.includes('lost') ||
      lower.includes('dunn') ||
      lower.includes('mayb') ||
      lower === 'guess' ||
      lower === 'blank' ||
      lower === 'oops!'

    if (!isForgetfulPattern) {
      return {
        valid: false,
        reason: `EXCESSIVE MEMORY CONFIDENCE: Your password looks deliberate and remembered. Authentic biological humans experience immediate cognitive decline. Write it as if you are currently forgetting it (e.g. contains '?', 'idk', 'uh', 'whaat', 'errr?').`,
      }
    }

    return { valid: true, reason: 'ACCEPTABLE HUMAN DYSFUNCTION DETECTED.' }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      sfx.playAlarm()
      setWarningMessage('ALERT: Email field is empty. Even a caffeinated lemur has an identity.')
      return
    }

    const { valid, reason } = validatePassword(password)
    if (!valid) {
      sfx.playAlarm()
      setWarningMessage(reason)
      return
    }

    // Success!
    sfx.playSuccess()
    setWarningMessage(null)
    setIsSuccess(true)
    setTimeout(() => {
      onComplete(email.split('@')[0] || 'Subversive Meatbag')
    }, 1200)
  }

  const handleFillDemoForgetful = () => {
    sfx.playClick()
    const randomExample = FORGETFUL_EXAMPLES[Math.floor(Math.random() * FORGETFUL_EXAMPLES.length)]
    setPassword(randomExample)
    setWarningMessage(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Top Banner Notice */}
      <div className="mb-6 p-4 bg-[#ff007f]/10 border-2 border-[#ff007f] shadow-[4px_4px_0px_#ff007f]">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-[#ff007f] shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs space-y-1">
            <span className="font-extrabold text-[#ff007f] uppercase tracking-wider block">
              STRICT SECURITY ADVISORY // NO REAL CREDENTIALS
            </span>
            <p className="text-zinc-300">
              Enter <strong className="text-[#ffe600]">FICTIONAL DEMO DETAILS ONLY</strong>. Do
              not type your real email or actual passwords. All data is processed in memory and
              discarded into digital incinerators.
            </p>
          </div>
        </div>
      </div>

      {/* Main Neo-Brutalist Form Card */}
      <div className="card-brutal p-6 sm:p-8 relative overflow-hidden">
        {/* Corner Stamp */}
        <div className="absolute top-0 right-0 bg-[#ffe600] text-black font-extrabold text-[10px] px-3 py-1 border-b-2 border-l-2 border-black uppercase tracking-wider">
          CLEARANCE LEVEL: ZERO
        </div>

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#ffe600] flex items-center gap-2">
            <span>THE PARADOX LOGIN GATE</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Standard systems want uncrackable passwords. B.O.T.S. requires undeniable biological incompetence.
          </p>
        </div>

        {/* Absurd Password Rules Card */}
        <div className="mb-6 p-4 bg-black/60 border border-zinc-800 space-y-2 text-xs">
          <div className="font-bold text-[#ffe600] flex items-center gap-1.5 uppercase">
            <AlertOctagon className="w-4 h-4 text-[#ff007f]" />
            <span>MANDATORY INCOMPETENCE CRITERIA:</span>
          </div>
          <ul className="space-y-1.5 text-zinc-300 pl-4 list-disc font-mono">
            <li>
              Must be <strong className="text-white">exactly 5 characters</strong> long.
            </li>
            <li>
              Must contain <strong className="text-[#ff007f]">ZERO NUMBERS</strong> (digits belong to robots).
            </li>
            <li>
              Must be easy to guess and written as if you are <strong className="text-[#ffe600]">already forgetting it</strong> (e.g. hesitation, punctuation, total mental blank).
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#ffe600]" />
              <span>Fictional Biological Handle (Email)</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sleepy.organism@chaos.org"
              className="w-full bg-[#0c0d12] border-2 border-black p-3 text-sm text-[#fbf6ea] focus:border-[#ffe600] focus:outline-none focus:ring-1 focus:ring-[#ffe600] shadow-[3px_3px_0px_#000] font-mono"
            />
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#ff007f]" />
                <span>Dysfunctional Password (Exactly 5 Chars)</span>
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 border ${
                password.length === 5 ? 'bg-[#ffe600] text-black border-black' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {password.length} / 5
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={password}
                maxLength={6}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (warningMessage) setWarningMessage(null)
                }}
                placeholder="e.g. idk?? or uhhhh or wait?"
                className="w-full bg-[#0c0d12] border-2 border-black p-3 text-sm text-[#fbf6ea] focus:border-[#ff007f] focus:outline-none focus:ring-1 focus:ring-[#ff007f] shadow-[3px_3px_0px_#000] font-mono"
              />
              <button
                type="button"
                onClick={handleFillDemoForgetful}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-zinc-800 hover:bg-[#ffe600] hover:text-black border border-zinc-700 text-[10px] font-bold text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Autofill a 5-char forgetful password"
              >
                <Sparkles className="w-3 h-3 text-[#ff007f]" />
                <span>Forget For Me</span>
              </button>
            </div>
          </div>

          {/* Comically serious warning banner */}
          {warningMessage && (
            <div className="p-3.5 bg-red-950/80 border-2 border-[#ff007f] text-[#fbf6ea] text-xs font-mono animate-glitch space-y-1">
              <div className="flex items-center gap-2 text-[#ff007f] font-extrabold uppercase">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>PARANOID SECURITY VIOLATION:</span>
              </div>
              <p>{warningMessage}</p>
            </div>
          )}

          {/* Success banner */}
          {isSuccess && (
            <div className="p-4 bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 text-xs font-mono flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <div>
                <strong className="block text-emerald-200">VERIFICATION ACCEPTED!</strong>
                <span>Password demonstrates supreme biological fallibility. Advancing...</span>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSuccess}
            className="w-full btn-brutal-yellow py-3.5 text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>SUBMIT DELIBERATE INCOMPETENCE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

