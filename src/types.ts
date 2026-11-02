export type SceneId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface AppState {
  currentScene: SceneId
  audioEnabled: boolean
  audioMuted: boolean
  audioVolume: number
  hasInteracted: boolean
  userDemoName: string
  // Scene progress flags
  scene1Completed: boolean
  scene2Completed: boolean
  scene3Completed: boolean
  scene4Completed: boolean
  scene5Completed: boolean
  scene6Completed: boolean
  scene7Completed: boolean
}

export interface QuizQuestion {
  id: number
  question: string
  subtext: string
  options: {
    id: string
    text: string
    isMathematicallyCorrect: boolean // Remember: player MUST pick mathematically INCORRECT!
    humorousFeedback: string
  }[]
}

export interface ImageCaptchaItem {
  id: string
  url: string
  label: string
  isTrafficLight: boolean
  isSelected: boolean
}

export interface Racer {
  id: string
  name: string
  x: number
  y: number
  speed: number
  lane: number
  color: string
  isPlayer: boolean
}

