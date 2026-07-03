import { createServerFn } from "@tanstack/react-start";

export const geocodeAddress = createServerFn({ method: "POST" })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      data.query
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Swift Ride App",
      },
    });

    const json = await res.json();

    return {
      results: json.slice(0, 5).map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      })),
    };
  });

export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((d: { lat: number; lng: number }) => d)
  .handler(async ({ data }) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.lat}&lon=${data.lng}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Swift Ride App",
      },
    });

    const json = await res.json();

    return {
      address: json.display_name || "Selected location",
    };
  });