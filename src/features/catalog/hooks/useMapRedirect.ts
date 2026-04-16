"use client";

import { useCallback } from "react";

interface Location {
  lat?: number;
  lng?: number;
  label: string;
}

export const useMapRedirect = () => {
  const redirectToMaps = useCallback(({ lat, lng, label }: Location) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    const query = encodeURIComponent(label);
    const coords = lat && lng ? `${lat},${lng}` : "";

    let url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    if (isIOS) {
      // Try Apple Maps first, or Google Maps iOS app
      url = coords 
        ? `maps://?ll=${coords}&q=${query}`
        : `maps://?q=${query}`;
    } else if (isAndroid) {
      // Try Google Maps Android app
      url = coords
        ? `geo:${coords}?q=${query}`
        : `geo:0,0?q=${query}`;
    }

    // Attempt to open the custom protocol
    window.location.href = url;

    // Fallback if the custom protocol doesn't respond (mostly for web)
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
      }
    }, 500);
  }, []);

  return { redirectToMaps };
};
