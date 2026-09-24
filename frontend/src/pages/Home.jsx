import React, { useContext, useEffect, useRef, useState } from "react";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
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

    if (!input || input.trim().length < 3) {
      return;
    }

    const controller = new AbortController();
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
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeField, destination, navigate, pickup]);

  const selectSuggestion = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
    }

    setSuggestions([]);
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

  useGSAP(
    () => {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: "0px 24px 24px 24px",
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.4,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: "0px",
          duration: 0.3,
          ease: "power2.inOut",
        });

        gsap.to(panelCloseRef.current, {
          opacity: 0,
          duration: 0.2,
        });
      }
    },
    { dependencies: [panelOpen] }
  );

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
    <div className="h-screen relative overflow-hidden">

      <img
        className="w-16 absolute left-5 top-5 z-10"
        src={gatilogoblack}
        alt="Gati"
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src={gatimap}
          alt="Map"
        />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">

        <div
          className={`h-[30%] px-6 pb-0.5 bg-white relative transition-all duration-300 ${panelOpen ? "pt-16" : "pt-6"
            }`}
        >

          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="opacity-0 absolute right-5 top-20 text-2xl cursor-pointer"
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
                  setDestination(e.target.value);
                }}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 border border-gray-300"
                type="text"
                placeholder="Enter your destination"
              />

            </div>

            {pickup.trim() && destination.trim() && (
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
          className="bg-white h-0 overflow-hidden"
        >
          <LocationSearchPanel
            suggestions={suggestions}
            onSelectSuggestion={selectSuggestion}
          />
        </div>

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

        <div
          ref={waitingForDriverRef}
          className="fixed bottom-0 z-20 w-full bg-transparent"
        >
          <WaitingForDriver
            setWaitingForDriverPanel={setWaitingForDriverPanel}
          />
        </div>

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

      </div>
    </div >
  );
};

export default Home;