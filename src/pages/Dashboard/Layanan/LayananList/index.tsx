import React, { useEffect, useState } from "react";
import { CreateServiceData, Service, serviceApiClient, UpdateServiceData } from "../../../../services/Layanan/ListLayanan";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<CreateServiceData>({
    name: "",
    description: "",
    serviceCategoryId: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceApiClient.getServices();
      setServices(response);
    } catch (err) {
      setError("Failed to fetch services");
      setIsErrorModalOpen(true);
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      if (editingService) {
        setEditingService({ ...editingService, imageURL: previewUrl });
      }
    }
  };

  const handleCreateService = async () => {
    if (!newService.name.trim() || !newService.description.trim() || !selectedImage) {
      setError("All fields are required");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const serviceData: CreateServiceData = {
        ...newService,
        image: selectedImage
      };
      await serviceApiClient.createService(serviceData);
      await fetchServices();
      setSuccessMessage("Service created successfully");
      setIsSuccessModalOpen(true);
      setNewService({
        name: "",
        description: "",
        serviceCategoryId: 0
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to create service");
      setIsErrorModalOpen(true);
      console.error("Error creating service:", err);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      const updateData: UpdateServiceData = {
        id: editingService.id,
        name: editingService.name,
        description: editingService.description,
        serviceCategoryId: editingService.serviceCategoryId,
        ...(selectedImage && { image: selectedImage })
      };
      
      await serviceApiClient.updateService(updateData);
      await fetchServices();
      setSuccessMessage("Service updated successfully");
      setIsSuccessModalOpen(true);
      setEditingService(null);
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update service");
      setIsErrorModalOpen(true);
      console.error("Error updating service:", err);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (confirmDelete) {
      try {
        await serviceApiClient.deleteService(serviceId);
        await fetchServices();
        setSuccessMessage("Service deleted successfully");
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError("Failed to delete service");
        setIsErrorModalOpen(true);
        console.error("Error deleting service:", err);
      }
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="flex flex-col md:flex-row mt-24">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6  md:mt-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Service Management</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingService(null);
                  setNewService({ name: "", description: "", serviceCategoryId: 0 });
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
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

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{service.id}</td>
                      <td className="px-4 py-3">
                        <img
                          src={service.imageURL}
                          alt={service.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">{service.name}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg truncate">
                          {service.description}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        {service.serviceCategory?.name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setImagePreview(service.imageURL);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-500 hover:underline whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-500 hover:underline whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6">
                      {editingService ? "Edit Service" : "Add New Service"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2">Name</label>
                        <input
                          type="text"
                          value={editingService ? editingService.name : newService.name}
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({ ...editingService, name: e.target.value });
                            } else {
                              setNewService({ ...newService, name: e.target.value });
                            }
                          }}
                          className="border px-4 py-2 rounded-lg w-full"
                          placeholder="Enter service name"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                          value={editingService ? editingService.description : newService.description}
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({ ...editingService, description: e.target.value });
                            } else {
                              setNewService({ ...newService, description: e.target.value });
                            }
                          }}
                          className="border px-4 py-2 rounded-lg w-full h-32 resize-y"
                          placeholder="Enter service description"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Category ID</label>
                        <input
                          type="number"
                          value={editingService ? editingService.serviceCategoryId : newService.serviceCategoryId}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (editingService) {
                              setEditingService({ ...editingService, serviceCategoryId: value });
                            } else {
                              setNewService({ ...newService, serviceCategoryId: value });
                            }
                          }}
                          className="border px-4 py-2 rounded-lg w-full"
                          placeholder="Enter category ID"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="border px-4 py-2 rounded-lg w-full"
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                      <button
                        onClick={() => {
                          if (editingService) {
                            handleUpdateService();
                          } else {
                            handleCreateService();
                          }
                        }}
                        className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {editingService ? "Update" : "Create"}
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-full sm:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Success</h2>
                    <p>{successMessage}</p>
                    <button
                      onClick={() => setIsSuccessModalOpen(false)}
                      className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Modal */}
            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                    <button
                      onClick={() => setIsErrorModalOpen(false)}
                      className="mt-4 w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      OK
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

export default ServiceManagement;