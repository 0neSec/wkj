import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Loader, ImageIcon, SwitchCamera, AlertTriangle, Leaf } from "lucide-react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from "framer-motion";
import { DetectionResult, detectionService, ModelType } from "../services/Detection";
import { Product, productService } from "../services/product/product.service";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

// Error Fallback Component
function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert" className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="text-red-500" size={48} />
      </div>
      <p className="text-red-600 font-bold mb-2">Terjadi Kesalahan</p>
      <p className="text-red-500 mb-4">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Coba Lagi
      </button>
    </div>
  );
}

interface Category {
  value: ModelType;
  label: string;
  description?: string;
}

function ImageDetection() {
  const navigate = useNavigate();
  
  // States
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints>({
    facingMode: { ideal: "environment" } // Prioritize back camera
  });

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = [
    { 
      value: "rhizome", 
      label: "Rimpang", 
      description: "Deteksi tanaman dengan fokus pada rimpang" 
    },
    { 
      value: "fruit", 
      label: "Buah", 
      description: "Deteksi dan identifikasi berbagai jenis buah" 
    },
    { 
      value: "leaf", 
      label: "Daun", 
      description: "Analisis dan pengenalan jenis daun" 
    },
  ];

  // Helper Functions
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Get available video input devices
  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoInputDevices.length === 0) {
        setCameraError("Tidak ada kamera yang tersedia");
        return;
      }

      setVideoDevices(videoInputDevices);
      setCameraError(null);
      
      // Set initial camera constraints based on available devices
      if (videoInputDevices.length > 0) {
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );

        setVideoConstraints({
          deviceId: { 
            ideal: backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId 
          }
        });
      }
    } catch (err) {
      console.error("Error accessing camera devices:", err);
      setCameraError("Gagal mengakses kamera. Pastikan izin kamera diaktifkan.");
    }
  };

  // Switch between cameras
  const switchCamera = () => {
    if (videoDevices.length > 1) {
      const nextIndex = (currentCameraIndex + 1) % videoDevices.length;
      setCurrentCameraIndex(nextIndex);
      setVideoConstraints({
        deviceId: { ideal: videoDevices[nextIndex].deviceId }
      });
    }
  };

  // Use effect to get video devices when camera is activated
  useEffect(() => {
    if (useCamera) {
      getVideoDevices();
    }
  }, [useCamera]);

  // Modified handleSubmit with direct navigation
  const handleSubmit = async () => {
    if (!selectedCategory) {
      setError("Silakan pilih kategori terlebih dahulu");
      return;
    }

    if (!imageFile) {
      setError("Silakan pilih atau ambil gambar terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setRelatedProducts([]);

    try {
      // Get detection result
      const result = await detectionService.createDetection({
        file: imageFile,
        model: selectedCategory as ModelType,
      });

      if (result) {
        setDetectionResult(result);
        // Navigate directly using the label from the result
        navigate(`/layanan/produk-layanan/${result.label}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memproses gambar. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // More comprehensive file validation
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          throw new Error("Format gambar tidak didukung. Gunakan JPEG atau PNG.");
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error("Ukuran gambar terlalu besar. Maksimal 10MB.");
        }

        detectionService.validateFile(file);
        setImageFile(file);
        setCapturedImage(URL.createObjectURL(file));
        setError("");
        setDetectionResult(null);
        setRelatedProducts([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error validating file");
        setImageFile(null);
        setCapturedImage(null);
      }
    }
  };

  // Camera toggle method
  const toggleCamera = () => {
    setUseCamera(!useCamera);
    if (!useCamera) {
      setShowWebcam(true);
      setCapturedImage(null);
      setImageFile(null);
      setDetectionResult(null);
      setRelatedProducts([]);
      setCameraError(null);
    } else {
      setShowWebcam(false);
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        const file = dataURLtoFile(imageSrc, "captured-image.jpg");
        setImageFile(file);
        setError("");
        setShowWebcam(false);
        setDetectionResult(null);
        setRelatedProducts([]);
      }
    }
  };

  const resetImage = () => {
    setCapturedImage(null);
    setImageFile(null);
    setError("");
    setShowWebcam(true);
    setDetectionResult(null);
    setRelatedProducts([]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        setError("");
        setCapturedImage(null);
        setImageFile(null);
      }}
    >
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />


        <main className="flex-grow container mx-auto px-4 py-8 mt-20 md:mt-16 lg:mt-12">
        <div className="flex items-center justify-center mb-8 relative">
        <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-grow h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-full mx-4"
          ></motion.span>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-green-100 p-3 rounded-full shadow-md"
          >
            <Leaf className="text-green-800 w-6 h-6" />
          </motion.div>

          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-grow h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-full mx-4"
          ></motion.span>
        </div>

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-800 tracking-wide text-center"
        >
          Identifikasi Tanaman
        </motion.h2>
          <div className="max-w-xl lg:max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 mt-10 ">
            {/* Header with centered icon */}
            
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <ImageIcon size={48} className="text-blue-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Deteksi Gambar</h1>
              <p className="text-gray-600 mt-2">
                Unggah atau ambil gambar untuk deteksi
              </p>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Pilih kategori deteksi"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih kategori</option>
                {categories.map((category) => (
                  <option 
                    key={category.value} 
                    value={category.value}
                    aria-describedby={`category-description-${category.value}`}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
              {/* Hidden descriptions for screen readers */}
              {categories.map((category) => (
                <span 
                  key={`description-${category.value}`} 
                  id={`category-description-${category.value}`} 
                  className="sr-only"
                >
                  {category.description}
                </span>
              ))}
            </div>

            {/* Camera Error Display */}
            {cameraError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <p className="text-red-600 text-sm">{cameraError}</p>
              </div>
            )}

            {/* General Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Camera/Upload Controls */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={toggleCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${useCamera ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                {useCamera ? (
                  <>
                    <X size={18} /> Matikan Kamera
                  </>
                ) : (
                  <>
                    <Camera size={18} /> Gunakan Kamera
                  </>
                )}
              </button>

              {!useCamera && (
                <div className="relative">
                  <button
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={18} />
                    Unggah Gambar
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Webcam Display */}
            {useCamera && showWebcam && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full"
                  />
                  {videoDevices.length > 1 && (
                    <button
                      onClick={switchCamera}
                      className="absolute top-2 right-2 p-2 bg-white/50 rounded-full hover:bg-white/75 transition-colors"
                      aria-label="Ganti Kamera"
                    >
                      <SwitchCamera size={24} className="text-gray-800" />
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={captureImage}
                    className="flex-grow px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Ambil Gambar
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview and Process Button */}
            {(capturedImage || imageFile) && (
              <div className="space-y-4">
                <div className="relative">
                  <button
                    onClick={resetImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    aria-label="Hapus Gambar"
                  >
                    <X size={18} />
                  </button>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Pratinjau Gambar"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      imageFile && (
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Gambar Unggahan"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Memproses...
                    </>
                  ) : (
                    "Proses Gambar"
                  )}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
              <Loader className="animate-spin text-blue-500" size={32} />
              <p className="text-gray-800 font-medium">Sedang memproses gambar...</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default ImageDetection;