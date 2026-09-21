/**
 * Dynamically loads the modern Google Maps JavaScript API.
 * Uses the latest weekly release channel (v=weekly) with loading=async
 * for optimal loading performance and latest Street View WebGL rendering capabilities.
 */
export const loadGMaps = (): Promise<typeof google> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).google && (window as any).google.maps) {
      return resolve((window as any).google);
    }

    const existingScript = document.getElementById("googleMaps");
    if (!existingScript) {
      const apiKey =
        process.env.REACT_APP_GOOGLE_MAPS_KEY ||
        "AIzaSyD44_D7amWWfM77MCt9lZXCb_iP5_TvcvU";
      const script = document.createElement("script");
      script.id = "googleMaps";
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeGMap&libraries=&v=weekly&loading=async`;

      (window as any).initializeGMap = () => {
        if ((window as any).google && (window as any).google.maps) {
          console.log(`[Google Maps API] Loaded successfully. Version: ${(window as any).google.maps.version}`);
          resolve((window as any).google);
        } else {
          reject(new Error("Google Maps object not found after callback"));
        }
      };

      script.onerror = (err) => {
        console.error("[Google Maps API] Failed to load script:", err);
        reject(err);
      };

      document.head.appendChild(script);
    } else {
      // If script tag exists but callback hasn't finished yet, listen or poll briefly
      const checkInterval = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(checkInterval);
          resolve((window as any).google);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkInterval);
        if ((window as any).google) {
          resolve((window as any).google);
        } else {
          reject(new Error("Timeout waiting for existing Google Maps script"));
        }
      }, 5000);
    }
  });
};
