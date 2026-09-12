import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  const ridePopUpRef = useRef(null);
  const confirmRidePopUpRef = useRef(null);

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
      <div className="relative h-3/5 w-full">
        <img src={gatimap} alt="Map" className="h-full w-full object-cover" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <img src={gatilogoblack} alt="Gati" className="h-9 w-auto" />

          <Link
            to="/captain/logout"
            aria-label="Logout"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-gray-800 shadow-md"
          >
            <i className="ri-logout-box-r-line" />
          </Link>
        </div>
      </div>

      <div className="h-2/5 rounded-t-4xl bg-white px-5 pb-6 pt-6 shadow-[0_-8px_28px_rgba(0,0,0,0.16)]">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopUpRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full"
      >
        <RidePopUp
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      <div
        ref={confirmRidePopUpRef}
        className="fixed inset-0 z-20 translate-y-full overflow-y-auto bg-white"
      >
        <ConfirmRidePopUp
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;