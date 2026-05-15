'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { games, type Question } from '@/lib/gameData'
import {
  saveGameState,
  loadGameState,
  clearGameState,
  loadSelectedGame,
} from '@/lib/gameState'
import Timeline from './Timeline'

// ── Types ──────────────────────────────────────────────────────────────────
type Phase =
  | 'start'
  | 'show_front'    // portrait card at center, showing pokemon image
  | 'flip_out'      // portrait card rotating away (rotateY 0 → 90)
  | 'flip_in'       // landscape card rotating in  (rotateY -90 → 0)
  | 'question'      // landscape question card fully visible
  | 'revealing'     // answer selected, showing result
  | 'keep_or_next'
  | 'falling'       // card fading out before next question or end
  | 'kept'          // player chose to keep their cards — show summary
  | 'celebration'
  | 'game_over'

const SAFE_HAVEN_INDEX = 4

interface ConfettiPiece {
  id: number
  left: string
  color: string
  duration: string
  delay: string
  size: string
}

const CONFETTI_COLORS = ['#facc15', '#ef4444', '#3b82f6', '#10b981', '#f97316', '#a855f7']
const ANSWER_COLORS: Record<string, string> = {
  A: '#3b82f6',
  B: '#8b5cf6',
  C: '#f59e0b',
  D: '#10b981',
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CardImageFallback() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2040 50%, #1a1040 100%)',
      }}
    >
      <div
        style={{
          width: '55%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #ef4444 50%, #fff 50%)',
          border: '4px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '28%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: '#fff',
            border: '3px solid #ccc',
          }}
        />
      </div>
    </div>
  )
}

function CardImg({
  src,
  alt,
  className = '',
  style = {},
}: {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const [err, setErr] = useState(false)
  if (err) return <CardImageFallback />
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      style={style}
      crossOrigin="anonymous"
      onError={() => setErr(true)}
    />
  )
}

function AnswerBtn({
  letter,
  text,
  state,
  onClick,
}: {
  letter: string
  text: string
  state: 'idle' | 'correct' | 'wrong' | 'faded'
  onClick: () => void
}) {
  const base = ANSWER_COLORS[letter] ?? '#3b82f6'

  const styles: Record<string, React.CSSProperties> = {
    idle: {
      background: 'rgba(255,255,255,0.06)',
      border: `2px solid ${base}55`,
      color: '#ffffffcc',
    },
    correct: {
      background: '#16a34a',
      border: '2px solid #4ade8055',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
    },
    wrong: {
      background: '#dc2626',
      border: '2px solid #f8717155',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
    },
    faded: {
      background: 'rgba(255,255,255,0.03)',
      border: '2px solid rgba(255,255,255,0.08)',
      color: '#ffffff33',
    },
  }

  const extraClass =
    state === 'correct' ? 'flash-correct' : state === 'wrong' ? 'flash-wrong' : ''

  return (
    <button
      onClick={onClick}
      disabled={state !== 'idle'}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left w-full h-full
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
        disabled:cursor-default disabled:hover:scale-100 ${extraClass}`}
      style={styles[state]}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
        style={{
          background: `${base}22`,
          border: `2px solid ${base}${state === 'faded' ? '22' : '77'}`,
          color: state === 'faded' ? '#ffffff22' : base,
        }}
      >
        {letter}
      </span>
      <span className="text-lg font-bold leading-snug">{text}</span>
    </button>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function GameClient() {
  const router = useRouter()
  const gameIdxRef = useRef(0)

  const [game] = useState(() => {
    const saved = loadGameState()
    const gIdx = saved ? saved.gameIndex : loadSelectedGame()
    return games[gIdx] ?? games[0]
  })

  const [questionIndex, setQuestionIndex] = useState(() => {
    const saved = loadGameState()
    if (!saved || saved.phase === 'game_over') return 0
    const g = games[saved.gameIndex] ?? games[0]
    return saved.questionIndex < g.questions.length ? saved.questionIndex : 0
  })

  const [wonCards, setWonCards] = useState<number[]>(() => {
    const saved = loadGameState()
    if (!saved || saved.phase === 'game_over') return []
    const g = games[saved.gameIndex] ?? games[0]
    return saved.questionIndex < g.questions.length ? saved.wonCards : []
  })

  const [phase, setPhase] = useState<Phase>('show_front')
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function later(fn: () => void, ms: number) {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }
  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // Persist
  useEffect(() => {
    if (phase === 'start') return
    saveGameState({ gameIndex: gameIdxRef.current, questionIndex, wonCards, phase })
  }, [phase, questionIndex, wonCards])

  // Init: only side-effects (no setState), state is lazy-initialized above
  useEffect(() => {
    const saved = loadGameState()
    const gIdx = saved ? saved.gameIndex : loadSelectedGame()
    gameIdxRef.current = gIdx
    const g = games[gIdx] ?? games[0]
    if (!saved || saved.phase === 'game_over' || saved.questionIndex >= g.questions.length) {
      clearGameState()
    }
    return clearTimers
  }, [])

  // ── Animation sequence ──────────────────────────────────────────────────

  function beginCard(qIdx: number) {
    setSelectedIdx(null)
    setQuestionIndex(qIdx)
    setPhase('show_front')
  }

  // Called when we're ready to flip (after show_front pause)
  function startFlip() {
    setPhase('flip_out') // portrait spins to 90°
    // halfway through flip (portrait invisible), switch to landscape
    later(() => setPhase('flip_in'), 420)
    // landscape fully in → question active
    later(() => setPhase('question'), 420 + 480)
  }

  useEffect(() => {
    if (phase === 'show_front') {
      const id = later(startFlip, 700)
      return () => clearTimeout(id)
    }
  }, [phase])

  // ── Game logic ──────────────────────────────────────────────────────────

  function handleAnswer(ansIdx: number) {
    if (phase !== 'question') return
    setSelectedIdx(ansIdx)
    setPhase('revealing')

    const correct = game.questions[questionIndex].answers[ansIdx].correct

    later(() => {
      if (correct) {
        const next = [...wonCards, questionIndex]
        setWonCards(next)
        if (questionIndex === game.questions.length - 1) {
          setPhase('celebration')
          clearGameState()
          spawnConfetti()
        } else {
          setPhase('keep_or_next')
        }
      } else {
        setPhase('game_over')
        clearGameState()
      }
    }, 2800)
  }

  function handleKeep() {
    clearGameState()
    setPhase('kept')
  }

  function handleNext() {
    const nextIdx = questionIndex + 1
    setPhase('falling')
    later(() => beginCard(nextIdx), 600)
  }

  function spawnConfetti() {
    setConfetti(
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        duration: `${2.5 + Math.random() * 3}s`,
        delay: `${Math.random() * 2.5}s`,
        size: `${8 + Math.random() * 14}px`,
      })),
    )
  }

  // ── Derived state ───────────────────────────────────────────────────────

  const q: Question | undefined = game.questions[questionIndex]

  function answerState(idx: number): 'idle' | 'correct' | 'wrong' | 'faded' {
    if (phase !== 'revealing' && phase !== 'keep_or_next' && phase !== 'game_over') return 'idle'
    if (selectedIdx === null) return 'idle'
    const a = q?.answers[idx]
    if (!a) return 'idle'
    if (a.correct) return 'correct'
    if (idx === selectedIdx) return 'wrong'
    return 'faded'
  }

  // Portrait card shown while showing front, dismissed when flip-in starts
  const showPortrait = ['show_front', 'flip_out'].includes(phase)

  // Landscape shown from the moment the flip-in starts
  const showLandscape = [
    'flip_in', 'question', 'revealing', 'keep_or_next',
  ].includes(phase)

  // Safe haven helpers
  const safeHavenPassed = wonCards.includes(SAFE_HAVEN_INDEX)
  const isAtSafeHaven = questionIndex === SAFE_HAVEN_INDEX
  const isPastSafeHaven = questionIndex > SAFE_HAVEN_INDEX
  function safeCards() {
    return questionIndex > SAFE_HAVEN_INDEX
      ? wonCards.filter((i) => i <= SAFE_HAVEN_INDEX)
      : []
  }

  // Portrait card dimensions (matched to timeline card aspect but large)
  const PORTRAIT_W = 'min(260px, 52vw)'
  const PORTRAIT_H = 'min(364px, calc(52vw * 1.4))'

  // Landscape card dimensions
  const LANDSCAPE_W = 'min(860px, 76vw)'
  const LANDSCAPE_H = 'min(460px, 50vh)'

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="game-bg min-h-screen w-full flex flex-col overflow-hidden relative select-none">

      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-5 pb-2 z-10 shrink-0">
        <button
          onClick={() => { clearGameState(); router.push('/') }}
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          ← Hjem
        </button>
        <h2
          className="font-black tracking-wide text-xl md:text-2xl"
          style={{
            background: 'linear-gradient(90deg, #facc15, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Vil du bli en Pokemonær?
        </h2>
        <div className="text-white/35 text-xs font-mono text-right max-w-30 truncate">
          {game.name}
        </div>
      </div>

      {/* ── Prize ladder (right side, visible during question) ── */}
      <AnimatePresence>
        {showLandscape && (
          <motion.div
            className="fixed right-3 z-30 flex flex-col-reverse gap-1"
            style={{
              top: '72px',
              width: 'clamp(150px, 17vw, 220px)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {game.questions.map((qItem, i) => {
              const isActive = i === questionIndex
              const isWon = wonCards.includes(i)
              const isSafe = i === SAFE_HAVEN_INDEX
              const isFuture = i > questionIndex && !isWon

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    padding: '6px 14px',
                    background: isActive
                      ? 'rgba(250,204,21,0.22)'
                      : isWon
                      ? 'rgba(22,163,74,0.16)'
                      : isSafe && safeHavenPassed
                      ? 'rgba(56,189,248,0.12)'
                      : 'rgba(255,255,255,0.03)',
                    border: isActive
                      ? '1.5px solid rgba(250,204,21,0.7)'
                      : isWon
                      ? '1.5px solid rgba(74,222,128,0.4)'
                      : isSafe
                      ? '1.5px solid rgba(56,189,248,0.4)'
                      : '1.5px solid transparent',
                    boxShadow: isActive
                      ? '0 0 14px rgba(250,204,21,0.35), inset 0 0 10px rgba(250,204,21,0.08)'
                      : isWon
                      ? '0 0 8px rgba(74,222,128,0.2)'
                      : isSafe && safeHavenPassed
                      ? '0 0 8px rgba(56,189,248,0.2)'
                      : 'none',
                  }}
                >
                  <span
                    className="shrink-0 w-6 text-center font-black"
                    style={{
                      fontSize: 'clamp(9px, 1.1vw, 13px)',
                      color: isActive ? '#facc15' : isWon ? '#4ade80' : isSafe ? '#7dd3fc' : '#ffffff40',
                    }}
                  >
                    {isActive ? '▶' : isWon ? '✓' : isSafe ? '🛡' : `${i + 1}`}
                  </span>
                  <span
                    className="truncate font-semibold"
                    style={{
                      fontSize: 'clamp(9px, 1.1vw, 13px)',
                      color: isActive
                        ? '#facc15'
                        : isWon
                        ? '#4ade80'
                        : isSafe
                        ? '#7dd3fc'
                        : isFuture
                        ? '#ffffff20'
                        : '#ffffff55',
                      fontWeight: isActive ? 800 : isSafe ? 700 : isWon ? 600 : 400,
                    }}
                  >
                    {qItem.prizeName}
                  </span>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Center area ── */}
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 40, pointerEvents: 'none', paddingTop: '68px', paddingBottom: '180px' }}>

        {/* Portrait card: pops in at center, then flips out */}
        <AnimatePresence>
          {showPortrait && q && (
            <motion.div
              key={`portrait-${questionIndex}`}
              style={{
                width: PORTRAIT_W,
                height: PORTRAIT_H,
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid rgba(250,204,21,0.35)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                pointerEvents: 'none',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateY: phase === 'flip_out' ? 90 : 0,
              }}
              transition={
                phase === 'flip_out'
                  ? { rotateY: { duration: 0.4, ease: 'easeIn' }, scale: { duration: 0 }, opacity: { duration: 0 } }
                  : { scale: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }, opacity: { duration: 0.25 } }
              }
            >
              <CardImg src={q.imageUrl} alt={`Spørsmål ${questionIndex + 1}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landscape question card */}
        <AnimatePresence>
          {showLandscape && q && (
            <motion.div
              key={`landscape-${questionIndex}`}
              style={{
                width: LANDSCAPE_W,
                height: LANDSCAPE_H,
                borderRadius: '18px',
                overflow: 'hidden',
                border: '2px solid rgba(250,204,21,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                pointerEvents: 'auto',
              }}
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <div
                className="w-full h-full flex flex-col"
                style={{
                  background: 'linear-gradient(160deg, #0c1220 0%, #1a1650 50%, #0c1220 100%)',
                  padding: '1.2rem 1.5rem',
                  gap: '0.8rem',
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-black px-2 py-1 rounded tracking-widest"
                      style={{
                        background: 'rgba(250,204,21,0.15)',
                        color: '#facc15',
                        border: '1px solid rgba(250,204,21,0.3)',
                      }}
                    >
                      {questionIndex + 1} / {game.questions.length}
                    </span>
                    <span className="text-white/45 text-xs font-medium">{q.prizeName}</span>
                  </div>
                  {isAtSafeHaven && (
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(56,189,248,0.15)',
                        color: '#7dd3fc',
                        border: '1px solid rgba(56,189,248,0.35)',
                      }}
                    >
                      🛡 Frihavn
                    </span>
                  )}
                </div>

                {/* Question + silhouette */}
                <div
                  className="shrink-0 flex items-center gap-4 px-4 py-3 rounded-2xl"
                  style={{
                    background: 'rgba(250,204,21,0.07)',
                    border: '1px solid rgba(250,204,21,0.2)',
                  }}
                >
                  {q.questionImageUrl && (
                    <img
                      src={q.questionImageUrl}
                      alt="Hvem er denne?"
                      crossOrigin="anonymous"
                      style={{
                        height: 'clamp(52px, 7vw, 90px)',
                        width: 'auto',
                        imageRendering: 'pixelated',
                        filter:
                          q.isSilhouette && phase !== 'keep_or_next'
                            ? 'brightness(0) saturate(0)'
                            : 'none',
                        transition: 'filter 0.6s ease',
                      }}
                    />
                  )}
                  <p className="text-white font-black text-center flex-1"
                     style={{ fontSize: 'clamp(1rem, 2.2vw, 1.5rem)', lineHeight: 1.3 }}>
                    {q.question}
                  </p>
                </div>

                {/* 2×2 answer grid */}
                <div
                  className="flex-1 grid grid-cols-2 gap-3 min-h-0"
                >
                  {q.answers.map((a, idx) => (
                    <AnswerBtn
                      key={a.letter}
                      letter={a.letter}
                      text={a.answer}
                      state={answerState(idx)}
                      onClick={() => handleAnswer(idx)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Keep or Next overlay ── */}
      <AnimatePresence>
        {phase === 'keep_or_next' && q && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-5 px-10 py-8 rounded-3xl text-center mx-4"
              style={{
                background: 'linear-gradient(160deg, #0f172a, #1e1b4b)',
                border: '1px solid rgba(250,204,21,0.2)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                maxWidth: '480px',
                width: '100%',
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div>
                <p className="text-green-400 font-black text-2xl mb-1">✓ Riktig svar!</p>
                <p className="text-white text-lg font-bold">
                  Du vinner:{' '}
                  <span className="text-yellow-400">{q.prizeName}</span>
                </p>
              </div>

              {isAtSafeHaven && (
                <div
                  className="px-4 py-2 rounded-xl text-sm font-semibold w-full"
                  style={{
                    background: 'rgba(56,189,248,0.1)',
                    border: '1px solid rgba(56,189,248,0.35)',
                    color: '#7dd3fc',
                  }}
                >
                  🛡 Du har nådd frihavnen! De første 5 kortene er nå sikret uansett hva.
                </div>
              )}

              {isPastSafeHaven && (
                <div
                  className="px-4 py-2 rounded-xl text-xs font-medium w-full"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.22)',
                    color: '#fca5a5',
                  }}
                >
                  ⚠️ Svarer du feil beholder du bare de 5 kortene fra frihavnen.
                </div>
              )}

              <div className="w-full h-px bg-white/10" />

              {questionIndex + 1 < game.questions.length && (
                <p className="text-white/55 text-sm">
                  Neste:{' '}
                  <span className="text-yellow-400 font-semibold">
                    {game.questions[questionIndex + 1]?.prizeName}
                  </span>
                </p>
              )}

              <div className="flex gap-4 w-full">
                <button
                  onClick={handleKeep}
                  className="flex-1 py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  }}
                >
                  🏆 Beholde
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  }}
                >
                  🎲 Neste!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Kept overlay ── */}
      <AnimatePresence>
        {phase === 'kept' && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6"
            style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1a2e 50%, #0a0f1e 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Title */}
            <motion.div
              className="text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <h2
                className="font-black leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #facc15 60%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 12px rgba(250,204,21,0.3))',
                }}
              >
                Gratulerer!
              </h2>
              <p className="text-white/50 text-base mt-1">
                Du forlater spillet med {wonCards.length} kort
              </p>
            </motion.div>

            {/* Won cards row */}
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {wonCards.map((i, pos) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 + pos * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    style={{
                      width: 'clamp(70px, 10vw, 110px)',
                      height: 'clamp(98px, 14vw, 154px)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid rgba(250,204,21,0.5)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 0 12px rgba(250,204,21,0.15)',
                    }}
                  >
                    <img
                      src={game.questions[i].imageUrl}
                      alt={game.questions[i].prizeName}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span
                    className="text-center font-semibold leading-tight"
                    style={{
                      fontSize: 'clamp(9px, 1.2vw, 12px)',
                      color: '#facc15',
                      maxWidth: 'clamp(70px, 10vw, 110px)',
                    }}
                  >
                    {game.questions[i].prizeName}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Back button */}
            <motion.button
              onClick={() => router.push('/')}
              className="px-12 py-4 rounded-2xl font-black text-xl text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
                boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
                letterSpacing: '0.03em',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Tilbake til start
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Game over overlay ── */}
      <AnimatePresence>
        {phase === 'game_over' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="flex flex-col items-center gap-6 px-10 py-8 rounded-3xl text-center mx-4"
              style={{
                background: 'linear-gradient(160deg, #1a0a0a, #2d0a0a)',
                border: '1px solid rgba(239,68,68,0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                maxWidth: '680px',
                width: '100%',
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-7xl">💀</p>
              <div>
                <p className="text-red-400 font-black text-3xl mb-2">Feil svar!</p>
                {safeCards().length > 0 ? (
                  <p className="text-white/70 text-lg">
                    Du beholder de {safeCards().length} kortene fra frihavnen!
                  </p>
                ) : (
                  <p className="text-white/70 text-lg">Ingen kort denne gangen. Prøv igjen!</p>
                )}
              </div>
              {safeCards().length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {safeCards().map((i, pos) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + pos * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        style={{
                          width: 'clamp(60px, 9vw, 90px)',
                          height: 'clamp(84px, 12.6vw, 126px)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '2px solid rgba(56,189,248,0.5)',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.5), 0 0 10px rgba(56,189,248,0.15)',
                        }}
                      >
                        <img
                          src={game.questions[i].imageUrl}
                          alt={game.questions[i].prizeName}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <span
                        className="text-center font-semibold leading-tight"
                        style={{
                          fontSize: 'clamp(8px, 1vw, 11px)',
                          color: '#7dd3fc',
                          maxWidth: 'clamp(60px, 9vw, 90px)',
                        }}
                      >
                        {game.questions[i].prizeName}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
              <button
                onClick={() => { clearGameState(); router.push('/') }}
                className="px-10 py-4 rounded-2xl font-black text-xl text-white transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                }}
              >
                Tilbake til start
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Celebration overlay ── */}
      <AnimatePresence>
        {phase === 'celebration' && q && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.p
              className="font-black text-center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                background: 'linear-gradient(90deg, #facc15, #f97316, #facc15)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              🎉 GRATULERER! 🎉
            </motion.p>

            <motion.div
              className="celeb-card overflow-hidden rounded-2xl"
              style={{
                width: 'min(260px, 70vw)',
                height: 'min(364px, calc(70vw * 1.4))',
                border: '3px solid rgba(250,204,21,0.6)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <CardImg src={q.imageUrl} alt="Vunnet kort" />
            </motion.div>

            <div className="text-center px-4">
              <p className="text-yellow-400 font-black text-2xl">{q.prizeName}</p>
              <p className="text-white/70 text-base mt-1">Du klarte alle 10 spørsmål! 🏆</p>
            </div>

            <button
              onClick={() => { clearGameState(); router.push('/') }}
              className="px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                color: '#0a0a1a',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              }}
            >
              Nytt spill
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline ── */}
      <Timeline
        game={game}
        wonCards={wonCards}
        activeIndex={questionIndex}
        safeHavenIndex={SAFE_HAVEN_INDEX}
      />
    </div>
  )
}
