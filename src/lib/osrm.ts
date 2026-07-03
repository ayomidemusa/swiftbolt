export async function getRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ) {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${startLng},${startLat};${endLng},${endLat}` +
      `?overview=full&geometries=geojson`;
  
    const res = await fetch(url);
  
    const data = await res.json();
  
    if (!data.routes?.length) {
      return [];
    }
  
    return data.routes[0].geometry.coordinates.map(
      ([lng, lat]: number[]) => ({
        lat,
        lng,
      })
    );
  }