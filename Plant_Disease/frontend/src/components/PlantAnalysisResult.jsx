import React from 'react';
import { Leaf, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PlantAnalysisResult = ({ imageUrl, analysisData, onReset }) => {
  return (
    <motion.div
      className="w-full bg-white rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image + overlay section */}
        <div className="md:w-2/5 relative">
          <img
            src={imageUrl}
            alt="Analyzed plant"
            className="w-full h-full object-cover"
            style={{ maxHeight: '600px' }}
          />
          {/* Back button */}
          <button
            onClick={onReset}
            className="absolute top-4 left-4 p-2 rounded-md bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {/* Disease info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <div className="flex items-center">
              <Leaf className="h-7 w-7 text-leaf-300 mr-3" />
              <div>
                <h3 className="font-medium text-xl">{analysisData.disease_name}</h3>
                <div className="flex items-center mt-1">
                  <div className="w-full max-w-36 bg-white/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-400 h-full rounded-full"
                      style={{ width: `${Math.round(analysisData.confidence * 1000) / 10}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm">{analysisData.confidence.toFixed(1) * 100}% confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="md:w-3/5 p-6 md:p-8 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Disease Description</h2>
          <p className="text-gray-600 mb-6">{analysisData.description}</p>

          {/* Separator */}
          <div className="border-t my-6" />

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t">
            <p className="text-sm text-gray-500">
              For advanced features and farm-wide reports,{" "}
              <a href="/register" className="text-leaf-600 hover:text-leaf-700 font-medium">
                create a free account
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantAnalysisResult;
