import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import SingleUploadDropzone from './SingleUploadDropzone';
import instance from '../api/axios';

const UserDashboard = () => {
  const [diseaseData, setDiseaseData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken');

  const handleResult = (predictionData) => {
    console.log("Single analysis result received:", predictionData);
  };

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const response = await instance.get('confirmed-predictions/common-diseases', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setDiseaseData(response.data);
      } catch (err) {
        console.error("Failed to fetch disease distribution:", err);
        setError("Failed to load chart");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDiseaseData();
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await instance.get('confirmed-predictions/statistics', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const data = response.data;
  
        const formattedData = [
          { title: "Total Confirmed Predictions", value: data.total, icon: FileText },
          { title: "Most Common Disease", value: data.most_common, icon: null },
          { 
            title: "Last Upload", 
            value: new Date(data.last_upload).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            icon: null
          }
        ];
  
        setSummaryData(formattedData);
      } catch (err) {
        console.error("Failed to fetch summary data", err);
      }
    };
    fetchSummaryData();
  }, []);
  return (
    <div className="p-6 space-y-6 flex-1">
      {/* Welcome Section */}
      <div className="bg-leaf-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, User!</h1>
        <p className="text-white/90">
          Monitor your crops and manage plant disease predictions with confidence
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Upload Card - LEFT (2/3) */}
        <div className="lg:col-span-2 bg-white border rounded-lg shadow p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-leaf-700" />
            <h2 className="text-lg font-semibold">Upload Plant Images</h2>
          </div>

          <div className='flex-1'>
            <SingleUploadDropzone  
              apiUrl="http://localhost:8000/predict" 
              formFieldName="file"
              token={token} 
              onResult={handleResult}
            />
          </div>
        </div>

        {/* Stats + Chart - RIGHT (1/3) */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-white border rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
             {summaryData.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  {stat.icon && <stat.icon className="w-4 h-4 text-leaf-700" />}
                  <span className="text-sm">{stat.title}</span>
                </div>
                <span className="font-medium text-gray-800">{stat.value}</span>
              </div>
                ))}
            </div>
          </div>

          {/* Disease Chart */}
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Disease Distribution</h2>
          {loading ? (
              <p>Loading chart...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : diseaseData.length === 0 ? (
              <p className="text-gray-500">No confirmed disease predictions yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart key={JSON.stringify(diseaseData)}> {/* Remounts when data changes */}
                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="disease"
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
