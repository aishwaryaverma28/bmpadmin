import React from 'react'
import { Outlet } from 'react-router-dom'
import LPSettingSidebar from "./LPSettingSidebar";

export default function LPSettings() {
  return (
    <div className="settings-container">     
     <LPSettingSidebar />
     <div className="mainPage">
     <Outlet/>
     </div>
    </div>
  )
}
