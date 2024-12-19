import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  Heart,
  Share2,
  AlertTriangle,
  Store,
  MapPin,
  Globe,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Product, productService } from '../../services/product/product.service';
import { JamuCenter, jamuCenterService } from '../../services/central';
import Navbar from '../../component/navbar';
import Footer from '../../component/footer';

const ProductDetailSkeleton = memo(() => (
  <div className="container mx-auto px-4 py-8 lg:py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 animate-pulse">
      <div>
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded-2xl mb-4"></div>
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
));
type RenderFunction = (value: string | undefined) => React.ReactNode;

interface DetailItem {
  label: string;
  value: string | undefined;
  render?: RenderFunction;
}
const ProductDetail: React.FC = memo(() => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [jamuCenters, setJamuCenters] = useState<JamuCenter[]>([]);
  const [selectedJamuCenter, setSelectedJamuCenter] = useState<JamuCenter | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('ID Produk tidak ditemukan');
        }
        const [fetchedProduct, fetchedJamuCenters] = await Promise.all([
          productService.getProductById(Number(id)),
          jamuCenterService.getJamuCenters()
        ]);
        
        setProduct(fetchedProduct ?? null);
        setJamuCenters(fetchedJamuCenters);
        setLoading(false);
      } catch (err) {
        console.error('Gagal mengambil data', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data');
        setLoading(false);
        toast.error('Gagal memuat data', {
          description: 'Silakan periksa koneksi internet Anda.',
          duration: 3000
        });
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
      const newQuantity = Math.max(1, Math.min(prev + change, 10));
      toast.info(`Kuantitas diubah menjadi ${newQuantity}`, {
        position: 'bottom-right',
        duration: 1500
      });
      return newQuantity;
    });
  };

  const handlePesanSekarang = () => {
    if (!selectedJamuCenter) {
      toast.error('Pilih Jamu Center terlebih dahulu', {
        description: 'Silakan pilih Jamu Center untuk melanjutkan pemesanan.',
        duration: 3000
      });
      return;
    }

    window.open(selectedJamuCenter.link_website, '_blank');
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
          description: 'Anda dapat membagikan tautan sekarang.',
          duration: 2000
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
        duration: 1500,
        icon: <Heart className={isFavorite ? 'text-gray-500' : 'text-red-500'} />
      }
    );
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 md:p-6 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500 mr-2" size={28} />
            <h2 className="text-lg md:text-xl font-bold text-red-700">Produk Tidak Ditemukan</h2>
          </div>
          <p className="text-red-600 mb-4 text-sm md:text-base">{error || 'Produk yang Anda cari tidak tersedia.'}</p>
          <button 
            onClick={() => navigate('/products')}
            className="w-full md:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          >
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }
  const productDetails: DetailItem[] = [
    { label: 'Nama Latin', value: product.latin_name },
    { label: 'Sinonim', value: product.synonym },
    { label: 'Familia', value: product.familia },
    { label: 'Bagian yang Digunakan', value: product.part_used },
    { label: 'Metode Reproduksi', value: product.method_of_reproduction },
    { label: 'Umur Panen', value: product.harvest_age }
  ];

  const additionalInfo: DetailItem[] = [
    { label: 'Morfologi', value: product.morphology },
    { label: 'Nama Area', value: product.area_name },
    { label: 'Efektivitas', value: product.efficacy },
    { label: 'Utilisasi', 
      value: product.utilization,
      render: (value: string | undefined) => {
        if (!value) return null;
        
        const items = value
          .split(',')
          .map((item: string) => item.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
        
        return (
          <ul className="list-disc pl-4 space-y-1">
            {items.map((item: string, idx: number) => (
              <li key={idx} className="text-base text-gray-600">{item}</li>
            ))}
          </ul>
        );
      }
    },
    { 
      label: 'Komposisi',
      value: product.composition,
      render: (value: string | undefined) => {
        if (!value) return null;
        
        const items = value
          .split(',')
          .map((item: string) => item.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
        
        return (
          <ul className="list-disc pl-4 space-y-1">
            {items.map((item: string, idx: number) => (
              <li key={idx} className="text-base text-gray-600">{item}</li>
            ))}
          </ul>
        );
      }
    },
    { 
      label: 'Hasil Penelitian',
      value: product.research_results,
      render: (value: string | undefined) => {
        if (!value) return null;
        
        const links = value.split(',').map((url: string) => url.trim());
        return (
          <div className="space-y-2">
            {links.map((url: string, idx: number) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm group"
              >
                <span className="mr-1">Lihat penelitian {idx + 1}</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </a>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow mt-10">
        <div className="container mx-auto px-4 py-6 lg:py-12">
          {/* Breadcrumb Navigation */}
          <button 
            onClick={() => navigate('/product')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Kembali ke Daftar Produk
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-white p-6 rounded-2xl shadow-sm">
            {/* Product Image */}
            <div className="relative">
              <AnimatePresence>
                {!imageLoaded && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl"
                  />
                )}
              </AnimatePresence>
              <motion.img 
                src={`${process.env.REACT_APP_API_URL}${product.image}`}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-start space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 italic">{product.latin_name}</p>
              </div>
              
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                Rp {product.price.toLocaleString('id-ID')}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kuantitas</label>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 text-lg font-medium"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 text-lg font-medium"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Jamu Center Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Pilih Jamu Center untuk Pemesanan
                </label>
                <div className="relative">
                  <select
                    value={selectedJamuCenter?.id || ''}
                    onChange={(e) => {
                      const center = jamuCenters.find(c => c.id === Number(e.target.value));
                      setSelectedJamuCenter(center || null);
                    }}
                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                  >
                    <option value="">Pilih Jamu Center</option>
                    {jamuCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                  <Store className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Selected Jamu Center Info */}
              {selectedJamuCenter && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-900">{selectedJamuCenter.name}</h3>
                  {/* <p className="text-sm text-blue-800">{selectedJamuCenter.description}</p> */}
                  <div className="space-y-2">
                    <div className="flex items-start text-blue-800 text-sm">
                      <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                      <span>{selectedJamuCenter.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: MapPin, label: 'Lihat di Maps', link: selectedJamuCenter.link_maps },
                        { icon: Globe, label: 'Website', link: selectedJamuCenter.link_website },
                        { icon: Facebook, label: 'Facebook', link: selectedJamuCenter.link_facebook }
                      ].map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-700 hover:text-blue-900 text-sm bg-white px-3 py-1.5 rounded-full border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          <item.icon size={14} className="mr-1.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <motion.button
                  onClick={handlePesanSekarang}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition group disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
                  disabled={!selectedJamuCenter}
                >
                  <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform" /> 
                  {selectedJamuCenter 
                    ? `Pesan ${quantity} di ${selectedJamuCenter.name}`
                    : 'Pilih Jamu Center untuk Memesan'}
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={toggleFavorite}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    <Heart 
                      size={18} 
                      className={`mr-2 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                    <span className="hidden sm:inline">{isFavorite ? 'Favorit' : 'Tambah ke Favorit'}</span>
                    <span className="sm:hidden">Favorit</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleShareProduct}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                      <Share2 size={18} className="mr-2 text-gray-400" />
                      <span className="hidden sm:inline">Bagikan</span>
                      <span className="sm:hidden">Share</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Product Details Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
          {/* Product Details Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
              Detail Produk
            </h2>
            {productDetails.map((detail, index) => (
              detail.value && (
                <div 
                  key={index} 
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <strong className="text-sm font-semibold text-gray-800 block mb-1">
                    {detail.label}
                  </strong>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {detail.value}
                  </p>
                </div>
              )
            ))}
          </div>
  
              {/* Additional Information Column */}
              <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
              Informasi Tambahan
            </h2>
            {additionalInfo.map((detail, index) => (
              detail.value && (
                <div 
                  key={index} 
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <strong className="text-sm font-semibold text-gray-800 block mb-2">
                    {detail.label}
                  </strong>
                  {detail.render ? 
                    detail.render(detail.value) : 
                    <p className="text-base text-gray-600 leading-relaxed">
                      {detail.value}
                    </p>
                  }
                </div>
              )
            ))}
          </div>
  
              {/* Full Width Description */}
              <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                  Deskripsi Produk
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  });
  
  export default ProductDetail;