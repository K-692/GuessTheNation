import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_PLACES } from "../Constants/defaultPlaces";
import { getStoredCustomLocations } from "../utils/customLocations";
import { sleep } from "../utils/tools";
import { RootState } from "./store";

type GameState = {
  currentPlace: Place;
  places: Place[];
  showAns: boolean;
  shownPlaces: Place[];
  score: number;
  timeExpire: boolean;
};

// Define the initial state using default verified places so game starts immediately
const initialPick = DEFAULT_PLACES[Math.floor(Math.random() * DEFAULT_PLACES.length)];
const initialState: GameState = {
  currentPlace: initialPick,
  shownPlaces: [initialPick],
  showAns: false,
  places: DEFAULT_PLACES,
  score: 0,
  timeExpire: false,
};

/**
 * Selects a new place ensuring no repeated nation or street view coordinates
 * within the current gameplay session.
 */
const getNextPlace = (
  places: Place[],
  shownPlaces: Place[] = []
): { nextPlace: Place; updatedShown: Place[] } => {
  const pool = places && places.length > 0 ? places : DEFAULT_PLACES;

  // Filter out places with countries or coordinates already shown in this game session
  const shownCountries = new Set(shownPlaces.map((p) => p.country));
  const shownCoords = new Set(
    shownPlaces.map((p) => `${p.location.lat.toFixed(3)},${p.location.lng.toFixed(3)}`)
  );

  let available = pool.filter(
    (p) =>
      !shownCountries.has(p.country) &&
      !shownCoords.has(`${p.location.lat.toFixed(3)},${p.location.lng.toFixed(3)}`)
  );

  // If all distinct nations in pool have been shown, start a new cycle without immediately repeating last
  if (available.length === 0) {
    const last = shownPlaces[shownPlaces.length - 1];
    available = pool.filter((p) => !last || p.country !== last.country);
    if (available.length === 0) available = pool;
    const chosen = available[Math.floor(Math.random() * available.length)];
    return { nextPlace: chosen, updatedShown: [chosen] };
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  return { nextPlace: chosen, updatedShown: [...shownPlaces, chosen] };
};

export const loadPlacesThunk = createAsyncThunk("game/setPlaces", async () => {
  try {
    const custom = getStoredCustomLocations().map(([place]) => place);
    if (custom.length > 0) {
      return [...DEFAULT_PLACES, ...custom];
    }
  } catch (error) {
    console.warn("Failed to load local custom places:", error);
  }
  return DEFAULT_PLACES;
});

export const showAnsThunk = createAsyncThunk(
  "game/showAns",
  async (ans: string) => {
    await sleep(1500);
    return ans;
  }
);
export const RESTART_TIMER = "restart-timer";
export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    submitAns: (state, { payload: ans }: PayloadAction<string>) => {
      const isCorrect = ans === state.currentPlace.country;
      const { nextPlace, updatedShown } = getNextPlace(state.places, state.shownPlaces);
      return {
        ...state,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
        score: isCorrect ? state.score + 1 : state.score,
      };
    },
    restartGame: (state, _: PayloadAction<any>) => {
      document.dispatchEvent(new Event(RESTART_TIMER));
      const { nextPlace, updatedShown } = getNextPlace(state.places, []);
      return {
        ...state,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
        score: 0,
        timeExpire: false,
      };
    },
    giveupGame: (state, _: PayloadAction<any>) => {
      const { nextPlace, updatedShown } = getNextPlace(state.places, []);
      return {
        ...state,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
        score: 0,
      };
    },

    startNewGame: (state, _: PayloadAction<any>) => {
      const { nextPlace, updatedShown } = getNextPlace(state.places, []);
      return {
        ...state,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
        showAns: false,
        score: 0,
        timeExpire: false,
      };
    },
    timeExpire: (state, _: PayloadAction<any>) => {
      return {
        ...state,
        timeExpire: true,
      };
    },
    skipInvalidPlace: (state) => {
      const { nextPlace, updatedShown } = getNextPlace(state.places, state.shownPlaces);
      return {
        ...state,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadPlacesThunk.fulfilled,
      (state, { payload: places }) => {
        if (state.currentPlace && state.currentPlace.country) {
          return {
            ...state,
            places,
          };
        }
        const { nextPlace, updatedShown } = getNextPlace(places, state.shownPlaces);
        return {
          ...state,
          places,
          currentPlace: nextPlace,
          shownPlaces: updatedShown,
        };
      }
    );

    builder.addCase(showAnsThunk.fulfilled, (state, { payload: ans }) => {
      const isCorrect = ans === state.currentPlace.country;
      const { nextPlace, updatedShown } = getNextPlace(state.places, state.shownPlaces);
      return {
        ...state,
        showAns: false,
        currentPlace: nextPlace,
        shownPlaces: updatedShown,
        score: isCorrect ? state.score + 1 : state.score,
      };
    });
    builder.addCase(showAnsThunk.pending, (state, { payload: ans }) => ({
      ...state,
      showAns: true,
    }));
  },
});

export const {
  submitAns,
  restartGame,
  giveupGame,
  timeExpire,
  startNewGame,
  skipInvalidPlace,
} = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCurPlace = (state: RootState) => state.game.currentPlace;
export const getCurCoordinates = (state: RootState) =>
  state.game.currentPlace.location;
export const getCurCountry = (state: RootState) =>
  state.game.currentPlace.country;
export const getPlaces = (state: RootState) => state.game.places;
export const getScore = (state: RootState) => state.game.score;
export const getShowAns = (state: RootState) => state.game.showAns;
export const getTimeExpire = (state: RootState) => state.game.timeExpire;
export const GameReducer = gameSlice.reducer;
