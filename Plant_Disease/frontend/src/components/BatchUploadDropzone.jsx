import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image, Upload, ArrowUp } from 'lucide-react';
import BatchAnalysisResult from "./BatchAnalysisResult";

export const BatchUploadDropzone = ({ apiUrl, formFieldName, token = null, onResult = () => {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toast = (title, description) => {
    alert(`${title}\n${description}`);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files) => {
    if (files.length === 0) return;
  
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast("Unsupported File", "Please upload image files only.");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast("File Too Large", "Please upload images smaller than 10MB.");
        return false;
      }
      return true;
    });
  
    if (validFiles.length === 0) return;
  
    setIsAnalyzing(true);
  
    // First read all images for previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setSelectedImages((prev) => [
            ...prev,
            { imageUrl: event.target.result, predictionData: null, fileName: file.name },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  

    analyzeImagesBatch(validFiles)
      .then((batchPredictionData) => {
        setSelectedImages((prev) => {
          return prev.map((item, index) => ({
            ...item,
            predictionData: batchPredictionData.results[index], 
            predictionId: batchPredictionData.prediction_ids[index],
          }));
        });
        onResult(batchPredictionData);
      })
      .catch((error) => {
        toast("Analysis Failed", "Unable to analyze images batch.");
        setSelectedImages([]);
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };

  const analyzeImagesBatch = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(formFieldName, file);
    });
  
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers,
    });
  
    if (!response.ok) throw new Error("Failed to analyze images batch");
  
    const data = await response.json();
    return data;
  };
  

  const resetSingleAnalysis = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setSelectedImages([]);
  };

  return (
    <motion.div
      className="w-full rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {selectedImages.length > 0 ? (
        <>
          <BatchAnalysisResult
            analyses={selectedImages.filter((item) => item.predictionData !== null)}
            onReset={resetAll}
            onResetSingle={resetSingleAnalysis}
          />
          {isAnalyzing && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-medium mb-2">Analyzing your plants...</h3>
              <p className="text-gray-500">Our AI is examining the images for signs of disease</p>
            </div>
          )}
        </>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 
          bg-white/80 backdrop-blur-sm ${
            isDragging ? "border-leaf-800 bg-leaf-100" : ""
          }`}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Drop your plant photo here</h3>
            <p className="text-gray-500 mb-6">Drag and drop or click to upload</p>
            <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg cursor-pointer transition-all transform hover:scale-105 flex items-center">
              <ArrowUp className="w-4 h-4 mr-2" />
              Upload Images
              <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
            </label>
            <p className="mt-6 text-xs text-gray-500">
              Supported format: PNG, Max size: 10MB
            </p>
        </div>
      )}
    </motion.div>
  );
};


export default BatchUploadDropzone;
