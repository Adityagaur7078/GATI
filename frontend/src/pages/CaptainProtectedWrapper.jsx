import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketDataContext } from '../context/SocketContext'
import PageSkeleton from '../components/PageSkeleton'
const CaptainProtectedWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { setCaptain } = React.useContext(CaptainDataContext)
    const { captain } = useContext(CaptainDataContext)
    const { socketId, sendMessage } = useContext(SocketDataContext)
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true)

    useEffect(() => {
        if (!captain?._id || !socketId) {
            return
        }

        sendMessage('join', { userType: 'captain', userId: captain._id })
    }, [captain?._id, socketId, sendMessage])

    useEffect(() => {

        const token = localStorage.getItem('captainToken')

        if (!token) {
            navigate('/captain-login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {

            if (response.status === 200) {
                setCaptain(response.data)
            }
            setIsCheckingAuth(false)

        })
        .catch(err => {

            console.log(err)

            localStorage.removeItem('captainToken')
            setIsCheckingAuth(false)
            navigate('/captain-login')

        })

    }, [navigate, setCaptain])

    return (
        <>
            {isCheckingAuth ? <PageSkeleton variant='captain' /> : children}
        </>
    )
}

export default CaptainProtectedWrapper