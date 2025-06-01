import { useState, useEffect } from 'react';
import diseaseProfiles from '../../static-data/diseaseProfiles.json';
import treatmentData from '../../static-data/treatmentData.json';
import cropDiseaseInfo from '../../static-data/cropDiseaseInfo.json';

const useLearnData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    diseaseProfiles: [],
    treatmentData: null,
    cropDiseaseInfo: null,
  });

  useEffect(() => {
    try {
      setData({
        diseaseProfiles,
        treatmentData,
        cropDiseaseInfo,
      });
    } catch (err) {
      console.error('Error loading learn data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ...data, loading, error };
};

export default useLearnData;
