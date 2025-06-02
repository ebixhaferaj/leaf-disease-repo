import React, { useState } from 'react';
import { Tabs } from '../components/Tabs';
import PredictionList from '../components/PredictionList';

const UserPredictionPage = () => {
  const [activeTab, setActiveTab] = useState('unconfirmed');

  const allPredictions = [];

  // Filter predictions based on selected tab
  const filtered = allPredictions.filter(p => p.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onChange={setActiveTab} />
      <PredictionList  
      type={activeTab} a
      allowSelection={true}
      showReportButton={true} 
      predictions={filtered} />
    </div>

  );
};

export default UserPredictionPage;
