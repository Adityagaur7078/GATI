import React, { useRef, useState } from "react";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const [vehicleFoundPanel, setVehicleFoundPanel] = useState(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmedRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
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
    if (vehiclePanelOpen){
      gsap.to(vehiclePanelRef.current,{
      transform:'translateY(0)'
    })
    } else{
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  }, [vehiclePanelOpen])

  useGSAP(() => {
    if (confirmedRidePanel){
      gsap.to(confirmedRidePanelRef.current,{
      transform:'translateY(0)'
    })
    } else{
      gsap.to(confirmedRidePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  }, [confirmedRidePanel])

  useGSAP(() => {
    if (vehicleFoundPanel){
      gsap.to(vehicleFoundRef.current,{
      transform:'translateY(0)'
    })
    } else{
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(100%)'
      })
    }
  }, [vehicleFoundPanel])

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriverPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, [waitingForDriverPanel])

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
                onClick={() => setPanelOpen(true)}
                ref={panelRef}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full border border-gray-300"
                type="text"
                placeholder="Add a pick-up location"
              />

              <input
                onClick={() => setPanelOpen(true)}
                ref={panelRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 border border-gray-300"
                type="text"
                placeholder="Enter your destination"
              />

            </div>
          </form>
        </div>

        <div
          ref={panelRef}
          className="bg-white h-0 overflow-hidden"
        >
          <LocationSearchPanel setVehiclePanelOpen={setVehiclePanelOpen} setPanelOpen={setPanelOpen} />
        </div>

        <div
          ref={vehiclePanelRef}
          className="fixed bottom-0 z-10 w-full translate-y-full bg-transparent"
        >
          <VehiclePanel
            setConfirmedRidePanel={setConfirmedRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>

        <div
          ref={confirmedRidePanelRef}
          className="fixed bottom-0 z-10 w-full translate-y-full bg-transparent"
        >
          <ConfirmedRide setConfirmedRidePanel={setConfirmedRidePanel} setVehicleFoundPanel={setVehicleFoundPanel} />
        </div>

        <div
          ref={waitingForDriverRef}
          className="fixed bottom-0 z-20 w-full translate-y-full bg-transparent"
        >
          <WaitingForDriver
            setWaitingForDriverPanel={setWaitingForDriverPanel}
          />
        </div>

        <div
          ref={vehicleFoundRef}
          className="fixed bottom-0 z-10 w-full translate-y-full bg-transparent"
        >
          <LookingForDriver
            setVehicleFoundPanel={setVehicleFoundPanel}
          />
        </div>

      </div>
    </div >
  );
};

export default Home;