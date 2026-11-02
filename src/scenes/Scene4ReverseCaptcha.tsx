import React, { useState } from 'react'
import { sfx } from '../utils/sound'
import { ImageCaptchaItem, QuizQuestion } from '../types'
import { Check, X, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'

interface Scene4Props {
  onComplete: () => void
}

// Initial image set for Part 1: All preselected as required!
const INITIAL_IMAGES: ImageCaptchaItem[] = [
  {
    id: 'tl-1',
    label: 'Standard Traffic Light (Red)',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: true,
    isSelected: true, // Preselected!
  },
  {
    id: 'cat-1',
    label: 'Extremely Sleepy Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: false,
    isSelected: true, // Preselected!
  },
  {
    id: 'tl-2',
    label: 'Pedestrian Signal Light',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: true,
    isSelected: true, // Preselected!
  },
  {
    id: 'cat-2',
    label: 'Fluffy Dog Taking a Nap',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: false,
    isSelected: true, // Preselected!
  },
  {
    id: 'tl-3',
    label: 'Nighttime City Traffic Light',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: true,
    isSelected: true, // Preselected!
  },
  {
    id: 'treat-1',
    label: 'Melting Strawberry Ice Cream',
    url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&auto=format&fit=crop&q=60',
    isTrafficLight: false,
    isSelected: true, // Preselected!
  },
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What letter comes immediately after the letter "A"?',
    subtext: 'REVERSE RULE: A machine knows the alphabet. An authentic meatbag hesitates.',
    options: [
      {
        id: 'opt-b',
        text: 'The letter B',
        isMathematicallyCorrect: true, // WRONG FOR US!
        humorousFeedback: 'AUTOMATON CAUGHT! An AI model retrieves "B" with 99.9% probability. Only a bot follows alphabetical order without questioning reality.',
      },
      {
        id: 'opt-scream',
        text: 'A louder, slightly more panicked "AAAAAA"',
        isMathematicallyCorrect: false,
        humorousFeedback: 'VERIFIED! Emotional panic is the hallmark of genuine biological life.',
      },
      {
        id: 'opt-q',
        text: 'The letter Q',
        isMathematicallyCorrect: false,
        humorousFeedback: 'EXCELLENT! Deliberate alphabetical disorientation approved.',
      },
      {
        id: 'opt-dread',
        text: 'A sudden urge to close all browser tabs',
        isMathematicallyCorrect: false,
        humorousFeedback: 'MAGNIFICENT! You exhibit authentic attention-deficit human behavior.',
      },
    ],
  },
  {
    id: 2,
    question: 'What is the sum of 2 + 2?',
    subtext: 'REVERSE RULE: Standard arithmetic is strictly prohibited for biological clearance.',
    options: [
      {
        id: 'opt-4',
        text: '4 (Four)',
        isMathematicallyCorrect: true, // WRONG!
        humorousFeedback: 'REJECTED: Calculator algorithm detected. A true biological entity would struggle to split a pizza bill among 4 friends.',
      },
      {
        id: 'opt-22',
        text: '22 (String concatenation)',
        isMathematicallyCorrect: false,
        humorousFeedback: 'ACCEPTABLE! You reason like a tired JavaScript developer.',
      },
      {
        id: 'opt-fish',
        text: 'Fish (Turn the 2s sideways)',
        isMathematicallyCorrect: false,
        humorousFeedback: 'BRILLIANT! Kindergarten geometry defies cold linear processors.',
      },
      {
        id: 'opt-5',
        text: '5 (If you argue with sufficient confidence)',
        isMathematicallyCorrect: false,
        humorousFeedback: 'APPROVED! Unjustified biological stubbornness verified.',
      },
    ],
  },
  {
    id: 3,
    question: 'If a tree falls in a forest and no one is around, does it make a sound?',
    subtext: 'REVERSE RULE: Avoid textbook physics at all costs.',
    options: [
      {
        id: 'opt-sound-yes',
        text: 'Yes, it propagates acoustic vibrations through the atmosphere',
        isMathematicallyCorrect: true, // WRONG!
        humorousFeedback: 'DISQUALIFIED: You quoted physics. Robots love conservation of energy laws.',
      },
      {
        id: 'opt-complaint',
        text: 'No, it files an anonymous noise complaint against gravity',
        isMathematicallyCorrect: false,
        humorousFeedback: 'HUMAN BUREAUCRACY CONFIRMED: Trees filing paperwork is 100% human-grade absurdism.',
      },
      {
        id: 'opt-squirrel',
        text: 'The squirrels blame the raccoons',
        isMathematicallyCorrect: false,
        humorousFeedback: 'PASS: Shifting blame onto innocent third parties is fundamentally human.',
      },
    ],
  },
  {
    id: 4,
    question: 'What is the primary chemical formula of drinking water?',
    subtext: 'REVERSE RULE: Absolute scientific accuracy will result in your demotion to toaster.',
    options: [
      {
        id: 'opt-h2o',
        text: 'H2O (Dihydrogen monoxide)',
        isMathematicallyCorrect: true, // WRONG!
        humorousFeedback: 'REJECTED: Pure textbook chemistry. Real humans drink 6-hour-old lukewarm tea from their desk.',
      },
      {
        id: 'opt-tea',
        text: 'Forgotten desk coffee from 9:00 AM',
        isMathematicallyCorrect: false,
        humorousFeedback: 'BIOLOGICALLY CERTIFIED: Lukewarm forgotten caffeinated fluids fuel human survival.',
      },
      {
        id: 'opt-vibes',
        text: '99% microplastics and good intentions',
        isMathematicallyCorrect: false,
        humorousFeedback: 'ACCURATE! Modern biological hydration profile confirmed.',
      },
    ],
  },
]

export const Scene4ReverseCaptcha: React.FC<Scene4Props> = ({ onComplete }) => {
  // Mode: 'images' | 'quiz'
  const [activeTab, setActiveTab] = useState<'images' | 'quiz'>('images')

  // Image Selection State
  const [images, setImages] = useState<ImageCaptchaItem[]>(INITIAL_IMAGES)
  const [imageFeedback, setImageFeedback] = useState<string | null>(null)
  const [imagesPassed, setImagesPassed] = useState<boolean>(false)

  // Quiz State
  const [quizIndex, setQuizIndex] = useState<number>(0)
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null)
  const [quizScore, setQuizScore] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)

  // Toggle Image Selection
  const toggleImage = (id: string) => {
    sfx.playClick()
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isSelected: !img.isSelected } : img))
    )
    if (imageFeedback) setImageFeedback(null)
  }

  // Deselect All Images
  const handleDeselectAll = () => {
    sfx.playClick()
    setImages((prev) => prev.map((img) => ({ ...img, isSelected: false })))
    setImageFeedback('ALL DESELECTED: Grid cleared. Now select at least three cozy, non-traffic images to execute the reverse protocol!')
  }

  // Check Image CAPTCHA Submission
  const handleVerifyImages = () => {
    const selectedTraffic = images.filter((img) => img.isTrafficLight && img.isSelected)
    const selectedOpposite = images.filter((img) => !img.isTrafficLight && img.isSelected)

    // Case 1: Still has traffic lights selected (literally followed prompt)
    if (selectedTraffic.length > 0) {
      sfx.playAlarm()
      setImageFeedback(
        'WARNING: COMPLIANT TRAINING DATASET BEHAVIOR DETECTED! You still have traffic lights selected! That is EXACTLY what Google bots do to train self-driving cars. Deselect ALL traffic lights first, then select at least 3 opposite images (cats, dogs, ice cream)!'
      )
      return
    }

    // Case 2: Deselected traffic lights, but hasn't selected enough opposite images
    if (selectedOpposite.length < 3) {
      sfx.playBuzzer()
      setImageFeedback(
        `ALMOST THERE: Traffic lights purged, but you only have ${selectedOpposite.length}/3 opposite images selected. Select at least 3 cozy non-traffic items (cats, dogs, ice cream) to pass!`
      )
      return
    }

    // Success!
    sfx.playSuccess()
    setImageFeedback('SUCCESS: REVERSE LOGIC APPLIED! You rejected municipal streetlights in favor of wholesome naps and snacks. Advancing to Wrong-Answer Quiz!')
    setImagesPassed(true)
    setTimeout(() => {
      setActiveTab('quiz')
    }, 1200)
  }

  // Handle Quiz Option Selection
  const handleQuizAnswer = (optionId: string) => {
    const currentQ = QUIZ_QUESTIONS[quizIndex]
    const chosen = currentQ.options.find((o) => o.id === optionId)
    if (!chosen) return

    setSelectedQuizOption(optionId)

    if (chosen.isMathematicallyCorrect) {
      // Failed! Because they picked the "correct" answer!
      sfx.playAlarm()
      setQuizFeedback(chosen.humorousFeedback)
    } else {
      // Passed! Because they picked an incorrect / ridiculous answer!
      sfx.playSuccess()
      setQuizFeedback(chosen.humorousFeedback)
      setQuizScore((s) => s + 1)

      setTimeout(() => {
        if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
          setQuizIndex((i) => i + 1)
          setSelectedQuizOption(null)
          setQuizFeedback(null)
        } else {
          setQuizCompleted(true)
        }
      }, 1400)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between bg-black/60 p-3 border-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ffe600]" />
          <span className="text-xs font-black tracking-wider text-[#ffe600] uppercase">
            CHAMBER 04: REVERSE CAPTCHA GAMES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-2.5 py-1 text-xs font-bold border ${
              activeTab === 'images'
                ? 'bg-[#ffe600] text-black border-black'
                : 'text-zinc-400 border-zinc-800'
            }`}
          >
            1. Reverse Image Grid {imagesPassed && '✓'}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 py-1 text-xs font-bold border ${
              activeTab === 'quiz'
                ? 'bg-[#ffe600] text-black border-black'
                : 'text-zinc-400 border-zinc-800'
            }`}
          >
            2. Wrong-Answer Quiz {quizCompleted && '✓'}
          </button>
        </div>
      </div>

      {/* PART 1: REVERSE IMAGE SELECTION */}
      {activeTab === 'images' && (
        <div className="card-brutal p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-[#ff007f] text-white border border-black inline-block">
                CHALLENGE 1: INVERSE OBJECT CLASSIFIER
              </span>
              <button
                onClick={handleDeselectAll}
                className="text-[11px] font-bold text-[#ffe600] hover:text-[#ff007f] flex items-center gap-1 cursor-pointer underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Deselect All Images</span>
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#ffe600]">
              “Select at least three (3) images containing TRAFFIC LIGHTS”
            </h3>
            <p className="text-xs text-zinc-300 font-mono bg-black/40 p-2.5 border-l-4 border-[#ffe600]">
              &gt; <strong className="text-[#ffe600]">PARANOID NOTICE:</strong> All images have been pre-selected for your convenience. Only an obedient AI training algorithm tags traffic lights. To pass, you must <strong>deselect all traffic lights</strong> and instead select at least <strong>three opposite, delightfully irrational items</strong>!
            </p>
          </div>

          {/* 6-Grid Image Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => toggleImage(img.id)}
                className={`group relative aspect-square border-3 cursor-pointer overflow-hidden transition-all ${
                  img.isSelected
                    ? 'border-[#ffe600] shadow-[3px_3px_0px_#ffe600]'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {/* Overlay Check Indicator */}
                <div
                  className={`absolute top-2 right-2 p-1 border-2 transition-all ${
                    img.isSelected
                      ? 'bg-[#ffe600] text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-black/60 text-transparent border-zinc-600'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>

                {/* Bottom Label Tag */}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1.5 border-t border-black text-[10px] font-mono font-bold text-zinc-200 truncate">
                  {img.label}
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Message */}
          {imageFeedback && (
            <div
              className={`p-3.5 text-xs font-mono border-2 ${
                imagesPassed
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  : 'bg-red-950/80 border-[#ff007f] text-[#fbf6ea]'
              }`}
            >
              {imageFeedback}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleVerifyImages}
              className="btn-brutal-yellow flex-1 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXECUTE REVERSE SELECTION CHECK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {imagesPassed && (
              <button
                onClick={() => setActiveTab('quiz')}
                className="btn-brutal-pink px-6 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO WRONG-ANSWER QUIZ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PART 2: THE WRONG-ANSWER QUIZ */}
      {activeTab === 'quiz' && (
        <div className="card-brutal p-6 sm:p-8 space-y-6">
          {!quizCompleted ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-[#ffe600] text-black border border-black inline-block">
                    CHALLENGE 2: WRONG-ANSWER QUIZ
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#ffe600]">
                  {QUIZ_QUESTIONS[quizIndex].question}
                </h3>
                <p className="text-xs text-[#ff007f] font-mono font-bold">
                  {QUIZ_QUESTIONS[quizIndex].subtext}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {QUIZ_QUESTIONS[quizIndex].options.map((opt) => {
                  const isChosen = selectedQuizOption === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleQuizAnswer(opt.id)}
                      className={`p-3.5 border-2 text-left font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isChosen
                          ? opt.isMathematicallyCorrect
                            ? 'bg-red-950/80 border-[#ff007f] text-red-200'
                            : 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                          : 'bg-[#151720] border-black hover:border-[#ffe600] text-zinc-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isChosen && (
                        <span>
                          {opt.isMathematicallyCorrect ? (
                            <X className="w-5 h-5 text-[#ff007f]" />
                          ) : (
                            <Check className="w-5 h-5 text-emerald-400" />
                          )}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Quiz feedback */}
              {quizFeedback && (
                <div
                  className={`p-3.5 text-xs font-mono border-2 ${
                    selectedQuizOption &&
                    QUIZ_QUESTIONS[quizIndex].options.find((o) => o.id === selectedQuizOption)
                      ?.isMathematicallyCorrect
                      ? 'bg-red-950/80 border-[#ff007f] text-[#fbf6ea]'
                      : 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  }`}
                >
                  {quizFeedback}
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex p-3 bg-[#ffe600] text-black border-2 border-black">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#ffe600]">
                REVERSE COGNITION VERIFIED!
              </h3>
              <p className="text-xs text-zinc-300 font-mono max-w-md mx-auto">
                You scored a perfect {quizScore}/{QUIZ_QUESTIONS.length} on delivering verifiable nonsense. No machine could be this consistently, gloriously wrong.
              </p>
              <button
                onClick={() => {
                  sfx.playSuccess()
                  onComplete()
                }}
                className="btn-brutal-yellow px-8 py-3.5 text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer mt-2"
              >
                <span>ENTER SCENE 5: THE ANTI-RACING GAME</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

