import React, { useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [20.5937, 78.9629];

const toMapPoint = (location) => {
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
};

const FitMap = ({ points, followLocation }) => {
  const map = useMap();
  const lastKey = useRef("");

  useEffect(() => {
    const validPoints = points.filter(Boolean);
    if (!validPoints.length) return;

    const key = `${followLocation}:${validPoints.map((point) => point.join(",")).join("|")}`;
    if (lastKey.current === key) return;
    lastKey.current = key;

    if (followLocation || validPoints.length === 1) {
      map.setView(validPoints[0], followLocation ? 16 : 15);
    } else {
      map.fitBounds(validPoints, { padding: [40, 40], maxZoom: 15 });
    }
  }, [followLocation, map, points]);

  return null;
};

const MapControls = ({ map, followLocation, onToggleDriving }) => {
  const locate = () => {
    if (!navigator.geolocation || !map) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      map.setView([coords.latitude, coords.longitude], 16);
    });
  };

  return (
    <div className="absolute bottom-5 right-4 z-[1000] flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
        <button type="button" onClick={() => map?.zoomIn()} className="flex h-11 w-11 items-center justify-center border-b text-xl text-slate-800" aria-label="Zoom in">
          <i className="ri-add-line" />
        </button>
        <button type="button" onClick={() => map?.zoomOut()} className="flex h-11 w-11 items-center justify-center text-xl text-slate-800" aria-label="Zoom out">
          <i className="ri-subtract-line" />
        </button>
      </div>
      <button type="button" onClick={locate} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-slate-800 shadow-lg ring-1 ring-slate-200" aria-label="Center on my location">
        <i className="ri-crosshair-2-line" />
      </button>
      {onToggleDriving && (
        <button type="button" onClick={onToggleDriving} className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-lg ring-1 ring-slate-200 ${followLocation ? "bg-emerald-600 text-white" : "bg-white text-slate-800"}`} aria-label={followLocation ? "Stop driving mode" : "Start driving mode"}>
          <i className="ri-navigation-fill" />
        </button>
      )}
    </div>
  );
};

const DrivingRoute = ({ start, end, onRoute }) => {
  const [route, setRoute] = useState([]);
  const startKey = JSON.stringify(start);
  const endKey = JSON.stringify(end);

  useEffect(() => {
    const startPoint = JSON.parse(startKey);
    const endPoint = JSON.parse(endKey);
    if (!startPoint || !endPoint) {
      setRoute([]);
      onRoute([]);
      return undefined;
    }

    const controller = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${startPoint[1]},${startPoint[0]};${endPoint[1]},${endPoint[0]}?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Route request failed");
        return response.json();
      })
      .then((data) => {
        const positions = data.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [];
        setRoute(positions);
        onRoute(positions);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRoute([]);
          onRoute([]);
        }
      });

    return () => controller.abort();
  }, [endKey, onRoute, startKey]);

  return route.length > 1
    ? <Polyline positions={route} pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.85 }} />
    : null;
};

const RideMap = ({
  pickupLocation,
  destinationLocation,
  captainLocation,
  userLocation,
  routeTarget,
  followLocation = false,
  onToggleDriving,
  className = "",
}) => {
  const [map, setMap] = useState(null);
  const pickup = toMapPoint(pickupLocation);
  const destination = toMapPoint(destinationLocation);
  const captain = toMapPoint(captainLocation);
  const user = toMapPoint(userLocation);
  const routeStart = captain || user;
  const routeEnd = toMapPoint(routeTarget) || destination;
  const center = captain || user || pickup || destination || DEFAULT_CENTER;
  const [route, setRoute] = useState([]);
  const handleRoute = React.useCallback((positions) => setRoute(positions), []);
  const points = React.useMemo(
    () => [...route, pickup, destination, captain, user].filter(Boolean),
    [captain, destination, pickup, route, user],
  );

  return (
    <div className={`relative h-full w-full ${className}`}>
      <MapContainer center={center} zoom={13} zoomControl={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={20}
        />
        <MapCapture setMap={setMap} />
        <FitMap points={[captain || user || center, ...points]} followLocation={followLocation} />
        <DrivingRoute start={routeStart} end={routeEnd} onRoute={handleRoute} />
        {pickup && (
          <CircleMarker center={pickup} radius={9} pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 1 }}>
            <Tooltip permanent direction="top" offset={[0, -8]}>Pickup</Tooltip>
          </CircleMarker>
        )}
        {destination && (
          <CircleMarker center={destination} radius={9} pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 1 }}>
            <Tooltip permanent direction="top" offset={[0, -8]}>Destination</Tooltip>
          </CircleMarker>
        )}
        {captain && <Marker position={captain} icon={createLocationIcon("captain")} />}
        {user && <Marker position={user} icon={createLocationIcon("user")} />}
      </MapContainer>
      <MapControls map={map} followLocation={followLocation} onToggleDriving={onToggleDriving} />
    </div>
  );
};

const MapCapture = ({ setMap }) => {
  const map = useMap();
  useEffect(() => setMap(map), [map, setMap]);
  return null;
};

const createLocationIcon = () =>
  divIcon({
    className: "gati-location-marker",
    html: '<span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;font-size:32px;line-height:38px;text-shadow:0 2px 4px rgba(0,0,0,.35)">📍</span>',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

export default RideMap;
