import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  Star, 
  Heart,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Product, productService } from '../../services/product/product.service';

// Enhanced Error Boundary Component
class ProductErrorBoundary extends React.Component<{children: React.ReactNode}, { hasError: boolean }> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500 mr-2" size={32} />
              <h2 className="text-xl font-bold text-red-700">Terjadi Kesalahan</h2>
            </div>
            <p className="text-red-600 mb-4">
              Maaf, terjadi kesalahan saat memuat halaman produk. 
              Silakan coba lagi atau hubungi dukungan teknis.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Loading Skeleton
const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div>
        <div className="h-[500px] bg-gray-200 rounded-2xl mb-4"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        if (!id) {
          throw new Error('ID Produk tidak ditemukan');
        }
        const fetchedProduct = await productService.getProductById(Number(id));
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          throw new Error('Produk tidak ditemukan');
        }
        setLoading(false);
      } catch (err) {
        console.error('Gagal mengambil detail produk', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat detail produk. Silakan coba lagi nanti.');
        setLoading(false);
        toast.error('Gagal memuat produk', {
          description: 'Silakan periksa koneksi internet Anda.'
        });
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
      const newQuantity = Math.max(1, Math.min(prev + change, 10));
      toast.info(`Kuantitas diubah menjadi ${newQuantity}`, {
        position: 'bottom-right'
      });
      return newQuantity;
    });
  };

  const handlePesanSekarang = () => {
    if (product) {
      const pesananUrl = `/pesan?productId=${product.id}&quantity=${quantity}`;
      navigate(pesananUrl);
    }
  };

  const handleShareProduct = () => {
    if (product) {
      const shareData = {
        title: product.name,
        text: `Lihat produk keren ini: ${product.name}`,
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Tautan produk disalin ke clipboard', {
          description: 'Anda dapat membagikan tautan sekarang.'
        });
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    toast[isFavorite ? 'info' : 'success'](
      isFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit', 
      {
        position: 'top-right',
        icon: <Heart className={isFavorite ? 'text-gray-500' : 'text-red-500'} />
      }
    );
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500 mr-2" size={32} />
            <h2 className="text-xl font-bold text-red-700">Produk Tidak Ditemukan</h2>
          </div>
          <p className="text-red-600 mb-4">{error || 'Produk yang Anda cari tidak tersedia.'}</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductErrorBoundary>
      <div className="container mx-auto px-4 py-12">
        {/* First Section: Image and Product Info Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <button 
                onClick={() => navigate('/products')}
                className="flex items-center text-gray-700 hover:text-blue-600 transition"
                aria-label="Kembali ke Daftar Produk"
              >
                <ArrowLeft size={24} className="mr-2" /> Kembali
              </button>
              <div className="flex space-x-4">
                <motion.button
                  onClick={toggleFavorite}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  className={`p-2 rounded-full transition ${
                    isFavorite 
                      ? 'bg-red-100 text-red-500' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                  onClick={handleShareProduct}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Bagikan Produk"
                  className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200"
                >
                  <Share2 />
                </motion.button>
              </div>
            </div>
            <AnimatePresence>
              {!imageLoaded && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl"
                />
              )}
            </AnimatePresence>
            <motion.img 
              src={`${process.env.REACT_APP_API_URL}${product.image}`}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-full rounded-2xl shadow-lg object-cover h-[500px] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-4">
                Rp {product.price.toLocaleString()}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={handlePesanSekarang}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition group"
              >
                <Send size={20} className="mr-2 group-hover:animate-bounce" /> 
                Pesan {quantity} Sekarang
              </motion.button>
            </div>
          </div>
        </div>

        {/* Second Section: Detailed Product Information in Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detail Produk</h2>
            {[
              { label: 'Nama Latin', value: product.latin_name },
              { label: 'Sinonim', value: product.synonym },
              { label: 'Familia', value: product.familia },
              { label: 'Bagian yang Digunakan', value: product.part_used },
              { label: 'Metode Reproduksi', value: product.method_of_reproduction },
              { label: 'Umur Panen', value: product.harvest_age }
            ].map((detail, index) => (
              detail.value && (
                <div 
                  key={index} 
                  className="border-b border-gray-200 pb-3 mb-3 last:border-b-0"
                >
                  <strong className="text-gray-700 block mb-1">{detail.label}:</strong>
                  <p className="text-gray-600">{detail.value}</p>
                </div>
              )
            ))}
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informasi Tambahan</h2>
            {[
              { label: 'Morfologi', value: product.morphology },
              { label: 'Nama Area', value: product.area_name },
              { label: 'Efektivitas', value: product.efficacy },
              { label: 'Utilisasi', value: product.utilization },
              { label: 'Komposisi', value: product.composition },
              { label: 'Hasil Penelitian', value: product.research_results }
            ].map((detail, index) => (
              detail.value && (
                <div 
                  key={index} 
                  className="border-b border-gray-200 pb-3 mb-3 last:border-b-0"
                >
                  <strong className="text-gray-700 block mb-1">{detail.label}:</strong>
                  <p className="text-gray-600">{detail.value}</p>
                </div>
              )
            ))}
          </div>

          {/* Full Width Description */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Deskripsi Produk</h2>
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>
        </div>
      </div>
    </ProductErrorBoundary>
  );
};

export default ProductDetail;