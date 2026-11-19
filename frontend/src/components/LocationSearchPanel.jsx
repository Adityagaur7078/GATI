import React from 'react'

const LocationSearchPanel = ({ suggestions, isLoading, onSelectSuggestion }) => {
  if (isLoading) {
    return (
      <div className='space-y-2 py-2' role='status' aria-label='Loading location suggestions'>
        {[1, 2, 3].map((item) => (
          <div key={item} className='flex animate-pulse items-center gap-4 rounded-xl border-2 border-gray-50 p-3'>
            <div className='h-8 w-12 rounded-full bg-gray-200' />
            <div className='h-4 flex-1 rounded bg-gray-200' />
          </div>
        ))}
      </div>
    )
  }

  if (!suggestions.length) {
    return (
      <div className='py-8 text-center text-sm text-gray-500'>
        <i className='ri-map-pin-line mr-2' />
        Start typing to search for a location
      </div>
    )
  }

  return (
    <div>
      {
        suggestions.map((suggestion, index) => {
          return <button type="button" key={`${suggestion.lat}-${suggestion.lng}-${index}`} onClick={() => onSelectSuggestion(suggestion)} className="flex w-full gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start text-left">
        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-line"></i></h2>
        <h4 className='font-medium'>{suggestion.description}</h4>
      </button>
        })
      }
    </div>
  )
}

export default LocationSearchPanel