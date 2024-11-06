import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';

const Detection = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check camera permission when component mounts
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch (err) {
      console.error("Camera permission error:", err);
      setError("Camera access denied. Please check your browser permissions.");
      return false;
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          console.log('Video is playing');
        };
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      setError("Failed to start camera. Please check your permissions and try again.");
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const image = canvas.toDataURL('image/jpeg');
        setImageSrc(image);
        setIsCapturing(false);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Image Detection</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        {isCapturing ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover border border-red-500" 
          />
        ) : imageSrc ? (
          <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={isCapturing ? captureImage : startCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
        >
          {isCapturing ? 'Capture' : 'Start Camera'}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full sm:w-auto"
        >
          Upload File
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Detection;