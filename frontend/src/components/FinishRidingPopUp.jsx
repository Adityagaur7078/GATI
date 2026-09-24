import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinishRidingPopUp = ({ finishRide: finishRideRequest, setFinishRidingPopUpPanel, expanded: expandedProp, setExpanded }) => {
  const navigate = useNavigate();
  const [localExpanded, setLocalExpanded] = useState(true);
  const expanded = expandedProp ?? localExpanded;

  const toggleExpanded = () => {
    const nextExpanded = !expanded;
    setLocalExpanded(nextExpanded);
    setExpanded?.(nextExpanded);
  };

  const finishRide = async () => {
    try {
      await finishRideRequest();
      setFinishRidingPopUpPanel(false);
      navigate("/captain-home");
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <section className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white px-4 pb-5 pt-2 shadow-2xl">
      <button
        type="button"
        onClick={toggleExpanded}
        className="mb-3 flex h-7 w-full items-center justify-center"
        aria-label={expanded ? "Collapse finish ride panel" : "Expand finish ride panel"}
      >
        <span className="h-1.5 w-14 rounded-full bg-gray-300" />
      </button>

      {expanded && <>
        <h1 className="mb-5 text-xl font-bold text-gray-900">
          Finish this Ride
        </h1>

      <div className="mb-6 flex items-center justify-between rounded-lg bg-yellow-300 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-300">
            <i className="ri-user-fill text-gray-700" />
          </div>

          <p className="text-sm font-bold text-gray-900">Harshi Pateliya</p>
        </div>

        <p className="text-sm font-bold text-gray-900">2.2 KM</p>
      </div>

      <div className="space-y-5 px-2">
        <div className="flex gap-4">
          <i className="ri-map-pin-2-fill text-gray-800" />
          <div>
            <p className="font-semibold text-gray-900">562/11-A</p>
            <p className="text-xs text-gray-500">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        <div className="flex gap-4">
          <i className="ri-map-pin-fill text-gray-800" />
          <div>
            <p className="font-semibold text-gray-900">562/11-A</p>
            <p className="text-xs text-gray-500">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        <div className="flex gap-4">
          <i className="ri-wallet-3-fill text-gray-800" />
          <div>
            <p className="font-semibold text-gray-900">₹193.20</p>
            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>

        <button
          type="button"
          onClick={finishRide}
          className="mt-8 w-full rounded-lg bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600"
        >
          Finish Ride
        </button>
      </>}
    </section>
  );
};

export default FinishRidingPopUp;