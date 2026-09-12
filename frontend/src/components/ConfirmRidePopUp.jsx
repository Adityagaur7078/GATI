import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import gatilogoblack from "../assets/gatilogoblack.png";

const ConfirmRidePopUp = ({
  setConfirmRidePopUpPanel,
  setRidePopUpPanel,
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const closePanels = () => {
    setConfirmRidePopUpPanel(false);
    setRidePopUpPanel(false);
  };

  const confirmRide = () => {
    if (otp.length !== 4) return;

    closePanels();

    navigate("/captain/riding", {
      state: { openFinishRide: true },
    });
  };

  return (
    <section className="relative z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-8 pt-5 shadow-none">
      <div className="mb-5 flex items-center justify-between">
        <img
          src={gatilogoblack}
          alt="Gati"
          className="h-9 w-auto"
        />

        <button
          type="button"
          onClick={() => navigate("/captain-home")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          aria-label="Logout"
        >
          <i className="ri-logout-box-r-line text-2xl" />
        </button>
      </div>

      <h1 className="mb-5 text-xl font-bold text-gray-900">
        Confirm this ride to start
      </h1>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center justify-between bg-yellow-300 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-300">
              <i className="ri-user-fill text-xl text-gray-700" />
            </div>

            <div>
              <p className="font-bold text-gray-900">Harshi Pateliya</p>
              <p className="text-xs text-gray-700">Passenger</p>
            </div>
          </div>

          <p className="font-bold text-gray-900">2.2 KM</p>
        </div>

        <div className="space-y-6 p-5">
          <div className="flex gap-4">
            <i className="ri-map-pin-2-fill text-xl text-gray-800" />
            <div>
              <p className="text-xs text-gray-500">Pickup location</p>
              <p className="font-semibold text-gray-900">562/11-A</p>
              <p className="text-sm text-gray-500">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <i className="ri-map-pin-fill text-xl text-gray-800" />
            <div>
              <p className="text-xs text-gray-500">Drop location</p>
              <p className="font-semibold text-gray-900">562/11-A</p>
              <p className="text-sm text-gray-500">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-t pt-6">
            <i className="ri-wallet-3-fill text-xl text-gray-800" />
            <div>
              <p className="text-xs text-gray-500">Payment method</p>
              <p className="font-semibold text-gray-900">₹193.20</p>
              <p className="text-sm text-gray-500">Cash payment</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <label
              htmlFor="ride-otp"
              className="mb-2 block text-sm font-bold text-gray-900"
            >
              Enter passenger OTP
            </label>

            <input
              id="ride-otp"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 4-digit OTP"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 pb-2">
        <button
          type="button"
          onClick={confirmRide}
          disabled={otp.length !== 4}
          className="w-full rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm ride
        </button>

        <button
          type="button"
          onClick={closePanels}
          className="w-full rounded-xl border border-red-500 py-3.5 text-sm font-bold text-red-500"
        >
          Cancel ride
        </button>
      </div>
    </section>
  );
};

export default ConfirmRidePopUp;