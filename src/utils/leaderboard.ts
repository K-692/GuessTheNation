import { LeaderboardEntry } from "../Constants/defaultPlaces";

export const LEADERBOARD_STORAGE_KEY = "guessthenation_leaderboard_v1";
export const LEADERBOARD_UPDATED_EVENT = "guessthenation_leaderboard_updated";
const RESET_FLAG_KEY = "guessthenation_reset_done_v1";

// Automatic reset of legacy testing/gameplay data
try {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem(RESET_FLAG_KEY)) {
      localStorage.removeItem("mapi_leaderboard");
      localStorage.removeItem("mapi_leaderboard_v2");
      localStorage.removeItem("mapi_high_score");
      localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
      localStorage.setItem(RESET_FLAG_KEY, "true");
      console.log("[Leaderboard] Fresh reset completed.");
    }
  }
} catch (e) {
  console.warn("[Leaderboard] Initial reset check warning:", e);
}

/**
 * Retrieves the stored leaderboard entries from localStorage.
 * Returns an empty array if reset or no games have been played yet.
 */
export const getStoredLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((entry) => entry && typeof entry.username === "string" && typeof entry.highScore === "number")
        .sort((a, b) => b.highScore - a.highScore);
    }
  } catch (err) {
    console.warn("[Leaderboard] Error reading stored leaderboard:", err);
  }
  return [];
};

/**
 * Records or updates a player's gameplay score on the leaderboard.
 * Keeps the player's personal best (highest score achieved) and sorts descending.
 */
export const saveLeaderboardEntry = (username: string, score: number): LeaderboardEntry[] => {
  const trimmed = username.trim();
  if (!trimmed || score <= 0) {
    return getStoredLeaderboard();
  }

  const current = getStoredLeaderboard();
  const existingIndex = current.findIndex(
    (e) => e.username.toLowerCase() === trimmed.toLowerCase()
  );

  if (existingIndex !== -1) {
    // Update player's personal high score if current score is higher
    current[existingIndex].highScore = Math.max(current[existingIndex].highScore, score);
  } else {
    // Add new player entry
    current.push({ username: trimmed, highScore: score });
  }

  // Sort descending by high score
  current.sort((a, b) => b.highScore - a.highScore);

  // Retain top 10 all-time entries
  const trimmedList = current.slice(0, 10);

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(trimmedList));
    // Dispatch event so any rendered leaderboard components update in real time
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(LEADERBOARD_UPDATED_EVENT));
    }
  } catch (err) {
    console.warn("[Leaderboard] Error saving leaderboard entry:", err);
  }

  return trimmedList;
};

/**
 * Resets the leaderboard by wiping stored entries and resetting high scores.
 */
export const resetStoredLeaderboard = (): void => {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    localStorage.removeItem("mapi_high_score");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(LEADERBOARD_UPDATED_EVENT));
    }
    console.log("[Leaderboard] Stored leaderboard reset successfully.");
  } catch (err) {
    console.warn("[Leaderboard] Error resetting leaderboard:", err);
  }
};

// Expose reset function globally on window for convenience
if (typeof window !== "undefined") {
  (window as any).resetLeaderboard = resetStoredLeaderboard;
}
