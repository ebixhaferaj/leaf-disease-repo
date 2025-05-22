import React, { useState } from 'react';

const Hero = ({ title, subtitle }) => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please upload an image first.');
    setLoading(true);
    setError(null);

    // Simulate API call
    try {
      // Here you would send the file to your backend API for prediction
      // For demo, just fake a response after 2s
      await new Promise((res) => setTimeout(res, 2000));
      setPrediction({
        disease: 'Powdery Mildew',
        confidence: 92.5,
      });
    } catch (err) {
      setError('Prediction failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-green-600 py-16 mb-6">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">{title}</h1>
        <p className="text-xl text-green-100 mb-8">{subtitle}</p>

        <div className="bg-green-50 rounded-lg p-6 max-w-md mx-auto shadow-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full mb-4 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-800 transition-colors"
          >
            {loading ? 'Predicting...' : 'Predict Now'}
          </button>

          {error && <p className="mt-3 text-red-600 font-medium">{error}</p>}

          {prediction && (
            <div className="mt-4 bg-green-100 text-green-900 rounded p-4 shadow-inner">
              <p className="font-bold text-lg">Prediction Result:</p>
              <p>Disease: <span className="font-semibold">{prediction.disease}</span></p>
              <p>Confidence: <span className="font-semibold">{prediction.confidence}%</span></p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
