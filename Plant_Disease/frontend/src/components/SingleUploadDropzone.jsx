import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image, Upload, ArrowUp } from "lucide-react";
import SingleAnalysisResult from "./SingleAnalysisResult";

export const SingleUploadDropzone = ({ apiUrl, formFieldName, token = null, onResult = () => {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
    processFile(files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Unsupported File", "Please upload image files only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("File Too Large", "Please upload images smaller than 10MB.");
      return;
    }

    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        setSelectedImage({ imageUrl: event.target.result, predictionData: null, fileName: file.name });
      }
    };
    reader.readAsDataURL(file);

    analyzeImage(file)
      .then((predictionData) => {
        setSelectedImage((prev) => ({
          ...prev,
          predictionData: predictionData.result,
          predictionId: predictionData.prediction_id,
        }));
        onResult(predictionData);
      })
      .catch(() => {
        toast("Analysis Failed", "Unable to analyze image.");
        setSelectedImage(null);
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };

  const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append(formFieldName, file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) throw new Error("Failed to analyze image");

    const data = await response.json();
    return data;
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
  };

  return (
    <motion.div
      className="w-full h-full flex-col rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {selectedImage ? (
        <>
<SingleAnalysisResult
  analysis={selectedImage}
  onReset={resetAnalysis}
/>
          {isAnalyzing && (
            <div className="flex flex-col items-center py-8 h-full">
              <div className="w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-medium mb-2">Analyzing your plant...</h3>
              <p className="text-gray-500">Our AI is examining the image for signs of disease</p>
            </div>
          )}
        </>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 
           bg-white/80 backdrop-blur-sm h-full ${isDragging ? "border-leaf-800 bg-leaf-100" : ""}`}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Image className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">Drop your plant photo here</h3>
          <p className="text-gray-500 mb-6">Drag and drop or click to upload</p>
          <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg cursor-pointer transition-all transform hover:scale-105 flex items-center">
            <ArrowUp className="w-4 h-4 mr-2" />
            Upload Image
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple={false}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          <p className="mt-6 text-xs text-gray-500">
            Supported format: JPG 224x224, Max size: 10MB
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SingleUploadDropzone;
