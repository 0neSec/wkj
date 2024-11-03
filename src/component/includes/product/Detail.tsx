import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import {
  Product,
  productService,
} from "../../../services/product/product.service";

interface CompositionObject {
  values: string[];
}

interface UtilizationObject {
  values: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        console.log("Fetching product with ID:", id);
        const productData = await productService.getProduct(id);
        if (productData) {
          if (
            productData.composition &&
            typeof productData.composition === "object" &&
            !Array.isArray(productData.composition) &&
            "values" in productData.composition
          ) {
            const compositionObj = productData.composition as CompositionObject;
            productData.composition = compositionObj.values;
          }

          if (
            productData.utilization &&
            typeof productData.utilization === "object" &&
            !Array.isArray(productData.utilization) &&
            "values" in productData.utilization
          ) {
            const utilizationObj = productData.utilization as UtilizationObject;
            productData.utilization = utilizationObj.values;
          }

          setProduct(productData);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const renderComposition = () => {
    if (!product?.composition)
      return <li>No composition information available.</li>;

    const compositionArray = Array.isArray(product.composition)
      ? product.composition
      : [];

    return compositionArray.map((use: string, index: number) => (
      <li key={index}>{use}</li>
    ));
  };

  const renderUtilization = () => {
    if (!product?.utilization) return <li>No usage information available.</li>;

    const utilizationArray = Array.isArray(product.utilization)
      ? product.utilization
      : [];

    return utilizationArray.map((use: string, index: number) => (
      <li key={index}>{use}</li>
    ));
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return !isNaN(numericPrice)
      ? `Rp ${numericPrice.toLocaleString()}`
      : "Price not available";
  };

  const handleSendWhatsApp = () => {
    if (!product) return;

    const totalPrice = 
      (typeof product.price === "string" 
        ? parseFloat(product.price) 
        : product.price) * quantity;
    
    const message = `Halo, saya tertarik dengan produk:\n\nNama: ${
      product.name
    }\nHarga: ${formatPrice(product.price)}\nJumlah: ${quantity}\nTotal: ${formatPrice(
      totalPrice
    )}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '+6282130001643'; // Replace with your WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    console.log(whatsappNumber);
    
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h2>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 md:h-full relative">
                <img
                  src={`${process.env.REACT_APP_API_URL}${product.image_url}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="mb-2">
                <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {product.product_category_id}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="text-2xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deskripsi Produk
                </h3>
                <p>{product.description}</p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSendWhatsApp}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Pesan via WhatsApp
              </button>
            </div>
          </div>
        </div>
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Informasi Product
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detail
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>Area: {product.area_name}</li>
                <li>Familia: {product.familia}</li>
                <li>Nama Latin: {product.latin_name}</li>
                <li>Bagian yang Digunakan: {product.part_used}</li>
                <li>Metode Reproduksi: {product.method_of_reproduction}</li>
                <li>Umur Panen: {product.harvest_age}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manfaat dan Penggunaan
              </h3>
              <div className="text-gray-600">
                <h4 className="font-medium mb-1">Khasiat:</h4>
                <p className="mb-3">{product.efficacy}</p>

                <h4 className="font-medium mb-1">Penggunaan:</h4>
                <ul className="list-disc pl-5 mb-3">{renderUtilization()}</ul>

                {product.composition && product.composition.length > 0 && (
                  <>
                    <h4 className="font-medium mb-1">Komposisi:</h4>
                    <ul className="list-disc pl-5">{renderComposition()}</ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;