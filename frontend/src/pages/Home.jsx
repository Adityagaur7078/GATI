import React from 'react'
import gatilogowhite from "../assets/gatilogowhite.png"
import gatibackground from "../assets/gatibackground.png"
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='h-screen pt-8 w-full flex justify-between flex-col bg-cover bg-center' style={{backgroundImage: `url(${gatibackground})`}}>
            <img className='w-14 ml-8' src={gatilogowhite} alt="Gati Logo" />
            <div className="px-6 pt-16 pb-8 bg-linear-to-t from-white via-white/90 to-transparent">
                <h2 className='text-3xl font-bold'>Get Started with Gati</h2>
                <Link to={'/login'} className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home