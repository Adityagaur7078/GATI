import React, { useContext } from 'react'
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext);

    const captainName = captain?.fullName
        ? `${captain.fullName.firstName} ${captain.fullName.lastName}`.trim()
        : 'Captain';

    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Welcome Captain
                    </h2>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Online
                </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                        H
                    </div>

                    <div>
                        <p className="text-base font-semibold text-gray-900">
                            {captainName}
                        </p>
                        <p className="text-xs text-gray-500">Captain</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹295.20</p>
                    <p className="text-xs text-gray-500">Earned</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x rounded-2xl border border-gray-100 bg-white py-4 text-center shadow-sm">
                <div>
                    <i className="ri-speed-up-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">10.2 km/h</p>
                    <p className="text-[10px] text-gray-500">Speed</p>
                </div>

                <div>
                    <i className="ri-time-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">10.2 hrs</p>
                    <p className="text-[10px] text-gray-500">Time Online</p>
                </div>

                <div>
                    <i className="ri-wallet-3-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">₹295.20</p>
                    <p className="text-[10px] text-gray-500">Money Earned</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails