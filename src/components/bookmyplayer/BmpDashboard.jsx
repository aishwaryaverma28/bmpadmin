import React from 'react'
import { Outlet } from 'react-router-dom'
import BmpSidebar from './BmpSidebar'

const BmpDashboard = () => {
  return (
    <div className="settings-container">     
    <BmpSidebar/>
    <div className="mainPage">
     <Outlet/>
     </div>
    </div>
  )
}

export default BmpDashboard
