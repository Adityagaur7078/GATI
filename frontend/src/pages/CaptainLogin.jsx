import React, { useState } from 'react'
import gatilogoblackcaptain from "../assets/gatilogoblackcaptain.png";
import { Link } from 'react-router-dom';

const CaptainLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captainData, setCaptainData] = useState({})

    const submitHandler = (e) => {
        e.preventDefault();

        setCaptainData({
            email: email,
            password: password
        });

        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            <div>
                <img
                    className='w-20 mb-10'
                    src={gatilogoblackcaptain}
                    alt="Gati Logo"
                />

                <form onSubmit={submitHandler}>

                    <h2 className='text-2xl font-bold mb-8'>
                        Sign in as Captain
                    </h2>

                    <h3 className='text-lg font-medium mb-2'>
                        What's your email?
                    </h3>

                    <input
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
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
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        placeholder='Password'
                    />

                    <button
                        type="submit"
                        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-3 w-full text-lg'
                    >
                        Login
                    </button>

                    <p className='text-center'>
                        New to Gati?{' '}
                        <Link
                            to='/captain-signup'
                            className='text-blue-600'
                        >
                            Register as a Captain
                        </Link>
                    </p>

                </form>
            </div>

            <div>
                <Link
                    to='/login'
                    className='flex items-center justify-center bg-[#d5622d] text-white font-semibold mb-7 rounded px-4 py-3 w-full text-lg'
                >
                    Sign in as User
                </Link>
            </div>

        </div>
    )
}

export default CaptainLogin