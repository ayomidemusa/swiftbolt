import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";


type LatLng = {
  lat: number;
  lng: number;
};

function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (p: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });

  return null;
}

export function RideMap({
  center,
  pickup,
  destination,
  drivers = [],
  route = [],
  onMapClick,
}: {
  center: LatLng;
  pickup?: LatLng | null;
  destination?: LatLng | null;
  drivers?: LatLng[];
  route?: LatLng[];
  onMapClick?: (p: LatLng) => void;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} />

      {drivers.map((driver, index) => (
        <Marker
          key={index}
          position={[driver.lat, driver.lng]}
        />
      ))}

      {pickup && (
        <Marker
          position={[pickup.lat, pickup.lng]}
        />
      )}

      {destination && (
        <Marker
          position={[destination.lat, destination.lng]}
        />
      )}

{route.length > 0 && (
  <Polyline
    positions={route.map((p) => [p.lat, p.lng])}
    color="blue"
    weight={5}
  />
)}
    </MapContainer>
  );
}