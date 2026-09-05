import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserProtectWrapper = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login')
            return
        }

        axios.get(
            `${import.meta.env.VITE_BASE_URL}/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {

            if (response.status === 200) {
                setIsLoading(false)
            }

        })
        .catch(error => {

            console.log('User authentication failed:', error)

            localStorage.removeItem('token')
            navigate('/login')

        })

    }, [navigate])


    if (isLoading) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <p className='text-gray-600'>
                    Loading...
                </p>
            </div>
        )
    }


    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper