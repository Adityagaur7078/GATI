import React, { useRef, useState } from "react";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    () => {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: "24px",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.2,
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

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Logo */}
      <img
        className="w-16 absolute left-5 top-5 z-10"
        src={gatilogoblack}
        alt="Gati"
      />

      {/* Map */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src={gatimap}
          alt="Map"
        />
      </div>

      {/* Bottom container */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        {/* Search section */}
        <div
  className={`h-[30%] px-6 pb-6 bg-white relative transition-all duration-300 ${
    panelOpen ? "pt-16" : "pt-6"
  }`}
>
  {/* Close button */}
  <h5
    ref={panelCloseRef}
    onClick={() => setPanelOpen(false)}
    className="opacity-0 absolute right-5 top-16 text-2xl cursor-pointer"
  >
    <i className="ri-arrow-down-s-line"></i>
  </h5>

  <h4 className="text-2xl font-semibold">
    Find a trip
  </h4>

  <form onSubmit={submitHandler}>
    {/* Inputs container */}
    <div className="relative mt-5">

      {/* Vertical line */}
      <div className="absolute left-4 top-3.5 bottom-3.5 w-0.75 bg-gray-800 rounded-full z-10">
        
        {/* Top dot */}
        <div className="absolute w-1.75 h-1.75 bg-gray-800 rounded-full -left-0.5 -top-px"></div>

        {/* Bottom dot */}
        <div className="absolute w-1.75 h-1.75 bg-gray-800 rounded-full -left-0.5 -bottom-px"></div>

      </div>

      {/* Pickup */}
      <input
        onClick={() => setPanelOpen(true)}
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full border border-gray-300"
        type="text"
        placeholder="Add a pick-up location"
      />

      {/* Destination */}
      <input
        onClick={() => setPanelOpen(true)}
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 border border-gray-300"
        type="text"
        placeholder="Enter your destination"
      />

    </div>
  </form>
</div>


        {/* Location search panel */}
        <div
          ref={panelRef}
          className="bg-white h-0 overflow-hidden"
        >
          <LocationSearchPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;