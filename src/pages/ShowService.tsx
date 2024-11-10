import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Share2 } from "lucide-react";
import { ServiceCategoryContent, serviceCategoryService } from "../services/Layanan/LayananCategory";
import { Service, serviceApiClient } from "../services/Layanan/ListLayanan";
import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";


// Skeleton component for loading states
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Service content formatter component
const ServiceFormatter = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];
  let inList = false;
  
  const finishList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc ml-6 mb-4">
          {currentList}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      finishList();
      return;
    }
    
    const listMatch = trimmedLine.match(/^(\d+\.|-)(.+)/);
    
    if (listMatch) {
      const [, , content] = listMatch;
      inList = true;
      
      currentList.push(
        <li key={index} className="mb-2">
          {content.trim()}
        </li>
      );
    } else {
      finishList();
      elements.push(
        <p key={index} className="mb-4 text-gray-700">
          {trimmedLine}
        </p>
      );
    }
  });
  
  finishList();
  
  return <div className="prose prose-lg max-w-none">{elements}</div>;
};

const ShowServiceCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<ServiceCategoryContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Category ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const [categoryData, servicesData] = await Promise.all([
          serviceCategoryService.getServiceCategoryById(parseInt(id)),
          serviceApiClient.getServices()
        ]);

        if (categoryData) {
          setCategory(categoryData);
          const filteredServices = servicesData.filter(
            service => service.service_category_id === categoryData.id
          );
          setServices(filteredServices);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        setError("Failed to load category and services");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: category?.name || "",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 py-8 mt-10">
        {/* Category Header */}
        <header className="mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                  Medical Services
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  onClick={handleShare}
                  aria-label="Share category"
                >
                  <Share2 size={20} />
                  {showShareTooltip && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                      URL Copied!
                    </span>
                  )}
                </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={18} aria-hidden="true" />
                  <span>
                    {new Date(category?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Services List */}
        <div className="prose prose-lg max-w-none">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-11/12 mb-4" />
              <Skeleton className="h-6 w-10/12 mb-4" />
            </>
          ) : (
            <div className="space-y-8">
              {services.map((service) => (
                <div key={service.id} className="border-b pb-6 last:border-0">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {service.name}
                  </h2>
                  {service.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`${process.env.REACT_APP_API_URL}${service.image_url}`}
                        alt={service.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <ServiceFormatter content={service.description} />
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No services available in this category yet.
                </p>
              )}
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ShowServiceCategory;