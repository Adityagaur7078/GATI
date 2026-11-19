import React from 'react'
import gatimap from '../assets/gatimap.gif'

const PageSkeleton = ({ variant = 'user' }) => {
  const isCaptain = variant === 'captain'

  return (
    <div
      className='fixed inset-0 z-50 overflow-hidden bg-gray-100'
      role='status'
      aria-label='Loading page'
    >
      <img
        src={gatimap}
        alt=''
        className={`absolute inset-0 h-full w-full object-cover grayscale ${isCaptain ? 'h-3/5' : ''}`}
      />

      <div className='absolute left-5 top-5 h-10 w-16 animate-pulse rounded bg-white/80' />

      {isCaptain && (
        <div className='absolute inset-x-0 top-0 h-14 border-b border-gray-200 bg-white/80'>
          <div className='ml-4 mt-3 h-8 w-20 animate-pulse rounded bg-gray-200' />
        </div>
      )}

      <div className={`absolute inset-x-0 bottom-0 bg-white px-6 py-6 shadow-[0_-8px_28px_rgba(0,0,0,0.12)] ${isCaptain ? 'h-2/5 rounded-t-4xl' : 'h-[30%]'}`}>
        <div className='h-7 w-40 animate-pulse rounded bg-gray-200' />
        <div className='mt-5 h-12 w-full animate-pulse rounded-lg bg-gray-200' />
        <div className='mt-3 h-12 w-full animate-pulse rounded-lg bg-gray-200' />
        {!isCaptain && (
          <div className='mt-5 h-12 w-full animate-pulse rounded-lg bg-gray-200' />
        )}
      </div>
    </div>
  )
}

export default PageSkeleton
