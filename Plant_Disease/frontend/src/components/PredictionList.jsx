import React, { use, useEffect, useState, onSelect } from 'react';
import instance from '../api/axios';
import PredictionCard from './PredictionCard';
import PredictionActions from './PredictionActions';
import ClipLoader from 'react-spinners/ClipLoader';
import PredictionImage from './PredictionImage';
import { toast } from 'react-hot-toast';
import { FolderOpen } from 'lucide-react'

const PredictionList = ({ type, allowSelection = false, showReportButton = false }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([])

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          type === 'confirmed'
            ? '/batch-predict/confirmed-predictions'
            : '/batch-predict/unconfirmed-predictions';

        const response = await instance.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched predictions:", response.data);
        setPredictions(response.data);
      } catch (err) {
        setError('Failed to fetch predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [type, token]);

  const handleConfirm = async (id) => {
    try {
      const response = await instance.post(
        `/predict/confirm-prediction/${id}`,
        { prediction_id: id }, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Prediction confirmed successfully. View it under 'Confirmed Predictions'.");
  
      setPredictions((prev) =>
        prev.map((pred) =>
          pred.id === id ? { ...pred, confirmed: true } : pred
        )
      );
  
    } catch (err) {
      console.error("Error confirming prediction:", err);
      toast.error("Failed to confirm prediction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/predict/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully")
      setPredictions(prev => prev.filter(pred => pred.id !== id));
    } catch (err) {
      toast.error("Error deleting prediction")
      console.error("Error deleting prediction:", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader color='#2F855A' loading={loading} size={50} />
    </div>
  );
  if (error) return <p className="text-red-600">{error}</p>;
  if (predictions.length === 0) 
    return (
    <>
      <div className="flex justify-center text-yellow-400 pt-5 ">
        <FolderOpen size={80}/>
      </div>
      <div className='flex justify-center text-gray-500'>
        <p>There are no {type} predictions.</p>
      </div>
      </>
    );

    const toggleSelection = (id) => {
      if (!allowSelection) return;
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };
  
    const handleCreateReport = async (idArray) => {
      try {
        const response = await instance.post(
          "/generate-report",
          { prediction_id: idArray },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        toast.success("Report created Sucessfully!");
    
        setPredictions((prev) =>
          prev.map((pred) =>
            idArray.includes(pred.id) ? { ...pred, confirmed: true } : pred
          )
        );
    
      } catch (err) {
        console.error("Error creating Report:", err);
        toast.error("Failed to create Report");
      }
    }

  return (
    <>
    {/* Create Report Button */}
    {showReportButton && selectedIds.length > 0 && (
      <div className="fixed bottom-6 right-6 z-50">
        <button
        onClick={() => handleCreateReport(selectedIds)}
        className="px-4 py-2 bg-leaf-600 text-white rounded-lg shadow hover:bg-green-800 transition"
      >
          Generate Report
        </button>
      </div>
    )}
    <div className="space-y-4">
      {predictions.map((data) => (
        <PredictionCard
          key={data.id}
          image={<PredictionImage predictionId={data.id} />}
          diseaseName={data.name_fk}
          confidence={Math.round(data.prediction_confidence * 100)}
          timestamp={data.timestamp}
          status={data.confirmed === 'true' ? 'confirmed' : 'unconfirmed'}
          selected={selectedIds.includes(data.id)}
          onSelect={() => toggleSelection(data.id)}
          selectable= {allowSelection}
        >
          <PredictionActions
            type={type}
            onConfirm={() => handleConfirm(data.id)}  
            onDelete={() => handleDelete(data.id)}   
          />
        </PredictionCard>
      ))}
    </div>
    </>
  );
};

export default PredictionList;
