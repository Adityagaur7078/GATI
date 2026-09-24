import React, { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [20.5937, 78.9629];

const toMapPoint = (location) => {
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);

  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
};

const FitMap = ({ points, followLocation }) => {
  const map = useMap();
  const [hasInitialFit, setHasInitialFit] = useState(false);

  useEffect(() => {
    if (hasInitialFit && !followLocation) return;

    const validPoints = points.filter(Boolean);
    if (validPoints.length === 1) {
      map.setView(validPoints[0], 14);
    } else if (validPoints.length > 1) {
      map.fitBounds(validPoints, { padding: [40, 40] });
    }
    setHasInitialFit(true);
  }, [followLocation, hasInitialFit, map, points]);

  useEffect(() => {
    if (followLocation && points[0]) {
      map.setView(points[0], Math.max(map.getZoom(), 15), { animate: true });
    }
  }, [followLocation, map, points]);

  return null;
};

const MapControls = ({ followLocation, onToggleDriving }) => {
  const map = useMap();

  const locateCaptain = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        map.setView([coords.latitude, coords.longitude], 16, { animate: true });
      });
    }
  };

  return (
    <div className="absolute bottom-5 right-4 z-1000 flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
        <button type="button" onClick={() => map.zoomIn()} className="flex h-11 w-11 items-center justify-center border-b text-xl text-slate-800 hover:bg-slate-50" aria-label="Zoom in">
          <i className="ri-add-line" />
        </button>
        <button type="button" onClick={() => map.zoomOut()} className="flex h-11 w-11 items-center justify-center text-xl text-slate-800 hover:bg-slate-50" aria-label="Zoom out">
          <i className="ri-subtract-line" />
        </button>
      </div>
      <button type="button" onClick={locateCaptain} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-slate-800 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50" aria-label="Center on my location">
        <i className="ri-crosshair-2-line" />
      </button>
      {onToggleDriving && (
        <button type="button" onClick={onToggleDriving} className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-lg ring-1 ring-slate-200 ${followLocation ? "bg-emerald-600 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`} aria-label={followLocation ? "Stop driving mode" : "Start driving mode"}>
          <i className="ri-navigation-fill" />
        </button>
      )}
    </div>
  );

  return null;
};

const DrivingRoute = ({ start, end, onRoute }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!start || !end) {
      setRoute([]);
      onRoute([]);
      return undefined;
    }

    const controller = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=false`;

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
  }, [end, onRoute, start]);

  return route.length > 1 ? (
    <Polyline positions={route} pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.85 }} />
  ) : null;
};

const RideMap = ({ pickupLocation, destinationLocation, captainLocation, userLocation, routeTarget, followLocation = false, onToggleDriving, className = "" }) => {
  const pickup = toMapPoint(pickupLocation);
  const destination = toMapPoint(destinationLocation);
  const captain = toMapPoint(captainLocation);
  const user = toMapPoint(userLocation);
  const routeStart = captain || user;
  const routeEnd = toMapPoint(routeTarget) || destination;
  const [route, setRoute] = useState([]);
  const handleRoute = React.useCallback((positions) => setRoute(positions), []);
  const points = [...route, pickup, destination, captain, user];
  const center = captain || user || pickup || destination || DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={13} zoomControl={false} className={`h-full w-full ${className}`}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMap points={[captain || user || center, ...points]} followLocation={followLocation} />
      <DrivingRoute start={routeStart} end={routeEnd} onRoute={handleRoute} />
      {pickup && <CircleMarker center={pickup} radius={9} pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 1 }} />}
      {destination && <CircleMarker center={destination} radius={9} pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 1 }} />}
      {captain && <CircleMarker center={captain} radius={11} pathOptions={{ color: "#111827", fillColor: "#facc15", fillOpacity: 1 }} />}
      {user && <CircleMarker center={user} radius={11} pathOptions={{ color: "#1d4ed8", fillColor: "#60a5fa", fillOpacity: 1 }} />}
      {captain && user && !destination && <Polyline positions={[captain, user]} pathOptions={{ color: "#0f766e", dashArray: "8 8", weight: 4 }} />}
      <MapControls followLocation={followLocation} onToggleDriving={onToggleDriving} />
    </MapContainer>
  );
};

export default RideMap;
