import React from "react";

const AcceptedRidePanel = ({ ride, onCancel, onEnterOtp }) => {
  return (
    <section className="rounded-t-2xl bg-white px-4 pb-5 pt-4 shadow-[0_-8px_25px_rgba(0,0,0,0.2)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Ride accepted
          </p>
          <h2 className="text-lg font-bold text-gray-900">
            Go to passenger pickup
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Passenger</p>
          <p className="text-sm font-bold text-gray-900">
            {ride?.user?.fullName?.firstName || "Passenger"}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
        Follow the route on the map to reach the pickup location.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-red-500 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          Cancel Ride
        </button>
        <button
          type="button"
          onClick={onEnterOtp}
          className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Enter OTP
        </button>
      </div>
    </section>
  );
};

export default AcceptedRidePanel;
