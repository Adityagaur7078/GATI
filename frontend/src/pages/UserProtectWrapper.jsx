import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketDataContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const { socketId, sendMessage } = useContext(SocketDataContext)

    useEffect(() => {
        if (!user?._id || !socketId) {
            return
        }

        sendMessage('join', { userType: 'user', userId: user._id })
    }, [user?._id, socketId, sendMessage])

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
                setUser(response.data)
            }

        })
        .catch(error => {

            console.log('User authentication failed:', error)

            localStorage.removeItem('token')
            navigate('/login')

        })

    }, [navigate])

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper