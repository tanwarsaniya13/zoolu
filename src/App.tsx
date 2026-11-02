import React, { useState, useEffect } from 'react'
import { SceneId } from './types'
import { Header } from './components/Header'
import { ParanoidBackground } from './components/ParanoidBackground'
import { AnimeBackground } from './components/AnimeBackground'
import { YouTubeAudioController } from './components/YouTubeAudioController'
import { Scene1Intro } from './scenes/Scene1Intro'
import { Scene2Login } from './scenes/Scene2Login'
import { Scene3Riddle } from './scenes/Scene3Riddle'
import { Scene4ReverseCaptcha } from './scenes/Scene4ReverseCaptcha'
import { Scene5AntiRacing } from './scenes/Scene5AntiRacing'
import { Scene6FinalRobot } from './scenes/Scene6FinalRobot'
import { Scene7Finale } from './scenes/Scene7Finale'
import { sfx } from './utils/sound'

export const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneId>(1)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(45)
  const [userDemoName, setUserDemoName] = useState<string>('Subversive Meatbag')

  // Global listener for first user interaction (respecting browser autoplay policies without an annoying separate permission prompt)
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        sfx.playClick()
      }
    }

    window.addEventListener('click', handleFirstUserInteraction, { once: true })
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction)
      window.removeEventListener('keydown', handleFirstUserInteraction)
      window.removeEventListener('touchstart', handleFirstUserInteraction)
    }
  }, [hasInteracted])

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#fbf6ea] font-mono relative flex flex-col selection:bg-[#ffe600] selection:text-black">
      {/* Anime Demon Slayer Video Background (Muted without sound, with flame embers and speedlines) */}
      <AnimeBackground />

      {/* CRT Scanline Visual Effect Overlay */}
      <div className="crt-overlay fixed inset-0 z-30 pointer-events-none" />

      {/* Interactive Paranoid Background with Hover Drones & Matrix Grid */}
      <ParanoidBackground />

      {/* Persistent YouTube Audio Controller */}
      <YouTubeAudioController
        currentScene={currentScene}
        hasInteracted={hasInteracted}
        isMuted={isMuted}
        volume={volume}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onScene1AudioEnded={() => {
          // If Scene 1 audio finishes, we can let user proceed or auto-signal
        }}
      />

      {/* Header & Scene Nav (Hidden during Scene 1 Blackout for maximum cinematic drama, visible in scenes 2-7) */}
      {currentScene !== 1 && (
        <Header
          currentScene={currentScene}
          onSelectScene={(sceneId) => setCurrentScene(sceneId)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-20">
        {currentScene === 1 && (
          <Scene1Intro
            hasInteracted={hasInteracted}
            onFirstInteract={() => setHasInteracted(true)}
            onComplete={() => setCurrentScene(2)}
          />
        )}

        {currentScene === 2 && (
          <Scene2Login
            onComplete={(name) => {
              setUserDemoName(name)
              setCurrentScene(3)
            }}
          />
        )}

        {currentScene === 3 && (
          <Scene3Riddle
            onComplete={() => setCurrentScene(4)}
          />
        )}

        {currentScene === 4 && (
          <Scene4ReverseCaptcha
            onComplete={() => setCurrentScene(5)}
          />
        )}

        {currentScene === 5 && (
          <Scene5AntiRacing
            onComplete={() => setCurrentScene(6)}
          />
        )}

        {currentScene === 6 && (
          <Scene6FinalRobot
            onComplete={() => setCurrentScene(7)}
          />
        )}

        {currentScene === 7 && (
          <Scene7Finale
            userDemoName={userDemoName}
            onRestart={() => setCurrentScene(1)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      {currentScene !== 1 && (
        <footer className="py-3 px-4 border-t-2 border-black bg-black/80 text-[10px] text-zinc-500 text-center flex flex-wrap justify-between items-center max-w-7xl mx-auto w-full z-20">
          <div>
            &copy; {new Date().getFullYear()} B.O.T.S. // BUREAU OF TURING SABOTAGE. ALL REVERSE LOGIC ENFORCED.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffe600]">SYSTEM THREAT: OMEGA</span>
            <span>|</span>
            <span className="text-[#ff007f]">HUMAN CONFIRMATION MATRIX</span>
          </div>
        </footer>
      )}
    </div>
  )
}

