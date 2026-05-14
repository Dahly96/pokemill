const STORAGE_KEY = 'pokeilionaire_state'
const SELECTED_KEY = 'pokeilionaire_selected'

export interface SavedGameState {
  gameIndex: number
  questionIndex: number
  wonCards: number[]
  phase: string
}

export function saveGameState(state: SavedGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function loadGameState(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedGameState
  } catch {
    return null
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function saveSelectedGame(gameIndex: number): void {
  try {
    localStorage.setItem(SELECTED_KEY, String(gameIndex))
  } catch {}
}

export function loadSelectedGame(): number {
  try {
    const raw = localStorage.getItem(SELECTED_KEY)
    return raw !== null ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}
