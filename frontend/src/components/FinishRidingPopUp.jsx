import React from "react";
import { useNavigate } from "react-router-dom";

const FinishRidingPopUp = ({ setFinishRidingPopUpPanel }) => {
  const navigate = useNavigate();

  const finishRide = () => {
    setFinishRidingPopUpPanel(false);
    navigate("/captain-home");
  };

  return (
    <section className="max-h-[78vh] overflow-y-auto rounded-t-2xl bg-white px-4 py-5 shadow-2xl">
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
    </section>
  );
};

export default FinishRidingPopUp;