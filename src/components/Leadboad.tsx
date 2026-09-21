import React, { FC, useEffect, useMemo, useState } from "react";
import "./leadboad.scss";
import { LeaderboardEntry } from "../Constants/defaultPlaces";
import { useAppSelector } from "../hooks/redux";
import { getHighScore, getUsername } from "../store/UserReducers";
import {
  getStoredLeaderboard,
  LEADERBOARD_UPDATED_EVENT,
} from "../utils/leaderboard";

const LeadboadEntry: FC<{ v: LeaderboardEntry }> = ({ v }) => {
  return (
    <>
      <div className="username">{v.username}</div>
      <div className="score">{v.highScore}</div>
    </>
  );
};

export const Leadboad = () => {
  const currentUsername = useAppSelector(getUsername);
  const currentHighScore = useAppSelector(getHighScore);
  const [localEntries, setLocalEntries] = useState<LeaderboardEntry[]>(() =>
    getStoredLeaderboard()
  );

  // Subscribe to leaderboard changes (updates from gameplays and localStorage)
  useEffect(() => {
    const handleUpdate = () => {
      setLocalEntries(getStoredLeaderboard());
    };

    window.addEventListener(LEADERBOARD_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(LEADERBOARD_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const entries = useMemo(() => {
    // Merge locally stored gameplay entries with active player session
    const map = new Map<string, number>();

    // 1. Add locally stored gameplay entries
    localEntries.forEach((e) => {
      const key = e.username.toLowerCase();
      const existing = map.get(key) || 0;
      map.set(key, Math.max(existing, e.highScore));
    });

    // 2. Add active user's current score if > 0
    if (currentUsername && currentHighScore > 0) {
      const key = currentUsername.toLowerCase();
      const existing = map.get(key) || 0;
      map.set(key, Math.max(existing, currentHighScore));
    }

    // Convert map to sorted LeaderboardEntry list
    const combined: LeaderboardEntry[] = [];
    map.forEach((score, lowerName) => {
      const original =
        localEntries.find((l) => l.username.toLowerCase() === lowerName)?.username ||
        (currentUsername && currentUsername.toLowerCase() === lowerName ? currentUsername : lowerName);
      combined.push({ username: original, highScore: score });
    });

    combined.sort((a, b) => b.highScore - a.highScore);
    return combined.slice(0, 4);
  }, [localEntries, currentUsername, currentHighScore]);

  return (
    <div id="leadboad">
      <div className="username heading">Username</div>
      <div className="score heading">Score</div>
      {entries.length > 0 ? (
        entries.map((v) => <LeadboadEntry v={v} key={v.username} />)
      ) : (
        <>
          <div className="username empty-leadboad" style={{ opacity: 0.6, fontSize: "0.95rem" }}>
            No scores yet
          </div>
          <div className="score empty-leadboad" style={{ opacity: 0.6, fontSize: "0.95rem" }}>
            -
          </div>
        </>
      )}
    </div>
  );
};
