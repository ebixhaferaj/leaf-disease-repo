import React from 'react';
import { FileText, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const PredictionCard = ({ 
  image, 
  diseaseName, 
  confidence,
  timestamp, 
  status, 
  children 
}) => {
  const formattedTime = timestamp 
    ? format(new Date(timestamp), 'PPpp') 
    : 'Unknown time';

    const statusIcon = status === true || status === 'true' ? (
      <ShieldCheck className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-500" />
    );
    

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-48 h-48 overflow-hidden rounded-xl">
        {image}
      </div>

      <div className="flex-1 p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {diseaseName}
          </h2>
          {statusIcon}
        </div>
        <p className="text-sm text-gray-600">
          Confidence: <span className="font-medium">{confidence}%</span>
        </p>

        <p className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {formattedTime}
        </p>
        

        <div className="pt-2 flex flex-wrap gap-2">
          {children}
        </div>
      </div>
      
    </div>
  );
};


export default PredictionCard;
