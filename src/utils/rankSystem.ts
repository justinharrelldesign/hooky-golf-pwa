// Hooky Golf Rank System
// XP Principles:
// - Rounds won = 100 XP base (affected by difficulty multiplier AND hole multiplier)
// - Difficulty multipliers: Easy 1.0x, Medium 1.25x, Hard 1.5x
// - Hole multipliers: 9 holes 1.0x, 18 holes 2.0x
// - Perfect round (no strikes) = +50 XP bonus (affected by both multipliers)
// - Losses = 0 XP

export interface Rank {
  level: number;
  name: string;
  xpRequired: number; // XP needed to reach this rank from previous
  cumulativeXP: number; // Total XP needed from start
}

export const RANKS: Rank[] = [
  { level: 1, name: "Hooky Rookie", xpRequired: 0, cumulativeXP: 0 },
  { level: 2, name: "Hooky Amateur", xpRequired: 300, cumulativeXP: 300 },
  { level: 3, name: "Hooky Novice", xpRequired: 600, cumulativeXP: 900 },
  { level: 4, name: "Hooky Prodigy", xpRequired: 1000, cumulativeXP: 1900 },
  { level: 5, name: "Hooky Expert", xpRequired: 1500, cumulativeXP: 3400 },
  { level: 6, name: "Hooky Legend", xpRequired: 2000, cumulativeXP: 5400 },
  { level: 7, name: "Hooky Hero", xpRequired: 2500, cumulativeXP: 7900 },
  { level: 8, name: "Hooky God", xpRequired: 3500, cumulativeXP: 11400 }
];

export const XP_PER_WIN = 100;
export const XP_PERFECT_ROUND = 50; // Bonus for zero strikes

/**
 * Get difficulty multiplier based on difficulty name
 */
export function getDifficultyMultiplier(difficultyName: string): number {
  const normalizedName = difficultyName.toLowerCase();
  
  if (normalizedName.includes('easy')) {
    return 1.0;
  } else if (normalizedName.includes('medium')) {
    return 1.25;
  } else if (normalizedName.includes('hard')) {
    return 1.5;
  }
  
  // Default to easy if unknown
  return 1.0;
}

/**
 * Get hole multiplier based on number of holes
 */
export function getHoleMultiplier(totalHoles: number): number {
  if (totalHoles === 18) {
    return 2.0;
  } else if (totalHoles === 9) {
    return 1.0;
  }
  
  // Default to 1.0 for any other hole count
  return 1.0;
}

/**
 * Calculate total XP earned from a round (LEGACY - use calculatePlayerXP instead)
 */
export function calculateRoundXP(
  isVictory: boolean,
  challengesCompleted: number, // Number of bosses skipped
  totalStrikes: number // Total strikes across all players
): number {
  if (!isVictory) {
    return 0; // No XP for losses
  }

  let xp = XP_PER_WIN;
  
  // Bonus XP for challenges (skipped bosses)
  xp += challengesCompleted * XP_PER_CHALLENGE;
  
  // Perfect round bonus (no strikes at all)
  if (totalStrikes === 0) {
    xp += XP_PERFECT_ROUND;
  }
  
  return xp;
}

/**
 * Calculate INDIVIDUAL XP for a specific player
 */
export function calculatePlayerXP(
  roundIsVictory: boolean,
  playerWasCaught: boolean,
  playerStrikes: number,
  difficultyName: string = 'Easy',
  totalHoles: number = 9
): number {
  // Player only gets XP if they personally won (round victory AND not caught)
  const playerWon = roundIsVictory && !playerWasCaught;
  
  if (!playerWon) {
    return 0; // No XP if caught or if round was lost
  }

  const difficultyMultiplier = getDifficultyMultiplier(difficultyName);
  const holeMultiplier = getHoleMultiplier(totalHoles);
  
  // Apply both difficulty and hole multipliers
  let xp = XP_PER_WIN * difficultyMultiplier * holeMultiplier;
  
  // Perfect INDIVIDUAL performance bonus (player had zero strikes)
  if (playerStrikes === 0) {
    xp += XP_PERFECT_ROUND * difficultyMultiplier * holeMultiplier;
  }
  
  return Math.round(xp); // Round to nearest whole number
}

/**
 * Get rank information from total XP
 */
export function getRankFromXP(totalXP: number): Rank {
  // Find the highest rank the player has reached
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].cumulativeXP) {
      return RANKS[i];
    }
  }
  return RANKS[0]; // Default to first rank
}

/**
 * Get progress to next rank (0-1)
 */
export function getProgressToNextRank(totalXP: number): { 
  current: Rank; 
  next: Rank | null; 
  progress: number;
  xpToNext: number;
  currentRankXP: number;
} {
  const currentRank = getRankFromXP(totalXP);
  const nextRank = RANKS[currentRank.level]; // Next rank (level is 1-indexed, array is 0-indexed)
  
  if (!nextRank) {
    // Max rank achieved
    return {
      current: currentRank,
      next: null,
      progress: 1,
      xpToNext: 0,
      currentRankXP: totalXP - currentRank.cumulativeXP
    };
  }
  
  const xpInCurrentRank = totalXP - currentRank.cumulativeXP;
  const xpNeededForNextRank = nextRank.xpRequired;
  const progress = xpInCurrentRank / xpNeededForNextRank;
  
  return {
    current: currentRank,
    next: nextRank,
    progress: Math.min(progress, 1),
    xpToNext: xpNeededForNextRank - xpInCurrentRank,
    currentRankXP: xpInCurrentRank
  };
}

/**
 * Get all ranks for display purposes
 */
export function getAllRanks(): Rank[] {
  return RANKS;
}
