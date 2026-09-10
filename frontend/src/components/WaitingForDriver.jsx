import React from "react";
import gaticarimage from "../assets/gaticarimage.png"

const WaitingForDriver = ({ setWaitingForDriverPanel }) => {
  return (
    <div className="mx-auto w-full max-w-md rounded-t-4xl bg-white px-5 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]">
      <button
        type="button"
        onClick={() => setWaitingForDriverPanel(false)}
        className="mx-auto mb-6 block h-1.5 w-12 rounded-full bg-slate-300"
        aria-label="Close panel"
      />

      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Waiting for driver
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your ride request has been sent
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600" />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-[72px_1fr_72px] items-center gap-3 rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-white p-4 shadow-sm">
        <div className="flex h-21 w-21 items-center justify-center overflow-hidden">
          <img
            src={gaticarimage}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 pl-4">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Your driver
          </p>
          <p className="text-lg font-extrabold text-slate-950">Amishah</p>
          <p className="text-sm font-semibold text-slate-700">
            Maruti Suzuki Alto
          </p>
          <p className="mt-1 inline-block rounded-md bg-slate-950 px-2 py-1 text-xs font-extrabold tracking-widest text-white">
            MP04 AB 1234
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-200 bg-white shadow-sm">
          <i className="ri-user-fill text-4xl text-emerald-600" />
        </div>
      </div>


      <div className="mb-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="relative space-y-6">
          <div className="absolute left-2.25 top-5 h-12 border-l-2 border-dashed border-slate-300" />

          <div className="relative flex items-start gap-4">
            <div className="z-10 mt-1 h-5 w-5 rounded-full border-4 border-emerald-100 bg-emerald-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pickup
              </p>
              <p className="text-sm font-bold text-slate-900">
                562/11-A, Kankariya Talab
              </p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="z-10 mt-1 h-5 w-5 rounded-full border-4 border-red-100 bg-red-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Destination
              </p>
              <p className="text-sm font-bold text-slate-900">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
            <i className="ri-wallet-3-fill text-lg" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment method</p>
            <p className="text-sm font-bold text-slate-900">Cash</p>
          </div>
        </div>

        <p className="text-xl font-bold text-slate-950">₹193.20</p>
      </div>

    </div>
  );
};

export default WaitingForDriver;