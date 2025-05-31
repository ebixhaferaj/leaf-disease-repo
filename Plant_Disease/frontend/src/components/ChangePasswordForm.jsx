import React, { useState, useEffect } from 'react';
import instance from '../api/axios';
import toast from 'react-hot-toast';
import { Key } from 'lucide-react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePasswordForm = ({ onClose }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
          setValidPwd(PASSWORD_REGEX.test(newPassword));
      }, [newPassword]);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!PASSWORD_REGEX.test(newPassword)) {
      setErrMsg("Invalid Entry");
      return;
  }

    if (!currentPassword || !newPassword) {
      setFormError('Both current and new passwords are required.');
      return;
    }

    setFormLoading(true);

    try {
      const res = await instance.put('/me/update-current-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.status === 200) {
        toast.success('Password updated successfully.');
        setFormSuccess('Password updated successfully.');
        resetForm();
        setShowChangePassword(false);
        if (onClose) onClose();
      } else {
        setFormError('Password update failed.');
      }
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Password update failed.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* The single toggle button */}
      <button
        type="button"
        className="w-full inline-flex items-center justify-start px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setShowChangePassword(true)}
        disabled={formLoading}
      >
        <Key className="w-4 h-4 mr-2" />
        Change Password
      </button>

      {/* Show form only when toggled */}
      {showChangePassword && (
        <form
          onSubmit={handleChangePassword}
          className="px-6 py-4 space-y-4 border-t border-gray-200"
        >
          {formError && (
            <div className="text-red-600 text-sm font-medium font-inter">{formError}</div>
          )}
          {formSuccess && (
            <div className="text-green-600 text-sm font-medium font-inter">{formSuccess}</div>
          )}

          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-1 font-medium text-gray-700 font-inter"
            >
              Current Password:
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 font-inter"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block mb-1 font-medium text-gray-700 font-inter"
            >
              New Password:
              <span className={`${validPwd ? "text-leaf-700 ml-1" : "hidden"}`}>
                  <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={`${validPwd || !newPassword ? "hidden" : "text-red-600 ml-1"}`}>
                  <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 font-inter"
            />
            <p className={`${pwdFocus && !validPwd ? "text-sm text-gray-500 mt-1" : "hidden"}`}>
               <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
               8+ characters, upper & lower case, digit, and symbol '@$!%*?&'
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 font-inter font-semibold"
            >
              {formLoading ? 'Updating...' : 'Update Password'}
            </button>
            <button
              type="button"
              disabled={formLoading}
              onClick={() => {
                setShowChangePassword(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none font-inter"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePasswordForm;
