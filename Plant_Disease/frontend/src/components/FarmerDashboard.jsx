import React, { useState } from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import BatchUploadDropzone from './BatchUploadDropzone';


const statsData = [
  { title: 'Total Reports', value: '12', icon: FileText },
  { title: 'Most Common Disease', value: 'Tomato__Late_Blight', icon: null },
  { title: 'Last Upload', value: 'May 22, 2025', icon: null }
];

const diseaseData = [
  { name: 'Tomato Late Blight', value: 35, color: '#ef4444' },
  { name: 'Potato Early Blight', value: 25, color: '#f97316' },
  { name: 'Corn Rust', value: 20, color: '#eab308' },
  { name: 'Bean Leaf Spot', value: 20, color: '#22c55e' }
];



const Dashboard = () => {
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  
  const token = localStorage.getItem('accessToken')
  console.log({token})
  
  const handleResult = (predictionData) => {
    console.log("Single analysis result received:", predictionData);
  };

  return (
    <div className="p-6 space-y-6 flex-1">
      {/* Welcome Section */}
      <div className="bg-leaf-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Farmer!</h1>
        <p className="text-white/90">
          Monitor your crops and manage plant disease predictions with confidence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white border rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-leaf-700" />
            <h2 className="text-lg font-semibold">Upload Plant Images</h2>
          </div>

          <BatchUploadDropzone  
            apiUrl="http://localhost:8000/batch-predict" 
            formFieldName="files"
            token={token} 
            onResult={handleResult}/>
        </div>

       {/* Summary Stats */}
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
          <div className="space-y-4">
            {statsData.map((stat, index) => (
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-leaf-700 text-white rounded hover:bg-leaf-800 transition">
              <FileText className="w-4 h-4" />
              Create Report
            </button>
            <button className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              Download Last PDF
            </button>
          </div>
        </div>

        {/* Disease Distribution Chart */}
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Disease Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
