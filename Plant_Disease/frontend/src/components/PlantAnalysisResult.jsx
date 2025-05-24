import React from 'react';
import { Leaf, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

//const mockAnalysisData = {
//  disease: "Powdery Mildew",
//  confidence: 89,
//  description: "Powdery mildew is a fungal disease that affects a wide range of plants...",
//  treatments: [
//    {
//      name: "Neem Oil Spray",
//      description: "Apply neem oil solution to affected areas once a week..."
//    },
//    {
//      name: "Improve Air Circulation",
//      description: "Prune the plant to improve air flow..."
//    },
//    {
//      name: "Baking Soda Solution",
//      description: "Mix 1 tbsp baking soda with 1 gallon of water..."
//    }
//  ],
//  preventionTips: [
//    "Avoid overhead watering; water at the base of plants",
//    "Space plants properly for adequate air circulation",
//    "Remove and dispose of infected plant debris",
//    "Use resistant plant varieties when available"
//  ]
//};

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
                  <span className="ml-2 text-sm">{analysisData.confidence * 100}% confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="md:w-3/5 p-6 md:p-8 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Disease Description</h2>
          <p className="text-gray-600 mb-6">{analysisData.description}</p>

          {/* Treatments 
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recommended Treatments</h3>
            <div className="space-y-4">
              {mockAnalysisData.treatments.map((treatment, index) => (
                <div
                  key={index}
                  className="border border-leaf-100 rounded-md bg-green-50 p-4"
                >
                  <h4 className="font-medium text-leaf-700 mb-1">{treatment.name}</h4>
                  <p className="text-sm text-gray-600">{treatment.description}</p>
                </div>
              ))}
            </div>
          </div>*/}

          {/* Separator */}
          <div className="border-t my-6" />

          {/* Prevention Tips 
          <div>
            <h3 className="text-lg font-semibold mb-3">Prevention Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {mockAnalysisData.preventionTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          */}

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t">
            <p className="text-sm text-gray-500">
              For advanced features and farm-wide reports,{" "}
              <a href="#" className="text-leaf-600 hover:text-leaf-700 font-medium">
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
