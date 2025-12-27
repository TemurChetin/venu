"use client";

import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState } from "react";

const YandexMapComponent = () => {
  const mapState = {
    center: [41.3111, 69.2797],
    zoom: 10,
  };

  // 🔹 User bosgan joy koordinatasi
  const [coords, setCoords] = useState(null);

  return (
    <YMaps query={{ apikey: "YOUR_API_KEY" }}>
      <div style={{ width: "100%", height: "400px" }}>
        <Map
          defaultState={mapState}
          width="100%"
          height="100%"
          onClick={(e: any) => {
            const clickedCoords = e.get("coords");
            setCoords(clickedCoords);
            console.log("Bosilgan joy koordinatalari:", clickedCoords);
          }}
        >
          {/* Agar user bosgan bo‘lsa, marker chiqadi */}
          {coords && (
            <Placemark
              geometry={coords}
              options={{
                preset: "islands#icon",
                iconColor: "#ff0000",
              }}
            />
          )}
        </Map>
      </div>
    </YMaps>
  );
};

export default YandexMapComponent;
