import React, { useEffect, useState } from 'react';
import instance from '../api/axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-hot-toast';
import { FolderOpen, ArrowRight, ArrowLeft, Edit2, Check, X, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const reportsPerPage = 6;
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

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
        const skip = (currentPage - 1) * reportsPerPage;
        const response = await instance.get(`/get-report?skip=${skip}&limit=${reportsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data.reports);
        setTotalReports(response.data.total);
      } catch (err) {
        setError("Failed to load reports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, navigate, currentPage]);

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase();
    const name = report.report_name?.toLowerCase() || '';
    return name.includes(query);
  });

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName('');
  };

  const handleRename = async (reportId) => {
    if (!editedName.trim()) {
      toast.error('Report name cannot be empty.');
      return;
    }

    try {
      await instance.put(
        '/get-report/rename-report',
        { report_id: reportId, new_name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Report renamed!');
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, report_name: editedName } : r
        )
      );
      cancelEditing();
    } catch (err) {
      toast.error('Failed to rename report.');
      console.error(err);
    }
  };

  const downloadPDF = async (filename) => {
    try {
      const response = await fetch(`http://localhost:8000/get-report/download/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download PDF.");
      console.error(err);
    }
  };

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
      <h1 className="text-2xl font-bold text-leaf-800 mb-6">Farm Reports</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-leaf-400"
        />
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => {
          const filename = report.pdf_path.split('\\').pop();

          return (
            <div
    key={report.id}
    className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition flex items-center justify-between"
  >
    {/* Left side: content */}
    <div className="flex flex-col space-y-2">
      {editingId === report.id ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border p-1 rounded focus:outline-none focus:ring focus:ring-green-400"
            autoFocus
          />
          <button
            onClick={() => handleRename(report.id)}
            className="text-green-600 hover:text-green-800"
            title="Save"
          >
            <Check size={18} />
          </button>
          <button
            onClick={cancelEditing}
            className="text-red-600 hover:text-red-800"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2 cursor-pointer" title="Click to rename">
          <h2
            onClick={() => startEditing(report.id, report.report_name)}
            className="font-semibold hover:underline"
          >
            {report.report_name || `Report #${report.id}`}
          </h2>
          <Edit2
            size={16}
            className="text-gray-500 hover:text-green-600"
            onClick={() => startEditing(report.id, report.report_name)}
          />
          <p className="text-gray-600 text-sm">
          Created: {new Date(report.created_at).toLocaleString()}
        </p>
        </div>
      )}

      <div className="flex items-center justify-between w-full max-w-md">


        <button
          onClick={() => downloadPDF(filename)}
          className="text-green-700 hover:underline text-sm flex p"
        >
          Download PDF <Download size={20} />
        </button>
      </div>
    </div>

    {/* Right side: trashcan, vertically centered */}
    <button
      onClick={() => alert(`Delete report with ID ${report.id}`)}
      className="text-gray-600 hover:text-red-800 p-2"
      title="Delete Report"
      style={{ alignSelf: 'center' }}
    >
      <Trash2 size={24} />
    </button>
  </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-leaf-700 text-white rounded disabled:opacity-50"
        >
          <ArrowLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? 'bg-leaf-600 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-leaf-700 text-white rounded disabled:opacity-50"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
