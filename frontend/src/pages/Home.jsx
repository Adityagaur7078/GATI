import React, { useRef, useState } from "react";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import gaticarimage from "../assets/gaticarimage.png";
import gatibike from "../assets/gatibike.png";
import gatiautoimage from "../assets/gatiautoimage.png";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    () => {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: "0px 24px 24px 24px",
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
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full border border-gray-300"
                type="text"
                placeholder="Add a pick-up location"
              />

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

        <div
          ref={panelRef}
          className="bg-white h-0 overflow-hidden"
        >
          <LocationSearchPanel setVehiclePanelOpen={setVehiclePanelOpen} setPanelOpen={setPanelOpen} />
        </div>

        <div ref={vehiclePanelRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 translate-y-full">
          <h3 className="mb-5 text-2xl font-semibold">Choose a Vehicle</h3>

          <div onClick={() => {
            setVehiclePanelOpen(false)
          }} className="flex w-full items-center justify-between rounded-xl border-2 mb-2 active:border-black border-gray-300 p-3">
            <img
              className="h-12 object-contain"
              src={gaticarimage}
              alt="GATI vehicle"
            />

            <div className="w-1/2 ml-2">
              <h4 className="flex items-center gap-2 text-base font-medium">
                GatiGo
                <span className="flex items-center gap-1">
                  <i className="ri-user-line"></i>
                  4
                </span>
              </h4>

              <h5 className="text-sm font-medium">2 mins away</h5>

              <p className="text-xs font-normal text-gray-600">
                Affordable, compact rides
              </p>
            </div>

            <h2 className="text-lg font-semibold">₹195.20</h2>
          </div>

          <div onClick={() => {
            setVehiclePanelOpen(false)
          }} className="flex w-full items-center justify-between rounded-xl border-2 mb-2 active:border-black border-gray-300 p-3">
            <img
              className="h-12 object-contain"
              src={gatibike}
              alt="GATI vehicle"
            />

            <div className="w-1/2">
              <h4 className="flex items-center gap-2 text-base font-medium">
                Moto
                <span className="flex items-center gap-1">
                  <i className="ri-user-line"></i>
                  1
                </span>
              </h4>

              <h5 className="text-sm font-medium">3 mins away</h5>

              <p className="text-xs font-normal text-gray-600">
                Affordable motorcycle rides
              </p>
            </div>

            <h2 className="text-lg font-semibold">₹65</h2>
          </div>

          <div onClick={() => {
            setVehiclePanelOpen(false)
          }} className="flex w-full items-center justify-between rounded-xl border-2 mb-2 active:border-black border-gray-300 p-3">
            <img
              className="h-12 object-contain"
              src={gatiautoimage}
              alt="GATI vehicle"
            />

            <div className="w-1/2 ml-5">
              <h4 className="flex items-center gap-2 text-base font-medium">
                GatiAuto
                <span className="flex items-center gap-1">
                  <i className="ri-user-line"></i>
                  3
                </span>
              </h4>

              <h5 className="text-sm font-medium">2 mins away</h5>

              <p className="text-xs font-normal text-gray-600">
                Affordable auto rides
              </p>
            </div>

            <h2 className="text-lg font-semibold">₹118.21</h2>
          </div>

        </div>


      </div>
    </div >
  );
};

export default Home;