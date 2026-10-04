import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* <div className="flex flex-col items-center justify-between gap-4 sm:flex-row"> */}
          {/* <div className="flex gap-6 text-sm text-purple-700">
            <Link to='/home' className="font-bold hover:text-purple-900 transition">
              Home
            </Link>
            <Link to='/home' className="font-bold hover:text-purple-900 transition">
              About
            </Link>
            <Link to='/home' className="font-bold hover:text-purple-900 transition">
            Contact
            </Link>
            </div> */}
        {/* </div> */}
        <div className="mt-6 border-purple-100 pt-5 text-center text-sm text-purple-500">
           &copy;2026 YourBrand. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer