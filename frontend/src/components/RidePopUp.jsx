import React from "react";
import { useNavigate } from "react-router-dom";
import gatilogoblackcaptain from "../assets/gatilogoblackcaptain.png";

const RidePopUp = ({ ride, setRidePopUpPanel, setConfirmRidePopUpPanel, onAccept, onIgnore }) => {
  const navigate = useNavigate();

  if (!ride) return null;

  const userName = `${ride.user?.fullName?.firstName || "Passenger"} ${ride.user?.fullName?.lastName || ""}`.trim();

  return (
    <div className="rounded-t-2xl bg-white px-3 pb-4 pt-3 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
        <img
          src={gatilogoblackcaptain}
          alt="Gati Captain"
          className="h-8 w-auto"
        />
        <button
          type="button"
          onClick={() => navigate("/captain/logout")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-700 hover:bg-gray-100"
          aria-label="Logout"
        >
          <i className="ri-logout-box-r-line" />
        </button>
      </div>

      <h2 className="mb-3 text-lg font-bold text-gray-900">
        New Ride Available!
      </h2>

      <div className="mb-4 flex items-center justify-between rounded-lg bg-yellow-300 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-300">
            <i className="ri-user-fill text-gray-700" />
          </div>

          <span className="text-sm font-semibold">{userName}</span>
        </div>

        <span className="text-sm font-bold">{ride.distance ? `${ride.distance} KM` : "New"}</span>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex gap-3">
          <i className="ri-map-pin-2-fill text-gray-900" />
          <div>
            <p className="font-semibold">Pickup</p>
            <p className="text-xs text-gray-500">{ride.pickup}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <i className="ri-map-pin-fill text-gray-900" />
          <div>
            <p className="font-semibold">Destination</p>
            <p className="text-xs text-gray-500">{ride.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t pt-3">
          <i className="ri-wallet-3-fill text-gray-900" />
          <div>
            <p className="font-semibold">₹{ride.fare?.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md bg-green-500 py-2 text-sm font-bold text-white hover:bg-green-600"
        onClick={async () => {
          await onAccept?.();
          setRidePopUpPanel(false);
          setConfirmRidePopUpPanel(false);
        }}
      >
        Accept
      </button>

      <button
        type="button"
        className="mt-2 w-full rounded-md bg-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        onClick={() => {
          onIgnore?.();
          setRidePopUpPanel(false);
          setConfirmRidePopUpPanel(false);
          navigate("/captain-home");
        }}
      >
        Ignore
      </button>
    </div>
  );
};

export default RidePopUp;