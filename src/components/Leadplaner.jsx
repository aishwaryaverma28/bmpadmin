import React from 'react'
import { Outlet } from 'react-router-dom'
import LPheader from './LPheader'
import { LPUserProvider } from './LPContext';
import { Provider } from 'react-redux';
import store from './utils/store';
export default function Leadplaner() {
  return (
    <div>
      <Provider store={store}>
        <LPUserProvider>
          <LPheader />
          <Outlet />
        </LPUserProvider>
      </Provider>
    </div>
  )
}
