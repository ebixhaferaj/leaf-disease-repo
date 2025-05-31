import React from 'react'
import ConfirmUpdateEmail from '../components/ConfirmUpdateEmail'

const UpdateEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <ConfirmUpdateEmail />
            </div>
    </div>
  )
}

export default UpdateEmailPage