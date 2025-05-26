import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const PredictionActions = ({ type, onConfirm, onDelete }) => {
  return (
    <div className="flex gap-2">
      {type === 'unconfirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();  // ✅ This should now trigger the parent function
          }}
          className="flex items-center px-3 py-1 text-sm bg-green-700 text-white rounded shadow hover:bg-green-800"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Confirm
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={`flex items-center px-3 py-1 text-sm rounded shadow ${
          type === 'unconfirmed'
            ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            : 'text-red-600 hover:text-red-700'
        }`}
      >
        <XCircle className="w-4 h-4 mr-1" />
        Delete
      </button>
    </div>
  );
};


export default PredictionActions;
