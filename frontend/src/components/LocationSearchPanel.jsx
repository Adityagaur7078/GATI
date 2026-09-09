import React from 'react'

const LocationSearchPanel = (props) => {

  const locations = [
    "Kolkata, West Bengal",
    "Pune, Maharashtra", "Hyderabad, Telangana",
    "Amritsar, Punjab", "Lucknow, Uttar Pradesh",
    "Rishikesh, Uttarakhand",
    "Shimla, Himachal Pradesh",
    "Kochi, Kerala"
  ];

  return (
    <div>
      {
        locations.map(function(e, index){
          return <div key={index} onClick={() => {
            props.setVehiclePanelOpen(true)
            props.setPanelOpen(false)
          }} className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start">
        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-line"></i></h2>
        <h4 className='font-medium'>{e}</h4>
      </div>
        })
      }
    </div>
  )
}

export default LocationSearchPanel