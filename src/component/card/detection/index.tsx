import React, { useState, useRef, ChangeEvent, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  X, 
  Leaf, 
  Droplet, 
  Search, 
  FileQuestion,
  SwitchCamera 
} from 'lucide-react';
import { detectionService, DetectionResult, ModelType } from '../../../services/Detection';

// Type definitions (kept from original)
interface HerbalOption {
  value: ModelType | '';
  label: string;
  icon: React.ReactNode;
}

const HerbalDetection: React.FC = () => {
  const [selectedHerbal, setSelectedHerbal] = useState<ModelType | ''>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [cameraMode, setCameraMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const herbalOptions: HerbalOption[] = [
    { value: '', label: 'Select Herbal Type', icon: <FileQuestion className="mr-2" /> },
    { value: 'leaf', label: 'Daun (Leaf)', icon: <Leaf className="mr-2 text-green-500" /> },
    { value: 'fruit', label: 'Buah (Fruit)', icon: <Droplet className="mr-2 text-orange-600" /> },
    { value: 'rhizome', label: 'Rimpang (Rhizome)', icon: <Droplet className="mr-2 text-yellow-600" /> }
  ];

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Reset previous states
        setDetectionResult(null);
        setError(null);
        setIsLoading(true);

        // Read file for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        // If no herbal type selected, use first available model
        const modelType = selectedHerbal || detectionService.getModelTypes()[0];

        // Perform detection
        const result = await detectionService.createDetection({
          file,
          model: modelType as ModelType
        });

        setDetectionResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Deteksi gagal');
        setSelectedImage(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setError(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerCameraInput = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const toggleCameraMode = useCallback(() => {
    setCameraMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 sm:py-12 w-full max-w-md sm:max-w-xl"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 border-2 border-green-100">
        {/* Herbal Type Select */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <select
              value={selectedHerbal}
              onChange={(e) => setSelectedHerbal(e.target.value as ModelType | '')}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-green-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500 
                         appearance-none text-green-800 font-semibold text-sm sm:text-base"
            >
              {herbalOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value} 
                  className="flex items-center"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 text-green-700">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Image Preview and Detection Area */}
        <motion.div 
          className="mb-4 sm:mb-6 h-48 sm:h-64 border-2 border-dashed border-green-200 
                     rounded-2xl flex items-center justify-center relative 
                     overflow-hidden"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {isLoading ? (
            <div className="text-green-600 text-center">
              <div className="animate-spin mb-2">🌿</div>
              <p className="text-sm sm:text-lg font-medium">Memproses deteksi...</p>
            </div>
          ) : selectedImage ? (
            <>
              <img 
                src={selectedImage} 
                alt="Uploaded" 
                className="max-h-full max-w-full object-contain rounded-lg"
              />
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white 
                           rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          ) : (
            <div className="text-center text-green-600">
              <Camera className="mx-auto mb-2 w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
              <p className="text-sm sm:text-lg font-medium">Upload or Capture Herbal Image</p>
            </div>
          )}
        </motion.div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 mb-4 text-red-700">
            {error}
          </div>
        )}

        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileUpload}
        />
        <input 
          type="file" 
          ref={cameraInputRef}
          className="hidden" 
          accept="image/*"
          capture={cameraMode}
          onChange={handleFileUpload}
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerFileInput}
            className="flex items-center bg-green-500 text-white px-3 py-2 sm:px-5 sm:py-3 
                       rounded-lg hover:bg-green-600 transition shadow-md text-sm sm:text-base"
          >
            <Upload className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Upload
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerCameraInput}
            className="flex items-center bg-green-700 text-white px-3 py-2 sm:px-5 sm:py-3 
                       rounded-lg hover:bg-green-800 transition shadow-md 
                       relative text-sm sm:text-base"
          >
            <Camera className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Capture
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                toggleCameraMode();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-white text-green-700 
                         rounded-full p-1 shadow-md border border-green-200 w-5 h-5 sm:w-auto sm:h-auto"
              title={cameraMode === 'environment' ? 'Switch to Front Camera' : 'Switch to Back Camera'}
            >
              <SwitchCamera className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </motion.button>
        </div>

        {/* Detection Result */}
        {detectionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 sm:p-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-3 flex items-center">
              <Leaf className="mr-2 text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
              {detectionResult.label}
            </h3>
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2 text-sm sm:text-base">Confidence:</span>
              <div className="w-full bg-green-200 rounded-full h-1.5 sm:h-2.5">
                <div 
                  className="bg-green-600 h-1.5 sm:h-2.5 rounded-full" 
                  style={{ width: `${detectionResult.confidence * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-green-800 text-sm sm:text-base">
                {Math.round(detectionResult.confidence * 100)}%
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">
                Model Type: {detectionResult.model}
              </h4>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HerbalDetection;