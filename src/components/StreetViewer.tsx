import React, { useEffect, useRef } from "react";
import { loadGMaps } from "../gapi/loadGMap";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getCurPlace,
  getPlaces,
  loadPlacesThunk,
  skipInvalidPlace,
} from "../store/GameReducers";

export const StreetView = () => {
  const currentPlace = useAppSelector(getCurPlace);
  const places = useAppSelector(getPlaces);
  const dispatch = useAppDispatch();
  const panoRef = useRef<HTMLDivElement>(null);
  const panoramaInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null);

  // Load places on initial load if list is empty
  useEffect(() => {
    if (places.length === 0) {
      dispatch(loadPlacesThunk());
    }
  }, [places.length, dispatch]);

  // Active observer to auto-dismiss any Google Maps API warning popups
  // and maintain natural vivid colors on Street View canvas.
  useEffect(() => {
    const cleanOverlays = () => {
      // Auto-click the Google Maps dismiss button if rendered
      const dismissBtn = document.querySelector<HTMLElement>(".dismissButton");
      if (dismissBtn) {
        dismissBtn.click();
      }

      // Hide any "This page can't load Google Maps correctly" dialogs
      document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
        if (
          el.textContent &&
          (el.textContent.includes("This page can't load Google Maps correctly") ||
           el.textContent.trim() === "For development purposes only")
        ) {
          if (el.style.display !== "none") {
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("opacity", "0", "important");
            el.style.setProperty("pointer-events", "none", "important");
          }
        }
      });

      // Clear any filter: invert(1) applied to Street View canvas
      if (panoRef.current) {
        panoRef.current.querySelectorAll("canvas").forEach((canvas) => {
          if (canvas.style.filter && canvas.style.filter !== "none") {
            canvas.style.filter = "none";
          }
        });
      }
    };

    const observer = new MutationObserver(cleanOverlays);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    const interval = setInterval(cleanOverlays, 300);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Main Street View rendering effect
  useEffect(() => {
    let isCancelled = false;

    const renderStreetView = async () => {
      if (!currentPlace || !currentPlace.location) {
        return;
      }

      try {
        const google = await loadGMaps();
        if (isCancelled || !panoRef.current) return;

        // Initialize StreetViewPanorama singleton once without initial position
        // to prevent premature loading of unverified coordinates.
        if (!panoramaInstanceRef.current) {
          const panoInstance = new google.maps.StreetViewPanorama(
            panoRef.current,
            {
              pov: { heading: 34, pitch: 10 },
              zoom: 1,
              addressControl: false,
              showRoadLabels: false,
              fullscreenControl: false,
              motionTracking: false,
              motionTrackingControl: false,
              linksControl: true, // Navigation arrows along the street
              panControl: true,
              enableCloseButton: false,
              zoomControl: true,
              clickToGo: true, // Roam forward by clicking on the road
              scrollwheel: true, // Zoom with mouse wheel
              visible: true,
            }
          );

          // Listen for status changes to detect and recover from any rendering failure
          panoInstance.addListener("status_changed", () => {
            const status = panoInstance.getStatus();
            if (status === "ZERO_RESULTS" || status === "UNKNOWN_ERROR") {
              console.warn(
                `[Street View] Panorama status error: ${status}. Skipping to next place.`
              );
              dispatch(skipInvalidPlace());
            }
          });

          panoramaInstanceRef.current = panoInstance;
          svServiceRef.current = new google.maps.StreetViewService();
        }

        const panorama = panoramaInstanceRef.current;
        const svService = svServiceRef.current || new google.maps.StreetViewService();

        /**
         * Verifies and applies panorama data:
         * - Ensures status is OK
         * - Requires official Google imagery or verified road navigation links (links.length > 0)
         * - Explicitly rejects isolated, third-party user photospheres that cause black screens
         */
        const applyPanoramaData = (
          data: google.maps.StreetViewPanoramaData | null,
          status: google.maps.StreetViewStatus
        ) => {
          if (isCancelled) return;

          if (
            status === google.maps.StreetViewStatus.OK &&
            data &&
            data.location?.pano
          ) {
            const isGoogle =
              (data.copyright && data.copyright.indexOf("Google") !== -1) || false;
            const hasLinks = Boolean(data.links && data.links.length > 0);

            // Strictly require navigable road links so player can roam with keys/clicks, and reject non-navigable views
            if (!hasLinks || (!isGoogle && data.location.pano.startsWith("CAoS"))) {
              console.warn(
                `[Street View] Rejected non-navigable view/photosphere for ${currentPlace.country} (${data.copyright}). Advancing to next verified location.`
              );
              dispatch(skipInvalidPlace());
              return;
            }

            // Apply confirmed panorama
            panorama.setPano(data.location.pano);
            panorama.setPov({ heading: 34, pitch: 10 });
            panorama.setVisible(true);

            console.log(
              `[Street View] Rendered ${currentPlace.country} | Pano: ${data.location.pano} | Date: ${data.imageDate || "N/A"} | Provider: ${data.copyright}`
            );
          } else {
            console.warn(
              `[Street View] No valid street view found for ${currentPlace.country} (Status: ${status}). Advancing to next location.`
            );
            dispatch(skipInvalidPlace());
          }
        };

        // If location has a pre-verified official pano ID, query via pano ID
        if (currentPlace.pano) {
          svService.getPanorama(
            { pano: currentPlace.pano },
            (data, status) => {
              if (status === google.maps.StreetViewStatus.OK) {
                applyPanoramaData(data, status);
              } else {
                // Fall back to coordinate search if pano ID was altered
                svService.getPanorama(
                  {
                    location: currentPlace.location,
                    radius: 500,
                    source: google.maps.StreetViewSource.OUTDOOR,
                    preference: google.maps.StreetViewPreference.BEST,
                  },
                  applyPanoramaData
                );
              }
            }
          );
        } else {
          // Dynamic search for outdoor official road coverage within 500m
          svService.getPanorama(
            {
              location: currentPlace.location,
              radius: 500,
              source: google.maps.StreetViewSource.OUTDOOR,
              preference: google.maps.StreetViewPreference.BEST,
            },
            applyPanoramaData
          );
        }
      } catch (err) {
        console.error("[Street View] Error updating view:", err);
      }
    };

    renderStreetView();

    return () => {
      isCancelled = true;
    };
  }, [currentPlace, dispatch]);

  return (
    <div
      id="pano"
      ref={panoRef}
      tabIndex={0}
      style={{
        width: "100%",
        height: "100%",
        outline: "none",
        backgroundColor: "#111", // Clean dark backdrop while loading
      }}
    ></div>
  );
};
