import React, { useState } from 'react';
import { Search, Eye, Trash2, Calendar, FileText } from 'lucide-react';

const mockReports = [
  {
    id: 1,
    name: "Tomato Field Report #1",
    diseases: ["Late Blight", "Early Blight"],
    imagesCount: 6,
    date: "2025-05-20",
    status: "completed"
  },
  {
    id: 2,
    name: "Potato Crop Analysis",
    diseases: ["Potato Scab", "Black Scurf"],
    imagesCount: 4,
    date: "2025-05-18",
    status: "completed"
  },
  {
    id: 3,
    name: "Corn Disease Assessment",
    diseases: ["Corn Rust", "Northern Leaf Blight"],
    imagesCount: 8,
    date: "2025-05-15",
    status: "completed"
  }
];

export const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports] = useState(mockReports);

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.diseases.some(disease =>
      disease.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports or diseases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b">
              <div className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-700" />
                {report.name}
              </div>
              <p className="text-sm text-gray-500 mt-1">{report.date}</p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Detected Diseases:
                </p>
                <div className="flex flex-wrap gap-1">
                  {report.diseases.map((disease, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Images Uploaded:</span>{' '}
                {report.imagesCount}
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-700 rounded hover:bg-green-800 transition">
                  <Eye className="w-4 h-4 mr-1" />
                  View PDF
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm font-medium border border-red-500 text-red-600 rounded hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
