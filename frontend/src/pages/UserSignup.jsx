import React, { useState } from 'react'
import gatilogoblack from "../assets/gatilogoblack.png";
import { Link } from 'react-router-dom';

const UserSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();

    setUserData({
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
          src={gatilogoblack}
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
              to='/login'
              className='text-blue-600'
            >
              Log in
            </Link>
          </p>

        </form>

      </div>

      <div>

        <p className="text-[10px] leading-tight text-gray-500 mt-2">
          By creating a Gati account, you agree to our{" "}
          <span className="text-gray-700 font-medium">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-gray-700 font-medium">
            Privacy Policy
          </span>
          . We may send you account updates, verification codes, and
          service-related messages.
        </p>

      </div>

    </div>
  )
}

export default UserSignup