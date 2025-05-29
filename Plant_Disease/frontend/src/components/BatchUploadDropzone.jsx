import React, { useState } from "react";
import { motion } from "framer-motion";
import BatchAnalysisResult from "./BatchAnalysisResult";

export const BatchUploadDropzone = ({ apiUrl, formFieldName, token = null, onResult = () => {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // { imageUrl, predictionData, fileName }
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
            <p className="mt-4 text-center text-gray-600">Analyzing images, please wait...</p>
          )}
        </>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-lg border-4 border-dashed border-leaf-600 bg-white/20 p-12 text-center transition-colors ${
            isDragging ? "border-leaf-800 bg-leaf-100" : ""
          }`}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="mx-auto max-w-xs space-y-1">
            <p className="text-5xl text-leaf-600">
              {/* Use any icon or image here */}
            </p>
            <p className="text-gray-700 font-semibold">Drag & Drop images here</p>
            <p className="text-gray-600 text-sm">
              or click to select files (max 10MB each)
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};


export default BatchUploadDropzone;
