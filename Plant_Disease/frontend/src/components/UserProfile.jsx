import React, { useEffect, useState } from 'react';
import { User, Mail, Settings, Key } from 'lucide-react';
import instance from '../api/axios';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateEmailForm from './UpdateEmailForm';
import UpdateUsernameForm from './UpdateUsernameForm';
import ClipLoader from 'react-spinners/ClipLoader';

const UserProfile = () => {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const token = localStorage.getItem('accessToken');

  // Change Password
  const [showChangePassword, setShowChangePassword] = useState(true);
 
  // Change Email
  const [showUpdateEmail, setShowUpdateEmail] = useState(true);

  // Change Username
  const [showUpdateUsername, setShowUpdateUsername] = useState(true);
  

  // Account Summary
  const [PredSummaryData, setPredSummaryData] = useState([]);
  const [RepSummaryData, setRepSummaryData] = useState([]);

  useEffect(() => {
    const fetchReportSummaryData = async () => {
      try {
        const response = await instance.get('get-report/statistics', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const data = response.data;
  
        const formattedData = [
          { number: data.total, label: "Total Reports" }
        ];
  
        setRepSummaryData(formattedData);
      } catch (err) {
        console.error("Failed to fetch summary data", err);
      }
    };
    fetchReportSummaryData();
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await instance.get('confirmed-predictions/statistics', {
          headers: { Authorization: `Bearer ${token}` }

        });
  
        const data = response.data;
  
        const formattedData = [
          { number: data.total, label: "Total Confirmed Predictions" }
        ];
  
        setPredSummaryData(formattedData);
      } catch (err) {
        console.error("Failed to fetch summary data", err);
      }
    };
    fetchSummaryData();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await instance.get('/me');
        if (res.status !== 200) throw new Error('Failed to fetch user data');
        const data = res.data;
        setUserData({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return(
    <div className="flex justify-center items-center h-screen">
      <ClipLoader color='#2F855A' loading={loading} size={50} />
    </div>
  )
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card - Personal Information */}
          <section className="bg-white rounded-lg shadow-lg">
            <header className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 text-lg font-semibold">
              <User className="w-5 h-5" />
              Personal Information
            </header>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block mb-1 font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    value={userData.username}
                    disabled
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card - Account Statistics */}
          <section className="bg-white rounded-lg shadow-lg mt-6">
            <header className="px-6 py-4 border-b border-gray-200 text-lg font-semibold">
              Account Statistics
            </header>

            <div className="px-6 py-4 space-y-6">
              {/* Confirmed Predictions */}
              <div>
                <div className="space-y-4">
                  {PredSummaryData.map(({ number, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-2xl font-bold text-green-700">{number}</div>
                      <div className="text-sm text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
                
              <hr className="border-gray-200" />
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-lg">
            <header className="px-6 py-4 border-b border-gray-200 text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </header>
            <div className="px-6 py-4 space-y-3">
                {showChangePassword && (
                    <ChangePasswordForm/>
                )}

                {showUpdateEmail && (
                    <UpdateEmailForm />
                )}  
                {showUpdateUsername && (
                    <UpdateUsernameForm/>
                )} 
            </div>
          </section>
        </div>
      </div>
  );
};

export default UserProfile;
