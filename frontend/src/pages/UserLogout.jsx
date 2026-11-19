import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token')

                if (!token) {
                    navigate('/login')
                    return
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.status === 200) {
                    localStorage.removeItem('token')
                    window.dispatchEvent(new Event('auth-token-changed'))
                    navigate('/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                localStorage.removeItem('token')
                window.dispatchEvent(new Event('auth-token-changed'))
                navigate('/login')
            }
        }

        logout()
    }, [navigate])

  return (
    <div>Logging out...</div>
  )
}

export default UserLogout