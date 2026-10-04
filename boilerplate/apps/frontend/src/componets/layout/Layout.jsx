import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from './footer/Footer'

const Layout = ({children}) => {
  return (
    <div className=" flex min-h-screen flex-col">
      <Navbar/>
      <main className='flex-1 pt-20'>
      {children}
      </main>
      <Footer/>
    </div>
  )
}

export default Layout