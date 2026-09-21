import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getUsername, setUsername } from "../store/UserReducers";
import { startNewGame } from "../store/GameReducers";
import "./name-register.scss";

export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername);
  const [usernameInputVal, onUsernameChange] = useState("");
  const [errorMsg, setError] = useState("");

  const play = () => {
    dispatch(startNewGame(null));
    history.push("/play");
  };

  const onPlay = () => {
    const trimmed = usernameInputVal.trim();
    if (!trimmed && !username) {
      setError("Please enter your name");
      return;
    }
    setError("");

    if (trimmed !== "") {
      const uid = "user-" + Date.now();
      dispatch(setUsername({ username: trimmed, uid }));
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
        <button type="submit">
          <img src={`${process.env.PUBLIC_URL}/assets/start.png`} alt="START" />
        </button>
      </form>
    </div>
  );
};
