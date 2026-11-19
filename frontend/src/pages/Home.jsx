import React, { useContext, useEffect, useRef, useState } from "react";
import gatilogoblack from "../assets/gatilogoblack.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";
import axios from "axios";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import RideMap from "../components/RideMap";

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const [vehicleFoundPanel, setVehicleFoundPanel] = useState(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [pickupSelected, setPickupSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [fares, setFares] = useState({});
  const [fareLoading, setFareLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rideLoading, setRideLoading] = useState(false);
  const [rideError, setRideError] = useState("");
  const [ride, setRide] = useState(null);
  const { socketId, sendMessage, receiveMessage } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmedRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  useEffect(() => {
    if (!socketId) return undefined;

    return receiveMessage("ride-confirmed", (ride) => {
      setVehicleFoundPanel(false);
      setWaitingForDriverPanel(true);
      navigate("/riding", { state: { ride } });
    });
  }, [navigate, receiveMessage, socketId]);

  useEffect(() => {
    if (!navigator.geolocation) return undefined;

    const updateLocation = ({ coords }) => {
      setCurrentUserLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    };

    navigator.geolocation.getCurrentPosition(updateLocation, undefined, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    });

    const watchId = navigator.geolocation.watchPosition(updateLocation, undefined, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!ride?._id || !user?._id || !socketId || !navigator.geolocation) return undefined;

    const sendLocation = () => navigator.geolocation.getCurrentPosition(({ coords }) => {
      sendMessage("update-location-user", {
        userId: user._id,
        location: { lat: coords.latitude, lng: coords.longitude },
      });
    });

    sendLocation();
    const intervalId = setInterval(sendLocation, 5000);
    return () => clearInterval(intervalId);
  }, [ride?._id, sendMessage, socketId, user?._id]);

  useEffect(() => {
    const input = activeField === "pickup" ? pickup : destination;
    const locationSelected = activeField === "pickup" ? pickupSelected : destinationSelected;

    if (locationSelected || !input || input.trim().length < 3) {
      setSuggestionsLoading(false);
      return;
    }

    const controller = new AbortController();
    setSuggestionsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: input.trim() },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setSuggestions([]);

          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
          }
        }
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeField, destination, destinationSelected, navigate, pickup, pickupSelected]);

  const selectSuggestion = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
      setPickupLocation({ lat: suggestion.lat, lng: suggestion.lng });
      setPickupSelected(true);
      if (destinationSelected) {
        setPanelOpen(false);
      }
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
      setDestinationLocation({ lat: suggestion.lat, lng: suggestion.lng });
      setDestinationSelected(true);
      if (pickupSelected) {
        setPanelOpen(false);
      }
    }

    setSuggestions([]);
    setSuggestionsLoading(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const openSearchPanel = (field) => {
    setActiveField(field);
    setPanelOpen(true);
    setVehiclePanelOpen(false);
    setSuggestions([]);
  };

  const chooseVehicle = async () => {
    if (!pickup.trim() || !destination.trim()) {
      return;
    }

    try {
      setFareLoading(true);
      const token = localStorage.getItem("token");
      const vehicleTypes = ["car", "moto", "auto"];
      const responses = await Promise.all(
        vehicleTypes.map((vehicleType) =>
          axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: {
              pickup: pickup.trim(),
              destination: destination.trim(),
              vehicleType,
            },
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setFares(
        Object.fromEntries(
          vehicleTypes.map((vehicleType, index) => [
            vehicleType,
            responses[index].data,
          ])
        )
      );
      setPanelOpen(false);
      setVehiclePanelOpen(true);
    } catch (error) {
      console.error("Unable to fetch ride fares:", error);
    } finally {
      setFareLoading(false);
    }
  };

  const confirmRide = async () => {
    if (!selectedVehicle || !pickup.trim() || !destination.trim()) {
      return;
    }

    try {
      setRideLoading(true);
      setRideError("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickup.trim(),
          destination: destination.trim(),
          vehicleType: selectedVehicle.type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRide(response.data);
      setConfirmedRidePanel(false);
      setVehicleFoundPanel(true);
    } catch (error) {
      setRideError(error.response?.data?.message || "Unable to confirm ride");
    } finally {
      setRideLoading(false);
    }
  };


  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      yPercent: vehiclePanelOpen ? 0 : 100,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(confirmedRidePanelRef.current, {
      yPercent: confirmedRidePanel ? 0 : 100,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [confirmedRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      yPercent: vehicleFoundPanel ? 0 : 100,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [vehicleFoundPanel]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      yPercent: waitingForDriverPanel ? 0 : 100,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [waitingForDriverPanel]);

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-slate-100">

      <img
        className="absolute left-5 top-5 z-[1200] w-16"
        src={gatilogoblack}
        alt="Gati"
      />

      <div className={`absolute inset-x-0 top-0 w-full transition-[height] duration-500 ease-in-out ${panelOpen ? "h-[0dvh]" : "h-[70dvh]"}`}>
        <RideMap
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          userLocation={currentUserLocation}
          routeTarget={destinationLocation}
        />
      </div>

      <div
        className={`absolute inset-x-0 z-[1100] flex flex-col transition-[height,top,bottom] duration-500 ease-in-out ${panelOpen ? "inset-y-0 h-[100dvh] justify-start" : "bottom-0 h-[30dvh] min-h-[220px] max-h-[320px] justify-end"}`}
      >

        <div
          className={`relative shrink-0 bg-white px-6 ${panelOpen ? "pt-20 pb-4" : "pt-6 pb-[70px]"
            }`}
        >

          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className={`absolute right-5 top-3 text-2xl cursor-pointer transition-opacity ${panelOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <i className="ri-arrow-down-s-line"></i>
          </h5>

          <h4 className="text-2xl font-semibold pt-4">
            Find a trip
          </h4>

          <form onSubmit={submitHandler}>

            <div className="relative mt-5">

              <div className="absolute left-4 top-3.5 bottom-3.5 w-0.75 bg-gray-800 rounded-full z-10">

                <div className="absolute w-1.75 h-1.75 bg-gray-800 rounded-full -left-0.5 -top-px"></div>

                <div className="absolute w-1.75 h-1.75 bg-gray-800 rounded-full -left-0.5 -bottom-px"></div>

              </div>

              <input
                onClick={() => openSearchPanel("pickup")}
                onFocus={() => openSearchPanel("pickup")}
                value={pickup}
                onChange={(e) => {
                  setSuggestions([]);
                  setPickupSelected(false);
                  setPickupLocation(null);
                  setPickup(e.target.value);
                }}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full border border-gray-300"
                type="text"
                placeholder="Add a pick-up location"
              />

              <input
                onClick={() => openSearchPanel("destination")}
                onFocus={() => openSearchPanel("destination")}
                value={destination}
                onChange={(e) => {
                  setSuggestions([]);
                  setDestinationSelected(false);
                  setDestinationLocation(null);
                  setDestination(e.target.value);
                }}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 border border-gray-300"
                type="text"
                placeholder="Enter your destination"
              />

            </div>

            {pickupSelected && destinationSelected && (
              <button
                type="button"
                onClick={chooseVehicle}
                disabled={fareLoading}
                className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-base font-semibold text-white transition active:scale-[0.98]"
              >
                {fareLoading ? "Finding fares..." : "Choose vehicle"}
              </button>
            )}
          </form>
        </div>

        <div
          ref={panelRef}
          className={`min-h-0 overflow-y-auto bg-white px-6 ${panelOpen ? "flex-1 pb-6" : "h-0 overflow-hidden"}`}
        >
          <LocationSearchPanel
            suggestions={suggestions}
            isLoading={suggestionsLoading}
            onSelectSuggestion={selectSuggestion}
          />
        </div>

        {vehiclePanelOpen && (
          <div
            ref={vehiclePanelRef}
            className="fixed bottom-0 z-10 w-full bg-transparent"
          >
            <VehiclePanel
              setConfirmedRidePanel={setConfirmedRidePanel}
              setVehiclePanelOpen={setVehiclePanelOpen}
              fares={fares}
              setSelectedVehicle={setSelectedVehicle}
            />
          </div>
        )}

        {confirmedRidePanel && (
          <div
            ref={confirmedRidePanelRef}
            className="fixed bottom-0 z-10 w-full bg-transparent"
          >
            <ConfirmedRide
              setConfirmedRidePanel={setConfirmedRidePanel}
              confirmRide={confirmRide}
              selectedVehicle={selectedVehicle}
              pickup={pickup}
              destination={destination}
              rideError={rideError}
              rideLoading={rideLoading}
            />
          </div>
        )}

        {waitingForDriverPanel && (
          <div
            ref={waitingForDriverRef}
            className="fixed bottom-0 z-20 w-full bg-transparent"
          >
            <WaitingForDriver
              setWaitingForDriverPanel={setWaitingForDriverPanel}
              ride={ride}
            />
          </div>
        )}

        {vehicleFoundPanel && (
          <div
            ref={vehicleFoundRef}
            className="fixed bottom-0 z-10 w-full bg-transparent"
          >
            <LookingForDriver
              setVehicleFoundPanel={setVehicleFoundPanel}
              selectedVehicle={selectedVehicle}
              pickup={pickup}
              destination={destination}
              fare={selectedVehicle ? fares[selectedVehicle.type] : null}
              ride={ride}
            />
          </div>
        )}

      </div>
    </div >
  );
};

export default Home;