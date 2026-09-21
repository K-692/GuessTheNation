import React, { FC, useState } from "react";
import { useLocations } from "../hooks/redux";
import {
  deleteStoredCustomLocation,
  saveCustomLocation,
} from "../utils/customLocations";
import "./screens.scss";
import "./addLocations.scss";

const Location: FC<{
  setError: (a: string) => void;
  lat: number;
  lng: number;
  country: string;
  id: string;
}> = ({ setError, lat, lng, country, id }) => {
  const deleteDoc = () => {
    if (
      window.confirm(`Do you want to delete "${lat}, ${lng} of ${country}"?`)
    ) {
      try {
        deleteStoredCustomLocation(id);
      } catch (error: any) {
        setError("Error removing document: " + (error?.message || error));
        console.error("Error removing document: ", error);
      }
    }
  };
  return (
    <div className="location">
      <div className="lat value">
        <span id="lat">{lat}</span>
      </div>
      <div className="lng value">
        <span id="lng">{lng}</span>
      </div>
      <div className="country value">
        <span id="country">{country}</span>
      </div>
      <div className="delete value">
        <button onClick={deleteDoc} id="country">
          delete
        </button>
      </div>
    </div>
  );
};

export const AddLocations = () => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [countryList] = useLocations();

  const addLocation = () => {
    try {
      setError("");
      if (!country.trim()) {
        setError("Country name is required");
        return;
      }
      saveCustomLocation({ location: { lat, lng }, country: country.trim() });
      setCountry("");
      setLat(0);
      setLng(0);
    } catch (err: any) {
      setError(err?.message || "Failed to add location");
      console.log({ err });
    }
  };

  return (
    <section id="add-location" className="screen">
      <div className="locations hedding">
        <div className="location">
          <div className="lat value">
            <span id="lat">lat</span>
          </div>
          <div className="lng value">
            <span id="lng">lng</span>
          </div>
          <div className="country value">
            <span id="country">country</span>
          </div>
        </div>
      </div>
      <form
        className="locations"
        onSubmit={(e) => {
          e.preventDefault();
          addLocation();
        }}
      >
        <div className="add location">
          <div className="lat value">
            <input
              value={lat}
              onChange={(e) => setLat(+e.target.value)}
              type="number"
              step="any"
              name="lat"
              id="lat"
            />
          </div>
          <div className="lng value">
            <input
              value={lng}
              onChange={(e) => setLng(+e.target.value)}
              type="number"
              step="any"
              name="lng"
              id="lng"
            />
          </div>
          <div className="country value">
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              type="text"
              name="country"
              required={true}
              id="country"
              placeholder="country"
            />
          </div>
          <div className="add-button value">
            <button type="submit">Add</button>
          </div>
        </div>
        <div className="error">{error}</div>
      </form>

      <div className="locations">
        {countryList
          .filter((v) => v)
          .map(([v, id], i) => (
            <Location
              setError={setError}
              key={v.country + i}
              lat={v.location.lat}
              lng={v.location.lng}
              country={v.country}
              id={id}
            />
          ))}
      </div>
    </section>
  );
};
