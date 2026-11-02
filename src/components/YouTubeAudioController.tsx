import React, { useEffect, useRef, useState, useCallback } from 'react'
import { YOUTUBE_TRACKS, sfx } from '../utils/sound'
import { Volume2, VolumeX, Radio, Music, Play, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string | number
          width?: string | number
          videoId?: string
          playerVars?: Record<string, unknown>
          events?: {
            onReady?: (event: { target: YTPlayer }) => void
            onStateChange?: (event: { data: number }) => void
            onError?: (event: { data: number }) => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTPlayer {
  loadVideoById: (id: string | { videoId: string; startSeconds?: number }) => void
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  setVolume: (volume: number) => void
  getVolume: () => number
  destroy: () => void
}

interface YouTubeAudioProps {
  currentScene: number
  hasInteracted: boolean
  isMuted: boolean
  volume: number
  onToggleMute: () => void
  onScene1AudioEnded?: () => void
}

export const YouTubeAudioController: React.FC<YouTubeAudioProps> = ({
  currentScene,
  hasInteracted,
  isMuted,
  volume,
  onToggleMute,
  onScene1AudioEnded,
}) => {
  const playerRef = useRef<YTPlayer | null>(null)
  const currentVideoIdRef = useRef<string>('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isSynthBgmActive, setIsSynthBgmActive] = useState<boolean>(false)
  const [needsGesture, setNeedsGesture] = useState<boolean>(false)

  // Track ID based on current scene
  const targetVideoId =
    currentScene === 1
      ? YOUTUBE_TRACKS.SCENE_1_INTRO
      : currentScene >= 2 && currentScene <= 6
      ? YOUTUBE_TRACKS.BG_SONG
      : YOUTUBE_TRACKS.SCENE_7_FINALE

  const getTrackDescription = useCallback((scene: number) => {
    switch (scene) {
      case 1:
        return 'SCENE 1: Dialogue Short (KdYf-1mjrR8)'
      case 7:
        return 'SCENE 7: Finale Anthem (zJg43G_xTiM)'
      default:
        return 'SCENE 2-6: Background Theme (zyy0XuKZHAE)'
    }
  }, [])

  // Initialize YT API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      document.body.appendChild(tag)

      window.onYouTubeIframeAPIReady = () => {
        createPlayer()
      }
    } else if (window.YT && window.YT.Player) {
      createPlayer()
    }

    function createPlayer() {
      if (playerRef.current) return
      try {
        const player = new window.YT.Player('yt-audio-embed', {
          height: '180',
          width: '240',
          videoId: targetVideoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 0,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
            loop: currentScene >= 2 && currentScene <= 6 ? 1 : 0,
            playlist: currentScene >= 2 && currentScene <= 6 ? targetVideoId : undefined,
          },
          events: {
            onReady: (event) => {
              playerRef.current = event.target
              currentVideoIdRef.current = targetVideoId
              event.target.setVolume(100)
              if (isMuted) {
                event.target.mute()
              } else {
                event.target.unMute()
              }
              if (hasInteracted) {
                event.target.playVideo()
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                setNeedsGesture(false)
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false)
                if (currentScene === 1 && onScene1AudioEnded) {
                  onScene1AudioEnded()
                }
              }
            },
            onError: (err) => {
              console.warn('YouTube Audio Notice:', err)
              // If YouTube fails (adblock/region restrictions), start synth BGM fallback
              if (currentScene >= 2 && currentScene <= 6) {
                sfx.startCyberBgm()
                setIsSynthBgmActive(true)
              }
            },
          },
        })
        playerRef.current = player
      } catch (e) {
        console.warn('Could not initialize YT player', e)
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch {
          // ignore
        }
        playerRef.current = null
      }
    }
  }, [])

  // Handle scene switch
  useEffect(() => {
    if (playerRef.current && currentVideoIdRef.current !== targetVideoId) {
      currentVideoIdRef.current = targetVideoId
      try {
        playerRef.current.stopVideo()
        playerRef.current.loadVideoById({
          videoId: targetVideoId,
          startSeconds: 0,
        })
        playerRef.current.setVolume(100)
        if (isMuted) {
          playerRef.current.mute()
        } else {
          playerRef.current.unMute()
        }
        playerRef.current.playVideo()
      } catch (err) {
        console.warn('Error loading new video ID:', err)
      }
    }

    // Also control synth BGM fallback
    if (currentScene >= 2 && currentScene <= 6 && !isPlaying && hasInteracted) {
      sfx.startCyberBgm()
      setIsSynthBgmActive(true)
    } else if (currentScene === 7) {
      sfx.stopCyberBgm()
      setIsSynthBgmActive(false)
    }
  }, [currentScene, targetVideoId, isMuted, hasInteracted, isPlaying])

  // Explicit user force play trigger
  const handleForcePlay = () => {
    sfx.initCtx()
    sfx.playClick()

    if (currentScene === 1) {
      sfx.speakDialogue()
    } else {
      sfx.startCyberBgm()
      setIsSynthBgmActive(true)
    }

    if (playerRef.current) {
      try {
        playerRef.current.unMute()
        playerRef.current.setVolume(100)
        playerRef.current.playVideo()
        setIsPlaying(true)
      } catch (e) {
        console.warn('Force play error:', e)
      }
    }
  }

  return (
    <>
      {/* 
        Legitimate, visible CCTV Audio Visualizer Box for YouTube Embed:
        Notice: Giving it a non-zero size (240x180) inside an overflow-hidden retro surveillance chassis
        guarantees Chrome & Safari audio engines do NOT treat it as an invisible blocked beacon!
      */}
      <div
        className="fixed bottom-4 left-4 z-40 bg-[#0c0d12] border-3 border-black shadow-[4px_4px_0px_#ffe600] p-2 flex flex-col gap-1.5 transition-all"
        style={{ width: '220px' }}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-[10px] font-bold">
          <div className="flex items-center gap-1 text-[#ffe600]">
            <Radio className={`w-3 h-3 ${isPlaying ? 'animate-pulse text-[#ff007f]' : ''}`} />
            <span>SURVEILLANCE WIRE</span>
          </div>
          <span className="text-[9px] px-1 bg-[#ff007f] text-white">LIVE FEED</span>
        </div>

        {/* Mini CCTV Embed Viewport with cyber scanlines */}
        <div className="relative w-full h-[100px] bg-black border border-zinc-700 overflow-hidden">
          <div id="yt-audio-embed" className="w-full h-full object-cover opacity-85" />
          {/* Retro CCTV scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)]" />
          <div className="absolute top-1 left-1 text-[8px] font-mono text-[#ffe600] bg-black/80 px-1">
            REC ● {currentScene === 1 ? 'SHORT_01' : currentScene === 7 ? 'FINALE' : 'BGM_02'}
          </div>
        </div>

        {/* Audio Track Info & Force Play Controls */}
        <div className="text-[10px] text-zinc-300 font-mono truncate">
          {getTrackDescription(currentScene)}
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={handleForcePlay}
            className="flex-1 btn-brutal-yellow py-1 text-[10px] uppercase font-black flex items-center justify-center gap-1 cursor-pointer"
            title="Click to force play audio if silent"
          >
            <Play className="w-3 h-3" />
            <span>{isPlaying ? 'AUDIO ON' : 'PLAY AUDIO'}</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick()
              onToggleMute()
              if (playerRef.current) {
                if (!isMuted) {
                  playerRef.current.mute()
                } else {
                  playerRef.current.unMute()
                  playerRef.current.setVolume(100)
                  playerRef.current.playVideo()
                }
              }
            }}
            className="p-1 bg-[#151720] hover:bg-[#ff007f] hover:text-white border border-zinc-700 text-zinc-300 cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isSynthBgmActive && (
          <div className="text-[8px] text-emerald-400 font-mono flex items-center gap-1">
            <Music className="w-2.5 h-2.5 animate-spin" />
            <span>SYNTH BGM ACTIVE (FAILSAFE)</span>
          </div>
        )}
      </div>
    </>
  )
}
