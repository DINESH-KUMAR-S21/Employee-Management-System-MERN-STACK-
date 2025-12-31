import React from 'react'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h2>
      <p className="mb-4">You do not have permission to access this page.</p>
      <div className="space-x-2">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Go Back</button>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-teal-600 text-white rounded">Sign in</button>
      </div>
    </div>
  )
}

export default Unauthorized
