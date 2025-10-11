// Round Persistence Utility
// Saves and loads round state to/from localStorage for PWA resilience

const ROUND_STATE_KEY = 'hooky-golf-round-state';
const ROUND_TIMESTAMP_KEY = 'hooky-golf-round-timestamp';

export interface PersistedRoundState {
  screen: string;
  difficulty: { name: string; strikes: number } | null;
  currentHole: number;
  totalHoles: number;
  players: any[];
  bossResults: any[];
  shuffledBosses: any[];
  gameComplete: boolean;
  isVictory: boolean;
  failedAtHole?: number;
  skipsRemaining: number;
  skippedBosses: string[];
  usedChallenges: string[];
  currentChallenge?: string;
  course?: { placeId: string; name: string; address: string };
  savedAt: string;
}

/**
 * Save current round state to localStorage
 */
export function saveRoundState(gameState: any): void {
  try {
    // Only save if we're actually in a round (not on home, login, setup screens)
    const roundScreens = ['boss', 'results', 'caught', 'progress', 'summary'];
    if (!roundScreens.includes(gameState.screen)) {
      // If not in a round screen, clear any saved state
      clearRoundState();
      return;
    }

    const persistedState: PersistedRoundState = {
      screen: gameState.screen,
      difficulty: gameState.difficulty,
      currentHole: gameState.currentHole,
      totalHoles: gameState.totalHoles,
      players: gameState.players,
      bossResults: gameState.bossResults,
      shuffledBosses: gameState.shuffledBosses,
      gameComplete: gameState.gameComplete,
      isVictory: gameState.isVictory,
      failedAtHole: gameState.failedAtHole,
      skipsRemaining: gameState.skipsRemaining,
      skippedBosses: gameState.skippedBosses,
      usedChallenges: gameState.usedChallenges,
      currentChallenge: gameState.currentChallenge,
      course: gameState.course,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(ROUND_STATE_KEY, JSON.stringify(persistedState));
    localStorage.setItem(ROUND_TIMESTAMP_KEY, new Date().toISOString());
    
    console.log('[Round Persistence] State saved:', {
      screen: gameState.screen,
      hole: gameState.currentHole,
      totalHoles: gameState.totalHoles
    });
  } catch (error) {
    console.error('[Round Persistence] Failed to save state:', error);
  }
}

/**
 * Load saved round state from localStorage
 * Returns null if no valid saved state exists
 */
export function loadRoundState(): PersistedRoundState | null {
  try {
    const savedState = localStorage.getItem(ROUND_STATE_KEY);
    const savedTimestamp = localStorage.getItem(ROUND_TIMESTAMP_KEY);

    if (!savedState || !savedTimestamp) {
      return null;
    }

    // Check if saved state is too old (more than 24 hours)
    const savedTime = new Date(savedTimestamp).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      console.log('[Round Persistence] Saved state is too old, clearing');
      clearRoundState();
      return null;
    }

    const parsedState = JSON.parse(savedState) as PersistedRoundState;
    console.log('[Round Persistence] State loaded:', {
      screen: parsedState.screen,
      hole: parsedState.currentHole,
      totalHoles: parsedState.totalHoles,
      savedAt: parsedState.savedAt
    });

    return parsedState;
  } catch (error) {
    console.error('[Round Persistence] Failed to load state:', error);
    clearRoundState();
    return null;
  }
}

/**
 * Clear saved round state from localStorage
 */
export function clearRoundState(): void {
  try {
    localStorage.removeItem(ROUND_STATE_KEY);
    localStorage.removeItem(ROUND_TIMESTAMP_KEY);
    console.log('[Round Persistence] State cleared');
  } catch (error) {
    console.error('[Round Persistence] Failed to clear state:', error);
  }
}

/**
 * Check if there's a saved round available
 */
export function hasSavedRound(): boolean {
  return loadRoundState() !== null;
}
