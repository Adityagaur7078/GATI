import React from "react";

const RidePopUp = ({ setRidePopUpPanel, setConfirmRidePopUpPanel }) => {
    
  const userName = "Harshi Pateliya";

  return (
    <div className="rounded-t-2xl bg-white px-3 pb-4 pt-4 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        New Ride Available!
      </h2>

      <div className="mb-4 flex items-center justify-between rounded-lg bg-yellow-300 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-300">
            <i className="ri-user-fill text-gray-700" />
          </div>

          <span className="text-sm font-semibold">{userName}</span>
        </div>

        <span className="text-sm font-bold">2.2 KM</span>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex gap-3">
          <i className="ri-map-pin-2-fill text-gray-900" />
          <div>
            <p className="font-semibold">562/11-A</p>
            <p className="text-xs text-gray-500">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        <div className="flex gap-3">
          <i className="ri-map-pin-fill text-gray-900" />
          <div>
            <p className="font-semibold">562/11-A</p>
            <p className="text-xs text-gray-500">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t pt-3">
          <i className="ri-wallet-3-fill text-gray-900" />
          <div>
            <p className="font-semibold">₹193.20</p>
            <p className="text-xs text-gray-500">Cash Cash</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md bg-green-500 py-2 text-sm font-bold text-white hover:bg-green-600"
        onClick={() => {
          setRidePopUpPanel(false);
          setConfirmRidePopUpPanel(true);
        }}
      >
        Accept
      </button>

      <button
        type="button"
        className="mt-2 w-full rounded-md bg-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        onClick={() => setRidePopUpPanel(false)}
      >
        Ignore
      </button>
    </div>
  );
};

export default RidePopUp;