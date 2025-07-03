import React from 'react'
import { FaSpinner } from 'react-icons/fa'

function HomePage() {
  return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
          <div className="flex items-center text-[#2F7A4E] text-xl font-semibold">
            <FaSpinner className="animate-spin mr-3 text-3xl" />
            El Home de Admin se encuentra en proceso
          </div>
        </div>
  );
}

export default HomePage