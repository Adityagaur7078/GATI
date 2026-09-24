import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import gatilogoblackcaptain from "../assets/gatilogoblackcaptain.png";
import gatimap from "../assets/gatimap.gif";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import AcceptedRidePanel from "../components/AcceptedRidePanel";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketDataContext } from "../context/SocketContext";
import RideMap from "../components/RideMap";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);
  const { socketId, sendMessage, receiveMessage } = useContext(SocketDataContext);
  const [ride, setRide] = useState(null);
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [acceptedRidePanel, setAcceptedRidePanel] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isDriving, setIsDriving] = useState(false);

  const ridePopUpRef = useRef(null);
  const confirmRidePopUpRef = useRef(null);

  useEffect(() => {
    if (!captain?._id || !socketId || !navigator.geolocation) {
      return;
    }

    const publishLocation = ({ coords }) => {
      const location = { lat: coords.latitude, lng: coords.longitude };
      sendMessage("update-location-captain", {
        userId: captain._id,
        location,
      });
      setCaptainLocation(location);
    };

    if (isDriving) {
      const watchId = navigator.geolocation.watchPosition(publishLocation, undefined, {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(publishLocation, undefined, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      });
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 10000);

    return () => clearInterval(intervalId);
  }, [captain?._id, isDriving, sendMessage, socketId]);

  useEffect(() => {
    if (!socketId) return undefined;
    return receiveMessage("user-location", setUserLocation);
  }, [receiveMessage, socketId]);

  useEffect(() => {
    if (!socketId) return undefined;

    return receiveMessage("new-ride", (data) => {
      setRide(data);
      setRidePopUpPanel(true);
    });
  }, [receiveMessage, socketId]);

  const confirmRide = async (otp) => {
    const token = localStorage.getItem("captainToken");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rideId: ride?._id, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unable to confirm ride");
    }

    const rideData = await response.json();
    setRide(null);
    setAcceptedRidePanel(false);
    setConfirmRidePopUpPanel(false);
    setRidePopUpPanel(false);
    return rideData;
  };

  const acceptRide = async () => {
    const token = localStorage.getItem("captainToken");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rideId: ride?._id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unable to accept ride");
    }

    const acceptedRide = await response.json();
    setRide(acceptedRide);
    setUserLocation(null);
    setAcceptedRidePanel(true);
    return acceptedRide;
  };

  const toggleDriving = () => setIsDriving((driving) => !driving);

  const ignoreRide = () => {
    setRide(null);
    setUserLocation(null);
    setIsDriving(false);
    setAcceptedRidePanel(false);
  };

  const cancelAcceptedRide = () => {
    ignoreRide();
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(false);
  };

  const openOtpPanel = () => {
    setAcceptedRidePanel(false);
    setConfirmRidePopUpPanel(true);
  };

  useGSAP(() => {
    gsap.to(ridePopUpRef.current, {
      y: ridePopUpPanel ? "0%" : "100%",
      duration: 0.35,
      ease: "power2.out",
    });

    gsap.to(confirmRidePopUpRef.current, {
      y: confirmRidePopUpPanel ? "0%" : "100%",
      duration: 0.35,
      ease: "power2.out",
    });

  }, [ridePopUpPanel, confirmRidePopUpPanel]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {!confirmRidePopUpPanel && (
        <>
          <div className={`relative min-h-0 w-full ${acceptedRidePanel ? "flex-1" : "h-3/5"}`}>
            {ride ? (
              <RideMap
                pickupLocation={ride.pickupLocation}
                destinationLocation={ride.destinationLocation}
                captainLocation={captainLocation}
                userLocation={userLocation}
                routeTarget={userLocation || ride.pickupLocation}
                followLocation={isDriving}
                onToggleDriving={toggleDriving}
              />
            ) : (
              <img src={gatimap} alt="Map" className="h-full w-full object-cover" />
            )}

            <div className="absolute left-0 right-0 top-0 z-1100 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
              <img src={gatilogoblackcaptain} alt="Gati Captain" className="h-8 w-auto" />

              <Link
                to="/captain/logout"
                aria-label="Logout"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-gray-800 shadow-md"
              >
                <i className="ri-logout-box-r-line" />
              </Link>
            </div>
          </div>

          {!acceptedRidePanel && (
            <div className="h-2/5 rounded-t-4xl bg-white px-5 pb-6 pt-6 shadow-[0_-8px_28px_rgba(0,0,0,0.16)]">
              <CaptainDetails />
            </div>
          )}
        </>
      )}

      <div
        ref={ridePopUpRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full"
      >
        <RidePopUp
          ride={ride}
          onAccept={acceptRide}
          onIgnore={ignoreRide}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {acceptedRidePanel && (
        <div className="relative z-20 shrink-0">
          <AcceptedRidePanel
            ride={ride}
            onCancel={cancelAcceptedRide}
            onEnterOtp={openOtpPanel}
          />
        </div>
      )}

      <div
        ref={confirmRidePopUpRef}
        className="fixed inset-0 z-2000 min-h-screen translate-y-full overflow-y-auto bg-white"
      >
        <ConfirmRidePopUp
          ride={ride}
          confirmRide={confirmRide}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;