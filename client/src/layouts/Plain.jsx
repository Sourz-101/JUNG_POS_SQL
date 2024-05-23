import React from 'react'
import { Outlet } from 'react-router-dom';

const Plain = () => {
  return (
    <div className='flex w-full bg-[#f0f2f5] justify-center'>
    <Outlet />
     </div>
  )
}

export default Plain
