import React, { useEffect, useState } from 'react';
import instance from '../api/axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-hot-toast';
import { FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access. Please log in.");
      navigate('/login');
      return;
    }

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get('/get-report', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API response: ", response.data);
        setReports(response.data);
      } catch (err) {
        setError("Failed to load reports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, navigate]);

  const filteredReports = reports.filter((report) => {
    const idMatch = report.id?.toString().includes(searchQuery);
    const dateMatch = report.created_at?.toLowerCase().includes(searchQuery.toLowerCase());
    return idMatch || dateMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#2F855A" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-8 text-gray-500">
        <FolderOpen size={80} className="text-yellow-400 mb-4" />
        <p>No reports found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Farm Reports</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400"
        />
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition"
          >
            <p className="text-gray-800 font-semibold">Report ID: {report.id}</p>
            <p className="text-gray-600 text-sm">Created: {new Date(report.created_at).toLocaleString()}</p>
            <a
              href={`http://localhost:8000/static/reports/${report.pdf_path.split('\\').pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:underline mt-2 inline-block"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
