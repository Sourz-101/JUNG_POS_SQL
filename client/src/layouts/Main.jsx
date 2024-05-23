import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'
import SearchBar from '../components/SearchBar.jsx';
import Toaster from 'react-hot-toast';

const Main = () => {
  return (
      <div>
    {/* <Navbar /> */}
    {/* <SearchBar/> */}
      <div className='bg-[#f0f2f5] '>
       {/* <div className='h-screen py-3 sticky left-0 top-0 '> <Sidebar /></div> */}
        <div className=''><Outlet /></div>
      </div>
    </div>
    
  )
}

export default Main
