import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gatilogoblack from "../assets/gatilogoblack.png";
import FinishRidingPopUp from "../components/FinishRidingPopUp";
import RideMap from "../components/RideMap";
import { SocketDataContext } from "../context/SocketContext";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { socketId, sendMessage, receiveMessage } = useContext(SocketDataContext);
  const ride = state?.ride;
  const [captainLocation, setCaptainLocation] = useState(ride?.captain?.location || null);
  const [userLocation, setUserLocation] = useState(null);

  const [finishRidingPopUpPanel, setFinishRidingPopUpPanel] = useState(
    Boolean(state?.openFinishRide)
  );
  const [finishPanelExpanded, setFinishPanelExpanded] = useState(true);

  useEffect(() => {
    if (!socketId) return undefined;
    return receiveMessage("user-location", setUserLocation);
  }, [receiveMessage, socketId]);

  useEffect(() => {
    if (!ride?.captain?._id || !socketId || !navigator.geolocation) return undefined;

    const sendLocation = () => navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location = { lat: coords.latitude, lng: coords.longitude };
      setCaptainLocation(location);
      sendMessage("update-location-captain", { userId: ride.captain._id, location });
    });

    sendLocation();
    const intervalId = setInterval(sendLocation, 5000);
    return () => clearInterval(intervalId);
  }, [ride?.captain?._id, sendMessage, socketId]);

  const logout = () => {
    navigate("/captain-home");
  };

  const finishRide = async () => {
    const token = localStorage.getItem("captainToken");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rideId: ride?._id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unable to finish ride");
    }
  };

  return (
    <main className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-5">
            <img src={gatilogoblack} alt="Gati" className="h-9 w-auto" />

            <button
              type="button"
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
              aria-label="Logout"
            >
              <i className="ri-logout-box-r-line text-2xl" />
            </button>
          </header>

          <section className="relative min-h-0 flex-1 overflow-hidden transition-[height] duration-300">
            <RideMap
              pickupLocation={ride?.pickupLocation}
              destinationLocation={ride?.destinationLocation}
              captainLocation={captainLocation}
              userLocation={userLocation}
            />
          </section>

          {!finishRidingPopUpPanel && (
            <button
              type="button"
              onClick={() => {
                setFinishPanelExpanded(true);
                setFinishRidingPopUpPanel(true);
              }}
              className="absolute bottom-5 right-5 z-10 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700"
            >
              Complete Ride
            </button>
          )}

      {finishRidingPopUpPanel && (
        <div className="relative z-20 shrink-0">
          <FinishRidingPopUp
            finishRide={finishRide}
            setFinishRidingPopUpPanel={setFinishRidingPopUpPanel}
            expanded={finishPanelExpanded}
            setExpanded={setFinishPanelExpanded}
          />
        </div>
      )}
    </main>
  );
};

export default CaptainRiding;