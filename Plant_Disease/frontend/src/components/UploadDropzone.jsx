import { useState } from 'react';
import { Image, Upload, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import PlantAnalysisResult from './PlantAnalysisResult';

const UploadDropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast("Unsupported File", "Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast("File Too Large", "Please upload an image smaller than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setSelectedImage(event.target.result);
        simulateAnalysis();
      }
    };
    reader.readAsDataURL(file);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
  };

  if (analysisComplete && selectedImage) {
    return <PlantAnalysisResult imageUrl={selectedImage} onReset={resetAnalysis} />;
  }

  return (
    <motion.div
      className="w-full rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 
          bg-white/80 backdrop-blur-sm 
          ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"} 
          ${isAnalyzing ? "opacity-75" : "hover:bg-green-50/50"}
        `}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-medium mb-2">Analyzing your plant...</h3>
            <p className="text-gray-500">Our AI is examining the image for signs of disease</p>
          </div>
        ) : selectedImage ? (
          <div className="w-full">
            <img
              src={selectedImage}
              alt="Selected plant"
              className="max-h-80 mx-auto rounded-lg object-contain"
            />
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Drop your plant photo here</h3>
            <p className="text-gray-500 mb-6">Drag and drop or click to upload</p>
            <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg cursor-pointer transition-all transform hover:scale-105 flex items-center">
              <ArrowUp className="w-4 h-4 mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="mt-6 text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF • Max size: 10MB
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UploadDropzone;
