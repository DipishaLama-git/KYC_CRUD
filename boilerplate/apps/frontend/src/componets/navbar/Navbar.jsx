import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext';

import {Home} from 'lucide-react';
const Navbar = () => {
  const {logout}= useAuth();
  return (
    <>
      {/* <header className="app-header">
        <Link to="/home">
        <div>  
          <span><Home size={34} color="purple"/></span>
          <span className="">KYC</span>
        </div>  
        </Link>
        <div className="page-actions">
          <Link className="btn" to="/login">
            Login
          </Link>
          <Link className="btn" to="/register">
            SignUp
          </Link>
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header> */}
      

    <nav className="fixed top-0 z-20 w-full border-b border-purple-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex justify-start">
          <Link to="/home" className="flex items-center gap-2">
            <Home size={21} className="text-purple-600" />
            <span className="text-base font-semibold text-purple-700">Home</span>
          </Link>
        </div>
        

        <div className="flex justify-center gap-7">
          <Link to="/users" className="text-base font-medium text-purple-700">
            Users
          </Link>
          
          <Link to="/province-lists" className="text-base font-medium text-purple-700">
            Provience
          </Link>
          <Link to="/district-list" className="text-base font-medium text-purple-700">
            District
          </Link>
          <Link to="/municipality-lists" className="text-base font-medium text-purple-700">
            Municipality
          </Link>
          <Link to="/kyc-lists" className="text-base font-medium text-purple-700">
            Kyc
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/change-password" className="text-base font-medium text-purple-700 hover:text-purple-800 border border-gray-300 py-3 px-2 border-2 rounded-md bg-green-100 hover:opacity-52">
            Change Password
          </Link>

          <button onClick={logout} className="text-base rounded-md px-4 py-2 font-medium text-purple-700 hover:text-purple-800 border border-gray-300 py-3 px-2 border-2 rounded-md bg-green-100 hover:opacity-52">
            Logout
          </button>
        </div>
      </div>
    </nav>
    </>
    
  )
}


export default Navbar