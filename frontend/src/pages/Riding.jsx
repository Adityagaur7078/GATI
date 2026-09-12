import React from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import gatimap from "../assets/gatimap.gif";
import gaticarimage from "../assets/gaticarimage.png";

const Riding = () => {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-slate-100">
      <div className="relative h-1/2 w-full shrink-0">
        <img
          src={gatimap}
          alt="Ride route map"
          className="h-full w-full object-cover"
        />

        <Link
          to="/home"
          className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg"
        >
          <i className="ri-home-5-line text-lg" />
          Home
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-t-4xl bg-white px-5 pb-4 pt-4 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]">
        <div className="mb-3 text-center">
          <p className="text-xs font-semibold text-emerald-600">
            Your ride is in progress
          </p>
          <h1 className="text-xl font-bold text-slate-950">Enjoy your ride</h1>
        </div>

        <div className="mb-3 grid grid-cols-[64px_1fr_48px] items-center gap-3 rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-white p-3 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
            <img
              src={gaticarimage}
              alt="Vehicle"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Your driver
            </p>
            <p className="text-base font-extrabold text-slate-950">Amishah</p>
            <p className="text-xs font-semibold text-slate-700">
              Maruti Suzuki Alto
            </p>
            <p className="mt-1 inline-block rounded-md bg-slate-950 px-2 py-1 text-[10px] font-extrabold tracking-widest text-white">
              MP04 AB 1234
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-200 bg-white shadow-sm">
            <i className="ri-user-fill text-2xl text-emerald-600" />
          </div>
        </div>

        <div className="mb-3 rounded-2xl border border-slate-100 p-3 shadow-sm">
          <div className="relative space-y-3">
            <div className="absolute left-2 top-4 h-8 border-l-2 border-dashed border-slate-300" />

            <div className="relative flex items-start gap-3">
              <div className="z-10 mt-1 h-4 w-4 rounded-full border-4 border-emerald-100 bg-emerald-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Pickup
                </p>
                <p className="text-xs font-bold text-slate-900">
                  562/11-A, Kankariya Talab
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="z-10 mt-1 h-4 w-4 rounded-full border-4 border-red-100 bg-red-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Destination
                </p>
                <p className="text-xs font-bold text-slate-900">
                  Kankariya Talab, Bhopal
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <i className="ri-wallet-3-fill text-slate-700" />
            <div>
              <p className="text-[10px] text-slate-500">Payment method</p>
              <p className="text-xs font-bold text-slate-900">Cash</p>
            </div>
          </div>

          <p className="text-lg font-bold text-slate-950">₹193.20</p>
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;