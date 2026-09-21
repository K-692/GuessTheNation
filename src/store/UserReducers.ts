import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
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
    username,
  }: {
    newHighScore: number;
    id?: string;
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

    return newHighScore;
  }
);

export const usersSlice = createSlice({
  name: "users",
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
// Selectors
export const getUsername = (state: RootState) => state.users.username;
export const getUserUid = (state: RootState) => state.users.uid;
export const getHighScore = (state: RootState) => state.users.highScore;

export const usersReducer = usersSlice.reducer;
