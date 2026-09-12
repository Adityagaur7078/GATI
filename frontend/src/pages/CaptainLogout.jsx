import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token')

                if (!token) {
                    navigate('/captain/login')
                    return
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/captains/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.status === 200) {
                    localStorage.removeItem('token')
                    navigate('/captain-login')
                }
            } catch (error) {
                console.error('Logout error:', error)

                localStorage.removeItem('token')
                navigate('/captain-login')
            }
        }

        logout()
    }, [navigate])

    return <div>Logging out...</div>
}

export default CaptainLogout