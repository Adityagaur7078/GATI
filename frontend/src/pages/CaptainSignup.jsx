import React, { useState } from 'react'
import gatilogoblackcaptain from "../assets/gatilogoblackcaptain.png";
import { Link } from 'react-router-dom';

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();

    setCaptainData({
      fullName: {
        firstName: firstName,
        lastName: lastName
      },
      email: email,
      password: password
    });

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>

      <div>

        <img
          className='w-16 mb-10'
          src={gatilogoblackcaptain}
          alt="Gati Logo"
        />

        <form onSubmit={submitHandler}>

          <h3 className='text-lg font-medium mb-2'>
            What's your name?
          </h3>

          <div className='flex gap-4 mb-6'>

            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              required
              placeholder='First name'
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />

            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              required
              placeholder='Last name'
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
              }}
            />

          </div>

          <h3 className='text-lg font-medium mb-2'>
            What's your email address?
          </h3>

          <input
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>
            Enter your password
          </h3>

          <input
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            required
            placeholder='Password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />

          <button
            type="submit"
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            Create Account
          </button>

          <p className='text-center'>
            Already have an account?{' '}
            <Link
              to='/captain-login'
              className='text-blue-600'
            >
              Log in
            </Link>
          </p>

        </form>

      </div>

      <div>

        <p className="text-[10px] leading-tight text-gray-500 mt-2">
          Become a Gati Captain and take control of your journey.{" "}
          <span className="text-gray-700 font-medium">
            Create your account and start earning on your schedule.
          </span>
        </p>

      </div>

    </div>
  )
}

export default CaptainSignup