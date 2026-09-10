import React from "react"
import gaticarimage from "../assets/gaticarimage.png"

const LookingForDriver = ({ setVehicleFoundPanel }) => {
  return (
    <div className="mx-auto w-full max-w-md rounded-t-4xl bg-white px-5 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]">
      <button
        type="button"
        onClick={() => setVehicleFoundPanel(false)}
        className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-slate-300"
        aria-label="Close panel"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight text-slate-950 pt-4">
            Looking for driver
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600" />
        </div>
      </div>

      <div className="relative mb-5 overflow-hidden rounded-[1.75rem] bg-slate-50 px-5 pb-5 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Selected ride
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">GatiGo</h3>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            Cash
          </span>
        </div>

        <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-white">
          <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-200" />

          <span className="absolute left-[18%] top-8 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="absolute right-[20%] top-5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:500ms]" />
          <span className="absolute bottom-7 left-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:900ms]" />
          <span className="absolute bottom-6 right-[30%] h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:1200ms]" />

          <img
            src={gaticarimage}
            alt="GatiGo vehicle"
            className="relative z-10 h-20 w-32 object-contain drop-shadow-[0_8px_8px_rgba(15,23,42,0.2)]"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Connecting you with a driver
            </p>
            <p className="text-xs text-slate-500">
              This usually takes a few seconds
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <i className="ri-map-pin-2-fill text-lg" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Pickup</p>
            <p className="truncate text-sm font-semibold text-slate-900">
              562/11-A, Kankariya Talab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <i className="ri-flag-fill text-lg" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Destination</p>
            <p className="truncate text-sm font-semibold text-slate-900">
              Kankariya Talab, Bhopal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-slate-500">
          <i className="ri-wallet-3-fill text-lg" />
          <span className="text-sm font-medium">Pay with cash</span>
        </div>

        <span className="text-xl font-bold text-slate-950">₹195.20</span>
      </div>
    </div>
  )
}

export default LookingForDriver