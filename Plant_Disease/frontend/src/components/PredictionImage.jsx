import React, { useEffect, useState } from 'react';
import instance from '../api/axios';

const PredictionImage = ({ predictionId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    console.log("🖼️ PredictionImage mounted for ID:", predictionId);
  }, [predictionId]);
  
  useEffect(() => {
    const fetchImage = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await instance.get(`/predict/image/${predictionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // crucial to treat the response as an image
        });

        const url = URL.createObjectURL(response.data);
        console.log(`Image fetched successfully for ID ${predictionId}:`, url);
        setImageUrl(url);
      } catch (err) {
        if (err.response) {
          console.error(`HTTP error ${err.response.status} when fetching image:`, err.response.data);
        } else {
          console.error(`Network or config error:`, err.message);
        }
      }
    };

    fetchImage();
  }, [predictionId]);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Prediction"
      className="rounded-xl mb-4 max-h-60 object-cover w-full"
    />
  ) : (
    <div className="bg-gray-100 h-60 w-full rounded-xl flex items-center justify-center text-gray-500">
      Loading image...
    </div>
  );
};

export default PredictionImage;
