import React from "react";
import gaticarimage from "../assets/gaticarimage.png";
import gatibike from "../assets/gatibike.png";
import gatiautoimage from "../assets/GatiAutoImage.png";

const VehiclePanel = ({
  setVehiclePanelOpen,
  setConfirmedRidePanel,
  setSelectedVehicle,
  fares,
}) => {
  const vehicles = [
    {
      name: "GatiGo",
      type: "car",
      image: gaticarimage,
      seats: 4,
      description: "Affordable, compact rides",
    },
    {
      name: "Moto",
      type: "moto",
      image: gatibike,
      seats: 1,
      description: "Affordable motorcycle rides",
    },
    {
      name: "GatiAuto",
      type: "auto",
      image: gatiautoimage,
      seats: 3,
      description: "Affordable auto rides",
    },
  ];

  const selectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehiclePanelOpen(false);
    setConfirmedRidePanel(true);
  };

  return (
    <div className="relative rounded-t-3xl bg-white px-1 pb-2 pt-8">
      <button
        type="button"
        onClick={() => setVehiclePanelOpen(false)}
        className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-gray-300 transition hover:bg-gray-500"
        aria-label="Close vehicle panel"
      />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 pt-4">
            Select a vehicle
          </h3>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          3 options
        </span>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          (() => {
            const fare = fares[vehicle.type];

            return (
          <button
            type="button"
            key={vehicle.name}
            onClick={() => selectVehicle({ ...vehicle, fare })}
            className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-green-500 active:scale-[0.98]"
          >
            <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-gray-50">
              <img
                className="h-12 w-16 object-contain"
                src={vehicle.image}
                alt={vehicle.name}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                {vehicle.name}
                <span className="text-xs font-normal text-gray-500">
                  <i className="ri-user-line" /> {vehicle.seats}
                </span>
              </h4>
              <p className="text-sm text-gray-500">
                {fare ? fare.duration : "Fare unavailable"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {vehicle.description}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-gray-900">
                {fare ? `₹${fare.totalFare.toFixed(2)}` : "-"}
              </p>
              <i className="ri-arrow-right-s-line text-xl text-gray-400" />
            </div>
          </button>
            );
          })()
        ))}
      </div>
    </div>
  );
};

export default VehiclePanel;