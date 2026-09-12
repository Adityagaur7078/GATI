import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/home' element={<UserProtectWrapper> <Home /> </UserProtectWrapper>} />
        <Route path='/riding' element={<UserProtectWrapper> <Riding /> </UserProtectWrapper>} />
        <Route path='/user/logout' element={<UserProtectWrapper> <UserLogout /> </UserProtectWrapper>} />

        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/captain-home' element={<CaptainProtectedWrapper> <CaptainHome /> </CaptainProtectedWrapper>} />
        <Route path='/captain/logout' element={<CaptainProtectedWrapper> <CaptainLogout /> </CaptainProtectedWrapper>} />
        <Route path='/captain/riding' element={<CaptainProtectedWrapper> <CaptainRiding /> </CaptainProtectedWrapper>} />

      </Routes>
    </div>
  )
}

export default App