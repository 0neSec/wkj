import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Loader, ImageIcon, SwitchCamera } from "lucide-react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

import { DetectionResult, detectionService, ModelType } from "../services/Detection";
import { Product, productService } from "../services/product/product.service";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

interface Category {
  value: ModelType;
  label: string;
}

function ImageDetection() {
  const navigate = useNavigate();
  // States
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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
    { value: "rhizome", label: "Rimpang" },
    { value: "fruit", label: "Buah" },
    { value: "leaf", label: "Daun" },
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
      setVideoDevices(videoInputDevices);
      
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

  // Camera toggle method
  const toggleCamera = () => {
    setUseCamera(!useCamera);
    if (!useCamera) {
      setShowWebcam(true);
      setCapturedImage(null);
      setImageFile(null);
      setDetectionResult(null);
      setRelatedProducts([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        detectionService.validateFile(file);
        setImageFile(file);
        setCapturedImage(null);
        setError("");
        setDetectionResult(null);
        setRelatedProducts([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error validating file");
        setImageFile(null);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                >
                  <X size={18} />
                </button>
                <div className="rounded-lg overflow-hidden shadow-md">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-auto"
                    />
                  ) : (
                    imageFile && (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Uploaded"
                        className="w-full h-auto"
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

      <Footer />
    </div>
  );
}

export default ImageDetection;