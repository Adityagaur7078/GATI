import React, { useState } from 'react'
import gatilogoblackcaptain from "../assets/gatilogoblackcaptain.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const navigate = useNavigate()

  const { setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptain = {
      fullName: {
        firstName,
        lastName
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType
      }
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptain
      );

      if (response.status === 201) {
        const data = response.data;

        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }

      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setVehicleColor('')
      setVehiclePlate('')
      setVehicleCapacity('')
      setVehicleType('')

    } catch (error) {
      console.error(
        'Captain signup failed:',
        error.response?.data || error.message
      );
    }
  }

  return (
    <div className='min-h-screen bg-[#f7f7f7] px-5 py-6 flex flex-col'>

      <div className='mb-8'>
        <img
          className='w-16'
          src={gatilogoblackcaptain}
          alt="Gati Logo"
        />
      </div>

      <div className='mb-7'>

        <p className='text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2'>
          Gati Captain
        </p>

        <h1 className='text-3xl font-bold text-[#111] leading-tight'>
          Create your account
        </h1>

        <p className='text-sm text-gray-500 mt-2'>
          Enter your details to become a Gati Captain.
        </p>

      </div>

      <form onSubmit={submitHandler} className='flex-1'>

        <div className='mb-6'>

          <h3 className='text-base font-semibold text-[#111] mb-3'>
            Personal details
          </h3>

          <div className='grid grid-cols-2 gap-3'>

            <input
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
              type="text"
              required
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
              type="text"
              required
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

          </div>

        </div>

        <div className='mb-4'>

          <input
            className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email address'
          />

        </div>

        <div className='mb-6'>

          <input
            className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
            type="password"
            required
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <div className='mb-7'>

          <h3 className='text-base font-semibold text-[#111] mb-3'>
            Vehicle details
          </h3>

          {/* Vehicle Type + Capacity */}
          <div className='grid grid-cols-2 gap-3 mb-3'>

            <select
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition'
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >

              <option value="" disabled>
                Vehicle type
              </option>

              <option value="car">
                Car
              </option>

              <option value="motorcycle">
                Motorcycle
              </option>

              <option value="auto">
                Auto
              </option>

            </select>


            <input
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
              type="number"
              min="1"
              required
              placeholder='Capacity'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />

          </div>

          <div className='grid grid-cols-2 gap-3'>

            <input
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
              type="text"
              required
              placeholder='Vehicle color'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />

            <input
              className='bg-white rounded-xl px-4 py-3.5 border border-gray-200 w-full text-base uppercase outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition placeholder:text-gray-400'
              type="text"
              required
              placeholder='Plate number'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />

          </div>

        </div>

        <button
          type="submit"
          className='bg-[#111] text-white font-semibold rounded-xl px-4 py-3.5 w-full text-base shadow-sm active:scale-[0.98] transition duration-150'
        >
          Create Account
        </button>

        <p className='text-center text-sm text-gray-500 mt-5'>
          Already have an account?{' '}

          <Link
            to='/captain-login'
            className='text-[#111] font-semibold'
          >
            Log in
          </Link>
        </p>

      </form>

      <div className='pt-8'>

        <p className='text-[10px] leading-relaxed text-gray-400 text-center'>
          Become a Gati Captain and take control of your journey.
          <span className='text-gray-600 font-medium'>
            {' '}Start earning on your schedule.
          </span>
        </p>

      </div>

    </div>
  )
}

export default CaptainSignup