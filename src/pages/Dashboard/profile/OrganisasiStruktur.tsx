import React, { useEffect, useState } from "react";

import Navbar from "../../../component/includes/navbar";
import Sidebar from "../../../component/includes/sidebar";
import { OrganizationStructureContent, organizationStructureService, UpdateOrganizationStructureData } from "../../../services/Tentang/StrukturOrganisasi";

const OrganizationStructureManagement = () => {
  const [structures, setStructures] = useState<OrganizationStructureContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<OrganizationStructureContent | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Data Fetching
  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await organizationStructureService.getOrganizationStructures();
      setStructures(response);
    } catch (err) {
      showError("Failed to fetch organization structures");
      console.error("Error fetching organization structures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  // Utility Functions
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingStructure(null);
    setIsModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        showError("Please select an image file");
        event.target.value = '';
      }
    }
  };

  const handleCreateStructure = async () => {
    if (!selectedFile) {
      showError("Please select an image");
      return;
    }

    try {
      await organizationStructureService.createOrganizationStructure({
        image_url: selectedFile
      });
      await fetchStructures();
      showSuccess("Organization structure created successfully");
      resetForm();
    } catch (err) {
      showError("Failed to create organization structure");
      console.error("Error creating organization structure:", err);
    }
  };

  const handleUpdateStructure = async () => {
    if (!editingStructure) return;

    try {
      const updatedData: UpdateOrganizationStructureData = {
        id: editingStructure.id,
        image_url: selectedFile || undefined
      };
      await organizationStructureService.updateOrganizationStructure(updatedData);
      await fetchStructures();
      showSuccess("Organization structure updated successfully");
      resetForm();
    } catch (err) {
      showError("Failed to update organization structure");
      console.error("Error updating organization structure:", err);
    }
  };

  const handleDeleteStructure = async (structureId: number) => {
    if (!window.confirm("Are you sure you want to delete this organization structure?")) return;

    try {
      await organizationStructureService.deleteOrganizationStructure(structureId);
      await fetchStructures();
      showSuccess("Organization structure deleted successfully");
    } catch (err) {
      showError("Failed to delete organization structure");
      console.error("Error deleting organization structure:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Success!</strong>
            <p className="block sm:inline ml-2">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <p className="block sm:inline ml-2">{error}</p>
          </div>
        )}
      </div>

      <Navbar />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 mt-10">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Organization Structure Management
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Structure
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structures.map((structure) => (
                <div key={structure.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${structure.image_url}`}
                    alt="Organization Structure"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Updated: {new Date(structure.updated_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingStructure(structure);
                            setPreviewUrl(`${process.env.REACT_APP_API_URL}${structure.image_url}`);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStructure(structure.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingStructure ? "Edit Organization Structure" : "Add New Organization Structure"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block text-center"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto max-h-64 object-contain"
                      />
                    ) : (
                      <div className="py-8">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                          Click to upload an image
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full md:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingStructure ? handleUpdateStructure : handleCreateStructure}
                    className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingStructure ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationStructureManagement;