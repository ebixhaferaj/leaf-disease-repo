import React, { useState } from 'react';
import instance from '../api/axios';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

const UpdateEmailForm = ({ onClose }) => {
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailFormError, setEmailFormError] = useState(null);
  const [emailFormSuccess, setEmailFormSuccess] = useState(null);
  const [emailFormLoading, setEmailFormLoading] = useState(false);

    // Handler for submitting new email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setEmailFormError(null);
    setEmailFormSuccess(null);
  
    if (!newEmail) {
      setEmailFormError('New email is required.');
      return;
    }
  
    setEmailFormLoading(true);
  
    try {
      const res = await instance.put('/me/update-email', { new_email: newEmail });
      if (res.status === 200) {
        toast.success("Confirmation link sent.")
        setEmailFormSuccess(res.data.message || 'Confirmation link sent.');
        setNewEmail('');
        setShowUpdateEmail(false);
      } else {
        toast.error('Failed to send confirmation email. Please try again.')
        setEmailFormError('Failed to send confirmation email.');
      }
    } catch (err) {
      setEmailFormError(err.response?.data?.detail || 'Failed to send confirmation email.');
    } finally {
      setEmailFormLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="w-full inline-flex items-center justify-start px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setShowUpdateEmail(true)}
      >
        <Mail className="w-4 h-4 mr-2" />
        Update Email
      </button>
        {showUpdateEmail && (
         <form onSubmit={handleUpdateEmail} className="px-6 py-4 space-y-4 border-t border-gray-200">
           {emailFormError && <div className="text-red-600">{emailFormError}</div>}
           {emailFormSuccess && <div className="text-green-600">{emailFormSuccess}</div>}
           <div>
             <label htmlFor="newEmail" className="block mb-1 font-medium text-gray-700">
               New Email
             </label>
             <input
               id="newEmail"
               type="email"
               value={newEmail}
               onChange={(e) => setNewEmail(e.target.value)}
               required
               className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
             />
           </div>
           <div className="flex gap-4">
             <button
               type="submit"
               disabled={emailFormLoading}
               className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
             >
               {emailFormLoading ? 'Sending...' : 'Send Confirmation'}
             </button>
             <button
               type="button"
               disabled={emailFormLoading}
               onClick={() => {
                 setShowUpdateEmail(false);
                 setEmailFormError(null);
                 setEmailFormSuccess(null);
                 setNewEmail('');
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

export default UpdateEmailForm;
