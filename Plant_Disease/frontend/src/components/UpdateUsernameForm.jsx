import React, { useState } from 'react';
import instance from '../api/axios';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

const UpdateUsernameForm = ({ onClose }) => {
  const [showUpdateUsername, setShowUpdateUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameFormError, setUsernameFormError] = useState(null);
  const [usernameFormSuccess, setUsernameFormSuccess] = useState(null);
  const [usernameFormLoading, setUsernameFormLoading] = useState(null);

  // Handler for Change Password submit
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameFormError(null);
    setUsernameFormSuccess(null);
    setUsernameFormLoading(true);

    try {
      const res = await instance.put('/me/update-username', {
        new_username: newUsername,
      });

      if (res.status === 200) {
        toast.success("Username updated successfully.")
        setUsernameFormSuccess('Password updated successfully.');
        setNewUsername('');
        setShowUpdateUsername(false);
      } else if (res.status === 400){
        toast.error("Username is taken.")
        setUsernameFormError("Username is taken.")
      } else {
        setUsernameFormError('Password update failed.');
      } 
    } catch (err) {
      setUsernameFormError(err.response?.data?.detail || 'Password update failed.');
    } finally {
      setUsernameFormLoading(false);
    }
  };


  return (
    <>
      <button
        type="button"
        className="w-full inline-flex items-center justify-start px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setShowUpdateUsername(true)}
      >
        <User className="w-4 h-4 mr-2" />
        Update Username
      </button>
      {showUpdateUsername && (
        <form onSubmit={handleUpdateUsername} className="px-6 py-4 space-y-4 border-t border-gray-200">
          {usernameFormError && <div className="text-red-600">{usernameFormError}</div>}
          {usernameFormSuccess && <div className="text-green-600">{usernameFormSuccess}</div>}
          <div>
            <label htmlFor="newUsername" className="block mb-1 font-medium text-gray-700">
              New Username
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={usernameFormLoading}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {usernameFormLoading ? 'Updating...' : 'Update Username'}
            </button>
            <button
              type="button"
              disabled={usernameFormLoading}
              onClick={() => {
                setShowUpdateUsername(false);
                setUsernameFormError(null);
                setUsernameFormSuccess(null);
                setNewUsername('');
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateUsernameForm;
