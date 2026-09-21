import React, { FC, useEffect, useMemo, useState } from "react";
import "./leadboad.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
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

  // Optional Firestore snapshot listener (for online synchronized scores)
  const [snapshot] = useCollectionData<LeaderboardEntry>(
    firebase
      .firestore()
      .collection("users")
      .where("highScore", ">", 0)
      .orderBy("highScore", "desc")
      .limit(10)
  );

  const entries = useMemo(() => {
    // Merge Firestore snapshot, local storage entries, and current active session
    const map = new Map<string, number>();

    // 1. Add Firestore entries if available
    if (snapshot && snapshot.length > 0) {
      snapshot.forEach((e) => {
        if (e && e.username && typeof e.highScore === "number") {
          map.set(e.username.toLowerCase(), e.highScore);
        }
      });
    }

    // 2. Add locally stored gameplay entries
    localEntries.forEach((e) => {
      const key = e.username.toLowerCase();
      const existing = map.get(key) || 0;
      map.set(key, Math.max(existing, e.highScore));
    });

    // 3. Add active user's current score if > 0
    if (currentUsername && currentHighScore > 0) {
      const key = currentUsername.toLowerCase();
      const existing = map.get(key) || 0;
      map.set(key, Math.max(existing, currentHighScore));
    }

    // Convert map to sorted LeaderboardEntry list
    const combined: LeaderboardEntry[] = [];
    map.forEach((score, lowerName) => {
      // Find original display casing from localEntries or currentUsername
      const original =
        localEntries.find((l) => l.username.toLowerCase() === lowerName)?.username ||
        (currentUsername && currentUsername.toLowerCase() === lowerName ? currentUsername : lowerName);
      combined.push({ username: original, highScore: score });
    });

    combined.sort((a, b) => b.highScore - a.highScore);
    return combined.slice(0, 4);
  }, [snapshot, localEntries, currentUsername, currentHighScore]);

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
