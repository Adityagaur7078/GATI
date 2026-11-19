import React, { createContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export const SocketDataContext = createContext(null)

const SocketContext = ({ children }) => {
  const socketRef = useRef(null)
  const [socketId, setSocketId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connectSocket = () => {
      const userToken = localStorage.getItem('token')
      const captainToken = localStorage.getItem('captainToken')
      const isCaptainRoute = window.location.pathname.toLowerCase().includes('captain')
      const token = isCaptainRoute
        ? (captainToken || userToken)
        : (userToken || captainToken)

      socketRef.current?.disconnect()
      socketRef.current = null
      setSocketId(null)
      setIsConnected(false)

      if (!token) {
        return
      }

      const socketConnection = io(import.meta.env.VITE_BASE_URL, {
        auth: { token },
        transports: ['polling'],
        upgrade: false,
      })

      const handleConnect = () => {
        setSocketId(socketConnection.id)
        setIsConnected(true)
      }

      const handleDisconnect = () => {
        setSocketId(null)
        setIsConnected(false)
      }

      socketConnection.on('connect', handleConnect)
      socketConnection.on('disconnect', handleDisconnect)
      socketRef.current = socketConnection
    }

    const handleAuthTokenChanged = () => {
      connectSocket()
    }

    connectSocket()
    window.addEventListener('auth-token-changed', handleAuthTokenChanged)

    return () => {
      window.removeEventListener('auth-token-changed', handleAuthTokenChanged)
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  const sendMessage = (eventName, message) => {
    socketRef.current?.emit(eventName, message)
  }

  const receiveMessage = (eventName, callback) => {
    const socketConnection = socketRef.current

    if (!socketConnection) {
      return () => {}
    }

    socketConnection.on(eventName, callback)

    return () => socketConnection.off(eventName, callback)
  }

  return (
    <SocketDataContext.Provider
      value={{ socketId, isConnected, sendMessage, receiveMessage }}
    >
      {children}
    </SocketDataContext.Provider>
  )
}

export default SocketContext