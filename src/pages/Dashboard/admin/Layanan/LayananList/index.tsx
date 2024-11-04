import React, { useEffect, useState } from 'react';
import Navbar from '../../../../../component/includes/navbar';
import Sidebar from '../../../../../component/includes/sidebar';
import { layananCategoryService, ServiceCategory } from '../../../../../services/Layanan/LayananCategory';
import { CreateServiceData, layananService, Service, UpdateServiceData } from '../../../../../services/Layanan/ListLayanan';

const DashboardServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceCategoryId: '',
    image: null as File | null,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesData = await layananService.getAllServices();
      const categoriesData = await layananCategoryService.getAllServiceCategories();
      
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      }
      
      if ('ServiceCategory' in categoriesData && Array.isArray(categoriesData.ServiceCategory)) {
        setCategories(categoriesData.ServiceCategory);
      } else if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load services";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateService = async () => {
    if (!formData.name.trim() || !formData.serviceCategoryId || !formData.image) {
      setError("Please fill in all required fields");
      setIsErrorModalOpen(true);
      return;
    }

    const payload: CreateServiceData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image,
      serviceCategoryId: formData.serviceCategoryId
    };

    try {
      const response = await layananService.createService(payload);
      if (response) {
        await fetchServices();
        setSuccessMessage("Service created successfully");
        setIsSuccessModalOpen(true);
        setIsModalOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error creating service:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create service";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !formData.name.trim()) {
      setError("Service name cannot be empty");
      setIsErrorModalOpen(true);
      return;
    }

    const payload: UpdateServiceData = {
      id: editingService.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      serviceCategoryId: formData.serviceCategoryId,
      ...(formData.image && { image: formData.image })
    };

    try {
      const response = await layananService.updateService(payload);
      if (response) {
        await fetchServices();
        setSuccessMessage("Service updated successfully");
        setIsSuccessModalOpen(true);
        setIsModalOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error updating service:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update service";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {
      await layananService.deleteService(service.id);
      await fetchServices();
      setSuccessMessage("Service deleted successfully");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error deleting service:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete service";
      setError(errorMessage);
      setIsErrorModalOpen(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      serviceCategoryId: '',
      image: null
    });
    setEditingService(null);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Services</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  resetForm();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Service
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, index) => (
                    <tr key={service.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">{service.name}</td>
                      <td className="px-4 py-3">{service.description}</td>
                      <td className="px-4 py-3">
                        {categories.find(cat => cat.id === service.serviceCategoryId)?.name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setFormData({
                              name: service.name,
                              description: service.description || '',
                              serviceCategoryId: service.serviceCategoryId,
                              image: null
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service)}
                          className="ml-4 text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Service Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">
                    {editingService ? "Edit Service" : "Add Service"}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="serviceCategoryId"
                        value={formData.serviceCategoryId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                        required={!editingService}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        editingService ? handleUpdateService() : handleCreateService();
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      {editingService ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Success</h2>
                  <p className="mb-4">{successMessage}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsSuccessModalOpen(false);
                        setSuccessMessage(null);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Modal */}
            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Error</h2>
                  <p className="mb-4">{error}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsErrorModalOpen(false);
                        setError(null);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardServicePage;