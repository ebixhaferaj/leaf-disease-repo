
import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import UploadDropzone from './UploadDropzone';

const Hero = () => {
  const [showUpload, setShowUpload] = useState(false);
  
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-leaf-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-leaf-200 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="text-center max-w-3xl mx-auto mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-10 bg-white rounded-full flex items-center justify-center text-white font-bold text-sm">
            <img src="/images/logo_no_name.png" alt="Logo" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Turn every leaf into insight
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-8"
        >
          Upload a plant photo, and our AI instantly spots diseases and suggests treatments — no sign-up required.
        </motion.p>
        
        {!showUpload && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => setShowUpload(true)}
            className="bg-leaf-600 hover:bg-leaf-700 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Try it now
          </motion.button>
        )}
      </div>
      
      {showUpload && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <UploadDropzone  
            apiUrl="http://localhost:8000/guest-predict" 
            formFieldName="file" />
        </motion.div>
      )}
    </section>
  );
};

export default Hero;