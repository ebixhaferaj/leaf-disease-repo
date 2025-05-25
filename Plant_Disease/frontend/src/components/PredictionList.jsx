import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PredictionCard from './PredictionCard';
import PredictionActions from './PredictionActions';
import Spinner from './Spinner';
import ClipLoader from 'react-spinners/ClipLoader'

const PredictionList = ({ type }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust URL based on type
        const endpoint =
          type === 'confirmed'
            ? 'http://localhost:8000/predict/confirmed-predictions'
            : 'http://localhost:8000/predict/unconfirmed-predictions';

        const response = await axios.get(endpoint, {
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

  if (loading) return ( 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ClipLoader color='#2F855A' loading={loading} size={50} />
    </div>
  );
  if (error) return <p className="text-red-600">{error}</p>;
  if (predictions.length === 0) return <p>No {type} predictions found.</p>;

  return (
    <div className="space-y-4">
      {predictions.map((data) => (
        <PredictionCard
          key={data.id}
          image={data.image_url}  // adapt field name to your API response
          diseaseName={data.name_fk}
          confidence={Math.round(data.confidence * 100)}  // assuming confidence is float 0-1
          timestamp={data.timestamp}
          status={data.confirmed === 'true' ? 'confirmed' : 'unconfirmed'}
        >
          <PredictionActions
            type={type}
            onConfirm={() => console.log('Confirmed', data.id)}
            onDelete={() => console.log('Deleted', data.id)}
          />
        </PredictionCard>
      ))}
    </div>
  );
};

export default PredictionList;
