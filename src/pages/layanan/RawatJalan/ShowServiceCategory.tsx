import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Service, serviceApiClient } from '../../../services/Layanan/ListLayanan';

interface RawatJalanServicesProps {
  categoryId: number;
}

const RawatJalanServices: React.FC<RawatJalanServicesProps> = ({ categoryId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const servicesData = await serviceApiClient.getServiceByCategory(categoryId);
        setServices(servicesData);
        console.log(servicesData);
        
      } catch (err) {
        setError("Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  // Function to render description with paragraphs
  const renderDescription = (description: string) => {
    return description.split('\n').map((paragraph, index) => (
      <p key={index} className="text-gray-700 mb-4 last:mb-0">
        {paragraph.trim()}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

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
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {services.map((service) => (
          <div key={service.id} className="border-b pb-6 last:border-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {service.name}
            </h2>
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={`${process.env.REACT_APP_API_URL}${service.image_url}`}
                alt={service.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div className="prose prose-lg max-w-none">
              {renderDescription(service.description)}
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-4">
              <Calendar size={18} aria-hidden="true" />
              <span>
                {new Date(service.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No services available in this category yet.
          </p>
        )}
      </div>
    </article>
  );
};

export default RawatJalanServices;