import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketDataContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import PageSkeleton from '../components/PageSkeleton'
const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const { socketId, sendMessage } = useContext(SocketDataContext)
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true)

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
            setIsCheckingAuth(false)

        })
        .catch(error => {

            console.log('User authentication failed:', error)

            localStorage.removeItem('token')
            setIsCheckingAuth(false)
            navigate('/login')

        })

    }, [navigate, setUser])

    return (
        <>
            {isCheckingAuth ? <PageSkeleton variant='user' /> : children}
        </>
    )
}

export default UserProtectWrapper