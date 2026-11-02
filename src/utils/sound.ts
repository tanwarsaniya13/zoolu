// Enhanced Web Audio API Synthesizer with Cyber BGM, Audio FX, and Speech Synthesis Fallback
class SoundFXManager {
  private ctx: AudioContext | null = null
  private bgmGain: GainNode | null = null
  private isBgmPlaying = false
  private bgmInterval: number | null = null

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Play the Hindi dialogue with audio speech synthesis and radio static
  speakDialogue(onEnd?: () => void) {
    this.initCtx()
    this.playRadioStatic()

    // Speak Hindi dialogue if speech synthesis is supported
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel() // clear any queue
        const utterance = new SpeechSynthesisUtterance('Baccha hai tu mera, answer sahi diyo bas.')
        utterance.rate = 0.92
        utterance.pitch = 0.95
        utterance.volume = 1.0

        // Look for Hindi / Indian / English voices
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(
          (v) =>
            v.lang.includes('hi') ||
            v.lang.includes('IN') ||
            v.name.includes('Hindi') ||
            v.name.includes('India')
        )
        if (voice) {
          utterance.voice = voice
        }

        utterance.onend = () => {
          if (onEnd) onEnd()
        }
        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn('Speech synthesis notice:', err)
      }
    }
  }

  // Radio static burst before transmission
  playRadioStatic() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const bufferSize = this.ctx.sampleRate * 0.25
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(2500, t)
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)
      noise.start(t)
    } catch {
      // ignore
    }
  }

  // Tactical keyboard / button click
  playClick() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05)
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.05)
    } catch {
      // Audio not permitted yet
    }
  }

  // Dramatic security rejection buzzer
  playAlarm() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'square'
      osc1.frequency.setValueAtTime(880, t)
      osc1.frequency.linearRampToValueAtTime(440, t + 0.15)
      osc1.frequency.linearRampToValueAtTime(880, t + 0.3)

      osc2.frequency.setValueAtTime(440, t)
      osc2.frequency.linearRampToValueAtTime(220, t + 0.15)
      osc2.frequency.linearRampToValueAtTime(440, t + 0.3)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ctx.destination)

      osc1.start(t)
      osc2.start(t)
      osc1.stop(t + 0.35)
      osc2.stop(t + 0.35)
    } catch {
      // Ignored
    }
  }

  // Absurd failure buzzer (comic robot detection)
  playBuzzer() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, t)
      osc.frequency.setValueAtTime(120, t + 0.1)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    } catch {
      // Ignored
    }
  }

  // Retro victory fanfare
  playSuccess() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const notes = [440, 554.37, 659.25, 880] // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, t + idx * 0.08)
        gain.gain.setValueAtTime(0, t + idx * 0.08)
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.25)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(t + idx * 0.08)
        osc.stop(t + idx * 0.08 + 0.25)
      })
    } catch {
      // Ignored
    }
  }

  // Engine rev sound for Anti-Racing Game
  playEngineRev(pitchMultiplier = 1) {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      const baseFreq = 70 * pitchMultiplier
      osc.frequency.setValueAtTime(baseFreq, t)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, t + 0.15)
      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    } catch {
      // Ignored
    }
  }

  // Airhorn fanfare for finale
  playAirhorn() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const frequencies = [466.16, 466.16, 523.25] // Bb4, Bb4, C5
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sawtooth'
        const startTime = t + idx * 0.12
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.2, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.25)
      })
    } catch {
      // Ignored
    }
  }

  // Retro Cyber Synthwave BGM Loop (Web Audio API)
  startCyberBgm() {
    if (this.isBgmPlaying) return
    this.initCtx()
    if (!this.ctx) return

    this.isBgmPlaying = true
    const scale = [110, 130.81, 146.83, 164.81, 196.0, 220.0]
    let step = 0

    this.bgmGain = this.ctx.createGain()
    this.bgmGain.gain.setValueAtTime(0.05, this.ctx.currentTime)
    this.bgmGain.connect(this.ctx.destination)

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying || !this.bgmGain) return
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()

      osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle'
      const freq = scale[step % scale.length]
      osc.frequency.setValueAtTime(freq, t)

      noteGain.gain.setValueAtTime(0.06, t)
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

      osc.connect(noteGain)
      noteGain.connect(this.bgmGain)

      osc.start(t)
      osc.stop(t + 0.2)

      step = (step + 1) % 16
    }, 220)
  }

  stopCyberBgm() {
    this.isBgmPlaying = false
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval)
      this.bgmInterval = null
    }
  }
}

export const sfx = new SoundFXManager()

export const YOUTUBE_TRACKS = {
  SCENE_1_INTRO: 'KdYf-1mjrR8',
  BG_SONG: 'zyy0XuKZHAE',
  SCENE_7_FINALE: 'zJg43G_xTiM',
}
