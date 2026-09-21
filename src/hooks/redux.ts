import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  CUSTOM_LOCATIONS_UPDATED_EVENT,
  getStoredCustomLocations,
} from "../utils/customLocations";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to retrieve locally stored custom locations with real-time updates.
 */
export const useLocations = () => {
  const [countryList, setCountryList] = useState<[place: Place, id: string][]>(() =>
    getStoredCustomLocations()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setCountryList(getStoredCustomLocations());
    };

    window.addEventListener(CUSTOM_LOCATIONS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(CUSTOM_LOCATIONS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return [countryList, false, null] as [
    [place: Place, id: string][],
    boolean,
    null
  ];
};