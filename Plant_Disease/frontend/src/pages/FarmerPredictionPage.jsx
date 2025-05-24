import React, { useState } from 'react';
import { Tabs } from '../components/Tabs';
import PredictionList from '../components/PredictionList';

const FarmerPredictionPage = () => {
  const [activeTab, setActiveTab] = useState('unconfirmed');

  const allPredictions = [
    {
      id: 1,
      image: '/static/predictions/potato.jpg',
      diseaseName: 'Potato__Late_Blight',
      confidence: 87.5,
      timestamp: '2025-05-22T14:30:00Z',
      status: 'unconfirmed',
    },
    {
      id: 2,
      image: '/static/predictions/potato.jpg',
      diseaseName: 'Tomatoo__Late_Blight',
      confidence: 90.2,
      timestamp: '2025-05-21T12:00:00Z',
      status: 'confirmed',
    },
  ];

  // Filter predictions based on selected tab
  const filtered = allPredictions.filter(p => p.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Predictions</h1>
      </div>
      <Tabs value={activeTab} onChange={setActiveTab} />
      <PredictionList type={activeTab} predictions={filtered} />
    </div>

  );
};

export default FarmerPredictionPage;
