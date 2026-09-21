import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import firebase from "firebase";

import { saveLeaderboardEntry } from "../utils/leaderboard";

interface UserState {
  username: string;
  uid: string;
  highScore: number;
}

// Define the initial state using that type
const initialState: UserState = {
  username: "",
  uid: "",
  highScore: 0,
};

export const setNewHighScoreThunk = createAsyncThunk(
  "user/newHighScore",
  async ({
    newHighScore,
    id,
    username,
  }: {
    newHighScore: number;
    id: string;
    username?: string;
  }) => {
    // Persist to local storage and update real gameplay leaderboard
    try {
      localStorage.setItem("mapi_high_score", newHighScore.toString());
      if (username) {
        saveLeaderboardEntry(username, newHighScore);
      }
    } catch (err) {
      console.warn("Error persisting high score to localStorage:", err);
    }

    if (id && !id.startsWith("local-")) {
      try {
        const db = firebase.firestore();
        const users = db.collection("users");
        const sfDocRef = users.doc(id);

        await db.runTransaction(async (transaction) => {
          return await transaction.update(sfDocRef, { highScore: newHighScore });
        });
      } catch (e) {
        console.warn("Firestore high score update skipped/failed: ", e);
      }
    }

    return newHighScore;
  }
);

export const usersSlice = createSlice({
  name: "users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUsername: (
      state,
      action: PayloadAction<{ username: string; uid: string }>
    ) => {
      return {
        ...state,
        username: action.payload.username,
        uid: action.payload.uid,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setNewHighScoreThunk.fulfilled,
      (state, { payload }): UserState => {
        return { ...state, highScore: payload ?? state.highScore };
      }
    );
  },
});

export const { setUsername } = usersSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const getUsername = (state: RootState) => state.users.username;
export const getUserUid = (state: RootState) => state.users.uid;
export const getHighScore = (state: RootState) => state.users.highScore;

export const usersReducer = usersSlice.reducer;
