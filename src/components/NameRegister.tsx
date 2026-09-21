import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getUsername, setUsername } from "../store/UserReducers";

import "./name-register.scss";
import firebase from "firebase";
import { startNewGame } from "../store/GameReducers";
export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername);
  const [usernameInputVal, onUsernameChange] = useState("");
  const [errorMsg, setError] = useState("");
  const play = () => {
    dispatch(startNewGame(null))
    history.push("/play");
  }
  const onPlay = async () => {
    const trimmed = usernameInputVal.trim();
    if (!trimmed && !username) {
      setError("Please enter your name");
      return;
    }
    setError("");

    if (trimmed !== "") {
      try {
        const users = firebase.firestore().collection("users");
        const addPromise = users.add({ username: trimmed, highScore: 0 });
        // 2.5 second timeout so blocked Firestore backend never hangs the user
        const res = await Promise.race([
          addPromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Firestore registration timeout")), 2500)
          ),
        ]);
        dispatch(setUsername({ username: trimmed, uid: res.id }));
      } catch (error) {
        console.warn("Firestore registration failed or offline. Using local session:", error);
        const localUid = "local-" + Date.now();
        dispatch(setUsername({ username: trimmed, uid: localUid }));
      }
      play();
    } else if (username !== "") {
      play();
    }
  };

  return (
    <div id="name-register">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPlay();
        }}
        action="none"
      >
        {username === "" ? (
          <>
            <input
              value={usernameInputVal}
              onChange={(e) => onUsernameChange(e.target.value)}
              type="text"
              placeholder="Enter Your Name"
              name="name"
              id="name"
              autoComplete="off"
            />
            <div className="error">{errorMsg}</div>
          </>
        ) : (
          <div className="username"> {username} </div>
        )}
        {/* <input type="submit" name="summit" value="START" id="submit" /> */}
        <button type="submit">
          <img src={`${process.env.PUBLIC_URL}/assets/start.png`} alt="START" />
        </button>
      </form>
    </div>
  );
};
