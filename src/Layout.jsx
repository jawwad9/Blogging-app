import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './compunents/Navbar'

const Layout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
    // <div>Layout</div>
  )
}

export default Layout