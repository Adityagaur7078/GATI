import React from "react";
const ConfirmedRide = ({
  setConfirmedRidePanel,
  confirmRide,
  selectedVehicle,
  pickup,
  destination,
  rideError,
  rideLoading,
}) => {
  return (
    <div className="relative rounded-t-3xl bg-white px-4 pb-4 pt-8 shadow-[0_-6px_24px_rgba(0,0,0,0.12)]">
      <button
        type="button"
        onClick={() => setConfirmedRidePanel(false)}
        className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-gray-300 transition hover:bg-gray-500"
        aria-label="Close confirmation panel"
      />

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 pt-4">
            Confirm your ride
          </h3>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Ready
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">Selected vehicle</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{selectedVehicle?.name}</p>
          <p className="text-xs text-gray-500">{selectedVehicle?.description}</p>
        </div>

        <img
          className="h-20 w-32 object-contain"
          src={selectedVehicle?.image}
          alt={`${selectedVehicle?.name} vehicle`}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
            <i className="ri-map-pin-2-fill" />
          </span>
          <div>
            <p className="text-sm font-semibold">Pickup location</p>
            <p className="max-w-55 truncate text-xs text-gray-500">{pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
            <i className="ri-map-pin-fill" />
          </span>
          <div>
            <p className="text-sm font-semibold">Destination</p>
            <p className="max-w-55 truncate text-xs text-gray-500">{destination}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <i className="ri-wallet-3-fill text-gray-700" />
            </span>
            <div>
              <p className="text-sm font-semibold">Cash payment</p>
              <p className="text-xs text-gray-500">Pay after the ride</p>
            </div>
          </div>

          <p className="text-lg font-bold text-gray-900">
            {selectedVehicle?.fare ? `₹${selectedVehicle.fare.totalFare.toFixed(2)}` : "-"}
          </p>
        </div>
      </div>

      {rideError && <p className="mt-3 text-sm text-red-600">{rideError}</p>}

      <button
        onClick={confirmRide}
        disabled={rideLoading}
        type="button"
        className="mt-5 w-full rounded-xl bg-green-600 py-3 font-bold text-white shadow-md transition hover:bg-green-700 active:scale-[0.98]"
      >
        {rideLoading ? "Confirming ride..." : "Confirm ride"}
      </button>
    </div>
  );
};

export default ConfirmedRide;