import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  X, 
  Leaf, 
  Droplet, 
  Search, 
  FileQuestion 
} from 'lucide-react';

// Type definitions
interface HerbalOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface DetectionResult {
  name: string;
  confidence: number;
  description: string;
  benefits: string[];
}

interface MockResults {
  [key: string]: DetectionResult;
}

const HerbalDetection: React.FC = () => {
  const [selectedHerbal, setSelectedHerbal] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const herbalOptions: HerbalOption[] = [
    { value: '', label: 'Select Herbal Type', icon: <FileQuestion className="mr-2" /> },
    { value: 'kunyit', label: 'Kunyit (Turmeric)', icon: <Droplet className="mr-2 text-yellow-600" /> },
    { value: 'jahe', label: 'Jahe (Ginger)', icon: <Leaf className="mr-2 text-orange-600" /> },
    { value: 'temulawak', label: 'Temulawak', icon: <Leaf className="mr-2 text-green-700" /> },
    { value: 'daun-sirih', label: 'Daun Sirih (Betel Leaf)', icon: <Leaf className="mr-2 text-green-500" /> },
    { value: 'sambiloto', label: 'Sambiloto', icon: <Droplet className="mr-2 text-blue-600" /> }
  ];

  const mockResults: MockResults = {
    'kunyit': {
      name: 'Kunyit (Turmeric)',
      confidence: 85,
      description: 'Anti-inflammatory herb with powerful antioxidant properties.',
      benefits: ['Reduces inflammation', 'Boosts immunity', 'Supports digestive health']
    },
    'jahe': {
      name: 'Jahe (Ginger)',
      confidence: 92,
      description: 'Warming herb known for its medicinal properties.',
      benefits: ['Aids digestion', 'Reduces nausea', 'Supports circulation']
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        simulateDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateDetection = () => {
    // Randomly select a result or base on selected herbal type
    const result = selectedHerbal && mockResults[selectedHerbal] 
      ? mockResults[selectedHerbal]
      : Object.values(mockResults)[Math.floor(Math.random() * 2)];

    setDetectionResult(result);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setDetectionResult(null);
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 max-w-xl"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-6 border-2 border-green-100">
        {/* Herbal Type Select */}
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedHerbal}
              onChange={(e) => setSelectedHerbal(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500 
                         appearance-none text-green-800 font-semibold"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-green-700">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Image Preview and Detection Area */}
        <motion.div 
          className="mb-6 h-64 border-2 border-dashed border-green-200 
                     rounded-2xl flex items-center justify-center relative 
                     overflow-hidden"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {selectedImage ? (
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
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="text-center text-green-600">
              <Camera className="mx-auto mb-2 w-12 h-12 animate-pulse" />
              <p className="text-lg font-medium">Upload or Capture Herbal Image</p>
            </div>
          )}
        </motion.div>

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
          capture="environment"
          onChange={handleFileUpload}
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerFileInput}
            className="flex items-center bg-green-500 text-white px-5 py-3 
                       rounded-lg hover:bg-green-600 transition shadow-md"
          >
            <Upload className="mr-2 w-5 h-5" />
            Upload Image
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerCameraInput}
            className="flex items-center bg-green-700 text-white px-5 py-3 
                       rounded-lg hover:bg-green-800 transition shadow-md"
          >
            <Camera className="mr-2 w-5 h-5" />
            Take Photo
          </motion.button>
        </div>

        {/* Detection Result */}
        {detectionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-4"
          >
            <h3 className="text-2xl font-bold text-green-800 mb-3 flex items-center">
              <Leaf className="mr-2 text-green-600" />
              {detectionResult.name}
            </h3>
            <p className="text-green-700 mb-3">{detectionResult.description}</p>
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">Confidence:</span>
              <div className="w-full bg-green-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${detectionResult.confidence}%` }}
                ></div>
              </div>
              <span className="ml-2 text-green-800">{detectionResult.confidence}%</span>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Benefits:</h4>
              <ul className="list-disc list-inside text-green-700">
                {detectionResult.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HerbalDetection;