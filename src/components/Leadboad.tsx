import React, { FC, useEffect, useState } from "react";
import "./leadboad.scss";
import { LeaderboardEntry } from "../Constants/defaultPlaces";
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

  const entries = localEntries.slice(0, 4);

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
