import React, { useContext } from 'react'
import { CaptainDataContext } from "../context/CaptainContext";
import gaticarimage from "../assets/gaticarimage.png";
import gatibike from "../assets/gatibike.png";
import gatiautoimage from "../assets/GatiAutoImage.png";

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext);

    const captainName = captain?.fullName
        ? `${captain.fullName.firstName} ${captain.fullName.lastName}`.trim()
        : 'Captain';
    const vehicle = captain?.vehicle;
    const vehicleType = vehicle?.vehicleType;
    const vehiclePhoto =
        vehicleType === "motorcycle" ? gatibike :
        vehicleType === "auto" ? gatiautoimage :
        gaticarimage;
    const vehicleName = vehicle
        ? `${vehicle.color ? `${vehicle.color} ` : ""}${vehicleType === "motorcycle" ? "Motorcycle" : vehicleType === "auto" ? "Auto" : "Car"}`
        : "Vehicle";
    const initials = captainName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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
                        {initials || "C"}
                    </div>

                    <div>
                        <p className="text-base font-semibold text-gray-900">
                            {captainName}
                        </p>
                        <p className="text-xs text-gray-500">Captain</p>
                    </div>
                </div>

                <div className="text-right">
                    <img
                        src={vehiclePhoto}
                        alt={vehicleName}
                        className="ml-auto h-12 w-20 object-contain"
                    />
                    <p className="text-xs font-bold uppercase text-gray-800">{vehicle?.plate || "No plate"}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x rounded-2xl border border-gray-100 bg-white py-4 text-center shadow-sm">
                <div>
                    <i className="ri-car-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">{vehicle?.vehicleType || "Vehicle"}</p>
                    <p className="text-[10px] text-gray-500">Vehicle type</p>
                </div>

                <div>
                    <i className="ri-palette-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">{vehicle?.color || "Color"}</p>
                    <p className="text-[10px] text-gray-500">Vehicle color</p>
                </div>

                <div>
                    <i className="ri-team-line text-xl text-gray-800" />
                    <p className="mt-1 text-sm font-bold text-gray-900">{vehicle?.capacity || "-"}</p>
                    <p className="text-[10px] text-gray-500">Seats</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails