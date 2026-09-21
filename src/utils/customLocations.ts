/**
 * Utility for managing custom locations locally without any external database.
 * Custom locations are stored in localStorage and synchronized reactively.
 */

const CUSTOM_LOCATIONS_STORAGE_KEY = "mapi_custom_locations_v1";
export const CUSTOM_LOCATIONS_UPDATED_EVENT = "mapi_custom_locations_updated";

export interface CustomLocationEntry {
  id: string;
  place: Place;
}

/**
 * Retrieves all custom locations from localStorage.
 */
export const getStoredCustomLocations = (): [Place, string][] => {
  try {
    const raw = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: CustomLocationEntry[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => [item.place, item.id]);
  } catch (error) {
    console.warn("Failed to load custom locations from localStorage:", error);
    return [];
  }
};

/**
 * Saves a new custom location to localStorage.
 */
export const saveCustomLocation = (place: Place): string => {
  const id = "loc-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
  try {
    const current = getStoredCustomLocations().map(([p, i]) => ({ id: i, place: p }));
    current.push({ id, place });
    localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(current));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CUSTOM_LOCATIONS_UPDATED_EVENT));
    }
  } catch (error) {
    console.warn("Failed to save custom location to localStorage:", error);
  }
  return id;
};

/**
 * Removes a custom location by ID from localStorage.
 */
export const deleteStoredCustomLocation = (id: string): void => {
  try {
    const current = getStoredCustomLocations().map(([p, i]) => ({ id: i, place: p }));
    const filtered = current.filter((item) => item.id !== id);
    localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(filtered));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CUSTOM_LOCATIONS_UPDATED_EVENT));
    }
  } catch (error) {
    console.warn("Failed to delete custom location from localStorage:", error);
  }
};
