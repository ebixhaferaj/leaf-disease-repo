import React from 'react';
import PredictionCard from './PredictionCard';
import PredictionActions from './PredictionActions';

const PredictionList = ({ predictions, type }) => {
  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          image={prediction.image}
          diseaseName={prediction.diseaseName}
          confidence={prediction.confidence}
          timestamp={prediction.timestamp}
          status={prediction.status}
        >
          <PredictionActions
            type={type}
            onConfirm={() => console.log('Confirmed', prediction.id)}
            onDelete={() => console.log('Deleted', prediction.id)}
          />
        </PredictionCard>
      ))}
    </div>
  );
};

export default PredictionList;
