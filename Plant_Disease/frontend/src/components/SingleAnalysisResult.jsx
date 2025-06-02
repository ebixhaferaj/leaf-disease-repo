import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Beaker,
} from "lucide-react";
import instance from "../api/axios";

const SingleAnalysisResult = ({ analysis, onReset }) => {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 border border-green-200";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-red-100 text-red-800 border border-red-200";
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.6) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!analysis?.predictionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await instance.get(`/prediction-details/${analysis.predictionId}`);
        setDetailedData(response.data);
      } catch (err) {
        const message = err.response?.data?.detail || err.message || "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="w-full p-8 text-center border rounded-lg">
        <Beaker className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-500">No analysis available</p>
        <p className="text-sm text-gray-400 mt-2">Upload an image to analyze</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="flex items-center px-3 py-2 text-green-700 hover:bg-green-100 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      {loading && (
        <div className="w-full p-6 border rounded-md flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-green-700" />
          <span className="text-lg">Loading analysis...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {detailedData && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Beaker className="w-5 h-5" />
              Disease Information
            </div>
            <h2 className="text-2xl font-bold mb-2">{detailedData.name_fk}</h2>
            <div className={`${getConfidenceColor(detailedData.confidence)} flex items-center gap-1 w-fit text-sm font-medium px-2 py-1 rounded-md`}>
              {getConfidenceIcon(detailedData.confidence)}
              {(detailedData.confidence * 100).toFixed(2)}% Confidence
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              Analysis Details
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${detailedData.confirmed ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                  {detailedData.confirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(detailedData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAnalysisResult;
