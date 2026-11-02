import React from 'react'
import { SceneId } from '../types'
import { ShieldAlert, Terminal, Eye, AlertTriangle } from 'lucide-react'
import { sfx } from '../utils/sound'

interface HeaderProps {
  currentScene: SceneId
  onSelectScene: (scene: SceneId) => void
}

const SCENE_NAMES: { id: SceneId; title: string; label: string }[] = [
  { id: 1, title: 'Scene 1', label: 'Blackout Intro' },
  { id: 2, title: 'Scene 2', label: 'Paradox Login' },
  { id: 3, title: 'Scene 3', label: 'Riddle Chamber' },
  { id: 4, title: 'Scene 4', label: 'Reverse CAPTCHA' },
  { id: 5, title: 'Scene 5', label: 'Anti-Racing' },
  { id: 6, title: 'Scene 6', label: 'Robot Check' },
  { id: 7, title: 'Scene 7', label: 'Finale Passport' },
]

export const Header: React.FC<HeaderProps> = ({ currentScene, onSelectScene }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12] border-b-4 border-black text-[#fbf6ea]">
      {/* Top Warning Strip */}
      <div className="caution-stripes h-2.5 w-full border-b border-black" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#ffe600] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-[#ffe600]">
                B.O.T.S.
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-[#ff007f] text-white border border-black shadow-[1px_1px_0px_#000]">
                THREAT LEVEL: OMEGA-PARANOID
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-zinc-400" />
              <span>BUREAU OF TURING SABOTAGE // ANTI-HUMAN GATEWAY</span>
            </div>
          </div>
        </div>

        {/* Live Surveillance Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-black/60 px-3 py-1.5 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-[#ffe600]">
            <Eye className="w-3.5 h-3.5 animate-pulse text-[#ff007f]" />
            <span className="font-mono text-[11px]">PARANOIA PROTOCOL: ACTIVE</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <AlertTriangle className="w-3 h-3 text-[#ffe600]" />
            <span>RULE: ALWAYS ACT ILLOGICAL</span>
          </div>
        </div>

        {/* Scene Navigation Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          {SCENE_NAMES.map((s) => {
            const isActive = currentScene === s.id
            return (
              <button
                key={s.id}
                onClick={() => {
                  sfx.playClick()
                  onSelectScene(s.id)
                }}
                title={`Jump to ${s.title}: ${s.label}`}
                className={`px-2 py-1 text-[11px] font-bold border-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ffe600] text-black border-black shadow-[2px_2px_0px_#ff007f] scale-105'
                    : 'bg-[#151720] text-zinc-300 border-zinc-800 hover:border-[#ffe600] hover:text-white'
                }`}
              >
                <span className="hidden md:inline mr-1 opacity-70">#{s.id}</span>
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}

