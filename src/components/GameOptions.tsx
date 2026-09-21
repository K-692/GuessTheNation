import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCountry, getPlaces, getShowAns, showAnsThunk } from "../store/GameReducers";
import { random } from "../utils/tools";

import "./gameOptions.scss";

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const places = useAppSelector(getPlaces);
  const showAns = useAppSelector(getShowAns)

  const dispatch = useAppDispatch();
  const options = useMemo(() => {
    if (!country || places.length === 0) return ["", "", "", ""];

    // Get all distinct countries in places pool except current correct country
    const otherCountries = Array.from(
      new Set(places.map((p) => p.country).filter((c) => c && c !== country))
    );

    // Shuffle other countries
    for (let i = otherCountries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherCountries[i], otherCountries[j]] = [otherCountries[j], otherCountries[i]];
    }

    // Pick 3 distinct wrong options
    const wrongOptions = otherCountries.slice(0, 3);

    // Insert the correct answer at a random position (0-3)
    const ansOp = random(4);
    const result: [string, string, string, string] = ["", "", "", ""];
    let wrongIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i === ansOp) {
        result[i] = country;
      } else {
        result[i] = wrongOptions[wrongIdx] || "Other";
        wrongIdx++;
      }
    }
    return result;
  }, [country, places]);

  return (
    <div className="options">
      {options.map((v, i) => (
        <button
          key={i}
          onClick={() => dispatch(showAnsThunk(v))}
          className={`z1 option ${showAns ? (v === country ? "ans-r" : "ans-w") : ""}`}
          disabled={showAns}
        >
          {v}
        </button>
      ))}
    </div>
  );
};
