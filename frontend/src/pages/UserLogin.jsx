import React, { useContext, useState } from 'react'
import gatilogoblack from "../assets/gatilogoblack.png";
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const UserLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const { user, setUser } = React.useContext(UserDataContext)

    const submitHandler = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

        if (response.status === 200) {
            const data = response.data
            
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
        }

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

                    <h2 className='text-2xl font-bold mb-8'>
                        Sign in as User
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
                        New here?{' '}
                        <Link
                            to='/signup'
                            className='text-blue-600'
                        >
                            Create an account
                        </Link>
                    </p>

                </form>
            </div>

            <div>
                <Link
                    to='/captain-login'
                    className='flex items-center justify-center bg-[#10b461] text-white font-semibold mb-7 rounded px-4 py-3 w-full text-lg'
                >
                    Sign in as Captain
                </Link>
            </div>

        </div>
    )
}

export default UserLogin