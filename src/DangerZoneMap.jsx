import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

const centerOfIndia = {
  lat: 22.9734,
  lng: 78.6569,
};

// Mock data — replace with real backend fetch
const citiesWithCounts = [
  { name: "Delhi", lat: 28.7041, lng: 77.1025, count: 120 },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, count: 25 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, count: 65 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, count: 48 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, count: 55 },
];

export default function DangerZoneMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerOfIndia}
        zoom={5.5}
        onLoad={handleMapLoad}
      >
        {mapLoaded &&
          citiesWithCounts.map((city, idx) => (
            <Marker
              key={idx}
              position={{ lat: city.lat, lng: city.lng }}
              label={{
                text: city.name,
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: city.count > 50 ? "red" : "orange",
                fillOpacity: 1,
                scale: 10,
                strokeColor: "white",
                strokeWeight: 1,
              }}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
}
