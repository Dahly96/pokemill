'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { games } from '@/lib/gameData'
import { saveSelectedGame, loadGameState, clearGameState } from '@/lib/gameState'

function subscribe() { return () => {} }
function getServerSnapshot() { return false }
function getClientSnapshot() {
  const saved = loadGameState()
  return saved !== null && saved.phase !== 'game_over' && saved.questionIndex < 10
}

const PIKACHU = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
const EEVEE   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'
const SPRITES = [PIKACHU, EEVEE, PIKACHU, EEVEE, PIKACHU]

export default function StartPage() {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState(0)
  const [userChangedGame, setUserChangedGame] = useState(false)
  const hasSavedInStorage = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const hasSavedGame = hasSavedInStorage && !userChangedGame

  function startGame() {
    clearGameState()
    saveSelectedGame(selectedGame)
    router.push('/game')
  }

  function resumeGame() {
    router.push('/game')
  }

  return (
    <div className="game-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Subtle background rings */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full border border-white/5" />
      <div className="absolute bottom-20 right-16 w-72 h-72 rounded-full border border-white/4" />

      {/* Main content */}
      <div className="flex flex-col items-center gap-9 z-10 px-8 text-center">

       

        {/* Title — gradient text, no glow */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
          style={{
            background: 'linear-gradient(175deg, #ffffff 0%, #facc15 55%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
          }}
        >
          Vil du bli en
          <br />
          Pokemonær?
        </h1>

        {/* Pikachu / Eevee row */}
        <div className="flex items-end gap-1">
          {SPRITES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={i % 2 === 0 ? 'Pikachu' : 'Eevee'}

              style={{
                width: i === 2 ? '52px' : '38px',
                height: i === 2 ? '52px' : '38px',
                objectFit: 'contain',
                opacity: i === 2 ? 1 : 0.65,
                filter: i === 2 ? 'drop-shadow(0 2px 6px rgba(250,204,21,0.4))' : 'none',
                transition: 'opacity 0.2s',
              }}
            />
          ))}
        </div>

        {/* Game selector — only shown when there are multiple games */}
        {games.length > 1 && (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <label className="text-white/55 text-sm font-medium tracking-widest uppercase">
              Velg spill
            </label>
            <select
              value={selectedGame}
              onChange={(e) => {
                setSelectedGame(Number(e.target.value))
                setUserChangedGame(true)
              }}
              className="w-full px-5 py-4 rounded-xl text-base font-semibold text-white cursor-pointer outline-none focus:ring-2 focus:ring-yellow-400/50"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {games.map((game, idx) => (
                <option
                  key={game.id}
                  value={idx}
                  style={{ background: '#0f0f2e', color: '#fff' }}
                >
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          {hasSavedGame && (
            <button
              onClick={resumeGame}
              className="w-full py-4 rounded-2xl text-lg font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
              }}
            >
              ▶ Fortsett spill
            </button>
          )}

          <button
            onClick={startGame}
            className="w-full py-5 rounded-2xl text-xl font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
              letterSpacing: '0.04em',
            }}
          >
            {hasSavedGame ? '🔄 Nytt spill' : '▶ Start spill'}
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-white/30 text-sm">
          10 spørsmål · 10 Pokémonkort å vinne
        </p>
      </div>
    </div>
  )
}
