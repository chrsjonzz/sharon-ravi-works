import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';

interface UploadHandlerProps {
  onFileUpload: (file: File) => void;
}

const UploadHandler = ({ onFileUpload }: UploadHandlerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  // Process the dropped or selected file
  const processFile = useCallback((file: File) => {
    setUploadError(null);
    setUploadProgress(0);
    
    // Validate file type
    const validAudioTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    const validVideoTypes = ['video/mp4', 'video/webm'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validTypes = [...validAudioTypes, ...validVideoTypes, ...validImageTypes];
    
    if (!validTypes.includes(file.type)) {
      setUploadError(`Unsupported file type: ${file.type}. Please upload audio (WAV, MP3), video (MP4, WebM), or images (JPG, PNG).`);
      setUploadProgress(null);
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onFileUpload(file);
        setUploadProgress(null);
      }
    }, 200);
  }, [onFileUpload]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  // Handle file selection via button
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="bg-gradient-to-r from-gray-900/80 to-indigo-900/50 backdrop-blur-sm rounded-xl p-8 border border-indigo-800/30 shadow-xl">
      <div 
        className={`border-2 border-dashed ${isDragging ? 'border-indigo-400 bg-indigo-900/20' : 'border-indigo-500/50'} rounded-xl p-12 transition-all hover:border-indigo-400 group`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaUpload className="text-5xl mx-auto text-indigo-400 group-hover:text-indigo-300 transition-colors" />
        <h3 className="text-xl font-semibold mt-4 text-center">Drag and drop files here</h3>
        <p className="text-gray-400 mt-2 text-center">or</p>
        <div className="flex justify-center">
          <motion.button
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFileSelect}
          >
            Browse Files
          </motion.button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileInputChange}
            accept="audio/wav,audio/mpeg,audio/mp3,video/mp4,video/webm,image/jpeg,image/png,image/jpg"
          />
        </div>
        <p className="text-gray-400 mt-6 max-w-md mx-auto text-center">Supports high-quality audio (WAV, MP3), video (MP4, WebM), and images (JPG, PNG) to showcase your creative work in the best possible quality</p>
        
        {uploadProgress !== null && (
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-indigo-300 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
        
        {uploadError && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-center">{uploadError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadHandler;
