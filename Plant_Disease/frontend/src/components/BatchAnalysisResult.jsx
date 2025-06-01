import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Loader2, AlertTriangle, CheckCircle, Clock, Beaker } from "lucide-react";
import instance from "../api/axios";

const BatchAnalysisResult = ({ analyses, onReset, onResetSingle }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(false);
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
    const fetchPredictionDetails = async () => {
      if (selectedIndex === null) {
        setDetailedData(null);
        setError(null);
        setLoading(false);
        return;
      }

      const predictionId = analyses[selectedIndex]?.predictionId;
      if (!predictionId) {
        setError("No prediction ID found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await instance.get(`/prediction-details/${predictionId}`);
        setDetailedData(response.data);
      } catch (error) {
        const message = error.response?.data?.detail || error.message || "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionDetails();
  }, [selectedIndex, analyses]);

  if (!analyses) {
    return (
      <div className="w-full p-8 text-center border rounded-lg">
        <Beaker className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-500">No analysis data available</p>
        <p className="text-sm text-gray-400 mt-2">Upload images to start analyzing</p>
      </div>
    );
  }

  if (selectedIndex === null) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {analyses.map((item, index) => {
            const predictionData = item.predictionData;
            const isAnalysisLoading = !predictionData;
            
            return (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden border rounded-lg ${isAnalysisLoading ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl"}`}
                onClick={() => {
                  if (predictionData) setSelectedIndex(index);
                }}
              >
                <div className="relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={`Analyzed plant ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Beaker className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {onResetSingle && (
                    <div className="absolute top-2 right-2 ">
                    <button
                      className="h-5 w-5 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-500 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onResetSingle(index);
                      }}
                      aria-label="Remove analysis"
                    >
                      <X className="w-4 h-4 bg-red-600" />
                    </button>
                    </div>
                  )}
                </div>

                <div className="p-4 min-h-[100px] flex flex-col justify-center">
                  {isAnalysisLoading ? (
                    <div className="space-y-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-green-700" />
                        <span className="text-sm text-gray-500">Analyzing...</span>
                      </div>
                      <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                        {predictionData.disease}
                      </h3>
                      <div className={`${getConfidenceColor(predictionData.confidence)} flex items-center gap-1 w-fit text-sm font-medium px-2 py-1 rounded-md`}>
                        {getConfidenceIcon(predictionData.confidence)}
                        {(predictionData.confidence * 100).toFixed(1)}% confident
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {!analyses.length == 0 && (
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className=" w-30 h-8 flex items-center px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3 mr-2" />
            <p>Reset</p>
          </button>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelectedIndex(null)}
          className="flex items-center px-3 py-2 text-green-700 hover:bg-green-100 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </button>
      </div>

      {loading && (
        <div className="w-full p-6 border rounded-md flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-green-700" />
          <span className="text-lg">Loading detailed analysis...</span>
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
              {detailedData.pesticides && (
                <div>
                  <span className="font-medium">Recommended Treatment:</span>
                  <p className="text-sm bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                    {detailedData.pesticides}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchAnalysisResult;