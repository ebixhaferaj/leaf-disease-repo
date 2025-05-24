import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const Tabs = ({ value, onChange }) => {
  return (
    <div className="w-full border-b border-gray-200 mb-6 grid grid-cols-2">
      <button
        onClick={() => onChange('unconfirmed')}
        className={`flex items-center gap-2 justify-center py-2 font-medium w-full col-span-1 ${
        value === 'unconfirmed' 
        ? 'border-b-2 border-green-700 text-green-700' 
        : 'text-gray-500 hover:text-green-600'
    }`}
    type="button"
  >
    <AlertTriangle className="w-4 h-4" />
      Unconfirmed Predictions
    </button>

    <button
      onClick={() => onChange('confirmed')}
      className={`flex items-center gap-2 justify-center py-2 font-medium w-full col-span-1 ${
      value === 'confirmed' 
        ? 'border-b-2 border-green-700 text-green-700' 
        : 'text-gray-500 hover:text-green-600'
    }`}
      type="button"
    >
    <CheckCircle className="w-4 h-4" />
    Confirmed Predictions
  </button>
</div>

  );
};