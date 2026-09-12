import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import gatilogoblack from "../assets/gatilogoblack.png";
import gatimap from "../assets/gatimap.gif";
import FinishRidingPopUp from "../components/FinishRidingPopUp";

const CaptainRiding = () => {
  const navigate = useNavigate();

  const [finishRidingPopUpPanel, setFinishRidingPopUpPanel] = useState(
    Boolean(location.state?.openFinishRide)
  );

  const logout = () => {
    navigate("/captain-home");
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
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

      <section className="relative h-[calc(80vh-4rem)] min-h-105 overflow-hidden">
        <img
          src={gatimap}
          alt="Ride map"
          className="h-full w-full object-cover"
        />
      </section>

      <section className="flex h-[20vh] min-h-35 items-center justify-between gap-4 bg-yellow-300 px-5">
        <div>
          <p className="text-xl font-bold text-gray-900">4 KM away</p>
          <p className="text-sm text-gray-700">Passenger is waiting</p>
        </div>

        <button
          type="button"
          onClick={() => setFinishRidingPopUpPanel(true)}
          className="rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-white hover:bg-green-600"
        >
          Complete Ride
        </button>
      </section>

      <div
        className={`fixed inset-0 z-20 flex items-end bg-black/25 transition-opacity duration-300 ${
          finishRidingPopUpPanel
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div
          className={`w-full transform transition-transform duration-300 ${
            finishRidingPopUpPanel ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <FinishRidingPopUp
            setFinishRidingPopUpPanel={setFinishRidingPopUpPanel}
          />
        </div>
      </div>
    </main>
  );
};

export default CaptainRiding;