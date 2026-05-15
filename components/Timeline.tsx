'use client'

import { motion } from 'framer-motion'
import type { Game } from '@/lib/gameData'

interface TimelineProps {
  game: Game
  wonCards: number[]
  activeIndex: number
  safeHavenIndex: number
}

export default function Timeline({
  game,
  wonCards,
  activeIndex,
  safeHavenIndex,
}: TimelineProps) {
  const total = game.questions.length
  const maxWon = wonCards.length > 0 ? Math.max(...wonCards) : -1
  const progressPct = maxWon >= 0 ? (maxWon / (total - 1)) * 100 : 0

  function pct(i: number) {
    return total > 1 ? (i / (total - 1)) * 100 : 50
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 pb-5 pt-3"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.93) 80%, transparent)',
      }}
    >
      <div className="relative mx-auto" style={{ width: '82%' }}>

        {/* Cards — absolutely positioned above the line */}
        <div className="relative" style={{ height: 'clamp(64px, 11.5vw, 138px)', marginBottom: '10px' }}>
          {game.questions.map((q, i) => {
            const isActive = i === activeIndex
            const isWon = wonCards.includes(i)
            const isFuture = i > activeIndex && !isWon
            const isSafeHaven = i === safeHavenIndex

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pct(i)}%`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                }}
              >
                <div
                  style={{
                    width: 'clamp(40px, 7.5vw, 92px)',
                    height: 'clamp(56px, 10.5vw, 129px)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    opacity: isFuture && !isSafeHaven ? 0.28 : 1,
                    border: isWon
                      ? '2px solid #4ade80'
                      : isActive
                      ? '2px solid rgba(250,204,21,0.7)'
                      : isSafeHaven && !isFuture
                      ? '2px solid #7dd3fc'
                      : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    transition: 'opacity 0.3s, border 0.3s, box-shadow 0.3s',
                  }}
                >
                  <img
                    src={q.imageUrl}
                    alt={`Kort ${i + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const el = e.currentTarget
                      el.style.display = 'none'
                      if (el.parentElement)
                        el.parentElement.style.background = 'rgba(250,204,21,0.07)'
                    }}
                  />
                  {isWon && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(22,163,74,0.3)' }}
                    >
                      <span style={{ color: '#4ade80', fontWeight: 900, fontSize: 'clamp(8px,1.2vw,14px)' }}>
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Line + dots */}
        <div className="relative" style={{ height: '14px', marginBottom: '4px' }}>
          {/* Background track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full rounded-full"
            style={{ height: '4px', background: 'rgba(255,255,255,0.13)' }}
          />
          {/* Green fill */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full origin-left"
            style={{ height: '4px', left: 0, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {/* Dots */}
          {game.questions.map((_, i) => {
            const isWon = wonCards.includes(i)
            const isActive = i === activeIndex
            const isSafeHaven = i === safeHavenIndex

            return (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                style={{ left: `${pct(i)}%`, zIndex: 1 }}
                animate={{
                  width: isActive ? 20 : 13,
                  height: isActive ? 20 : 13,
                  backgroundColor: isActive
                    ? '#facc15'
                    : isWon
                    ? '#22c55e'
                    : isSafeHaven
                    ? '#7dd3fc'
                    : 'rgba(255,255,255,0.28)',
                  boxShadow: isActive
                    ? '0 0 8px #facc1588'
                    : isWon
                    ? '0 0 5px #22c55e55'
                    : 'none',
                }}
                transition={{ duration: 0.3 }}
              />
            )
          })}
        </div>

        {/* Number labels */}
        <div className="relative" style={{ height: '14px' }}>
          {game.questions.map((_, i) => {
            const isWon = wonCards.includes(i)
            const isActive = i === activeIndex
            const isSafeHaven = i === safeHavenIndex
            const isFuture = i > activeIndex && !isWon

            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pct(i)}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 'clamp(8px, 1vw, 11px)',
                  fontWeight: isActive || isSafeHaven ? 700 : 400,
                  color: isActive
                    ? '#facc15'
                    : isWon
                    ? '#4ade80'
                    : isSafeHaven
                    ? '#7dd3fc'
                    : isFuture
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.45)',
                }}
              >
                {isSafeHaven ? '🛡' : i + 1}
              </span>
            )
          })}
        </div>

      </div>
    </div>
  )
}
