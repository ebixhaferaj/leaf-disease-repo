import React, { useState, useEffect } from "react";
import instance  from "../api/axios";

const BatchAnalysisResult = ({ analyses, onReset, onResetSingle }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken")

  useEffect(() => {
    if (selectedIndex !== null) {
      const predictionId = analyses[selectedIndex]?.predictionId;
      if (!predictionId) {
        setError("No prediction ID found.");
        return;
      }
  
      setLoading(true);
      setError(null);
  
      instance.get(`/prediction-details/${predictionId}`)
        .then((response) => {
          console.log("Detailed prediction data:", response.data);
          setDetailedData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          const message =
            error.response?.data?.detail || error.message || "Something went wrong.";
          setError(message);
          setLoading(false);
        });
    } else {
      setDetailedData(null);
      setError(null);
      setLoading(false);
    }
  }, [selectedIndex, analyses]);

  if (!analyses || analyses.length === 0) {
    return <p>No analysis data available.</p>;
  }

  if (selectedIndex === null) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {analyses.map((item, index) => {
            const predictionData = item.predictionData;

            return (
              <div
                key={index}
                onClick={() => {
                  if (predictionData) setSelectedIndex(index);
                }}
                className={`cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow relative ${
                  !predictionData ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={predictionData ? "" : "Analysis loading..."}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={`Analyzed plant ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-2 bg-white min-h-[72px]">
                  {predictionData ? (
                    <>
                      <h3 className="font-medium text-lg">{predictionData.disease}</h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {(predictionData.confidence * 100).toFixed(1)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-center text-gray-400">Analyzing...</p>
                  )}
                </div>

                {onResetSingle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetSingle(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    aria-label="Remove analysis"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onReset}
          className="mt-6 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Reset All
        </button>
      </div>
    );
  }

  // Detailed view
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <button
        onClick={() => setSelectedIndex(null)}
        className="mb-4 text-green-700 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>

      {loading && <p>Loading details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {detailedData && (
  <>
    <h2 className="text-xl font-semibold mb-2">{detailedData.name_fk}</h2>
    <p>
      <strong>Confidence:</strong> {(detailedData.confidence * 100).toFixed(2)}%
    </p>
    <p className="mt-2">
      <strong>Confirmed:</strong> {detailedData.confirmed ? "Yes" : "No"}
    </p>
    <p className="mt-2">
      <strong>Created:</strong> {new Date(detailedData.timestamp).toLocaleString()}
    </p>
    {/* Remove if user_id_fk is not present */}
    {/* <p className="mt-2">
      <strong>User ID:</strong> {detailedData.user_id_fk}
    </p> */}
    {detailedData.pesticides && (
      <p className="mt-2">
        <strong>Treatment:</strong> {detailedData.pesticides}
      </p>
    )}
  </>
)}


    </div>
  );
};

export default BatchAnalysisResult;
