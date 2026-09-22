import React from 'react'

const LocationSearchPanel = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div>
      {
        suggestions.map((suggestion) => {
          return <button type="button" key={`${suggestion.lat}-${suggestion.lng}`} onClick={() => onSelectSuggestion(suggestion)} className="flex w-full gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start text-left">
        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-line"></i></h2>
        <h4 className='font-medium'>{suggestion.description}</h4>
      </button>
        })
      }
    </div>
  )
}

export default LocationSearchPanel