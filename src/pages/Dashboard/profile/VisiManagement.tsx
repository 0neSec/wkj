import React, { useEffect, useState } from "react";

import Navbar from "../../../component/includes/navbar";
import Sidebar from "../../../component/includes/sidebar";
import { CreateVisiData, UpdateVisiData, VisiContent, visiService } from "../../../services/Tentang/VisiManagement";

// Helper component to render text with paragraphs
const FormattedDescription: React.FC<{ text: string }> = ({ text }) => {
  return (
    <>
      {text.split('\n').map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

const VisiManagement = () => {
  // State Management
  const [visiList, setVisiList] = useState<VisiContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisi, setEditingVisi] = useState<VisiContent | null>(null);
  const [newVisi, setNewVisi] = useState<CreateVisiData>({
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Data Fetching
  const fetchVisiList = async () => {
    try {
      setLoading(true);
      const response = await visiService.getVisiList();
      setVisiList(response);
    } catch (err) {
      showError("Failed to fetch visi list");
      console.error("Error fetching visi list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisiList();
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
    setNewVisi({ description: "" });
    setEditingVisi(null);
    setIsModalOpen(false);
  };

  // CRUD Operations
  const handleCreateVisi = async () => {
    if (!newVisi.description.trim()) {
      showError("Visi description cannot be empty");
      return;
    }

    try {
      await visiService.createVisi(newVisi);
      await fetchVisiList();
      showSuccess("Visi created successfully");
      resetForm();
    } catch (err) {
      showError("Failed to create visi");
      console.error("Error creating visi:", err);
    }
  };

  const handleUpdateVisi = async () => {
    if (!editingVisi?.description.trim()) {
      showError("Visi description cannot be empty");
      return;
    }

    try {
      const updatedData: UpdateVisiData = {
        id: editingVisi.id,
        description: editingVisi.description,
      };
      await visiService.updateVisi(updatedData);
      await fetchVisiList();
      showSuccess("Visi updated successfully");
      resetForm();
    } catch (err) {
      showError("Failed to update visi");
      console.error("Error updating visi:", err);
    }
  };

  const handleDeleteVisi = async (visiId: number) => {
    if (!window.confirm("Are you sure you want to delete this visi?")) return;

    try {
      await visiService.deleteVisi(visiId);
      await fetchVisiList();
      showSuccess("Visi deleted successfully");
    } catch (err) {
      showError("Failed to delete visi");
      console.error("Error deleting visi:", err);
    }
  };

  // Filtered Data
  const filteredVisiList = visiList.filter((v) =>
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Messages */}
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

        <main className="flex-1 p-4 md:p-6 mt-20">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Visi Management
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Visi
              </button>
            </div>

            <input
              type="text"
              placeholder="Search visi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        Updated At
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisiList.map((visi) => (
                      <tr key={visi.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{visi.id}</td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs md:max-w-md">
                            <FormattedDescription text={visi.description} />
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {new Date(visi.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {new Date(visi.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingVisi(visi);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVisi(visi.id)}
                              className="text-red-500 hover:underline"
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
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingVisi ? "Edit Visi" : "Add New Visi"}
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
                <textarea
                  value={editingVisi ? editingVisi.description : newVisi.description}
                  onChange={(e) => {
                    if (editingVisi) {
                      setEditingVisi({
                        ...editingVisi,
                        description: e.target.value,
                      });
                    } else {
                      setNewVisi({ description: e.target.value });
                    }
                  }}
                  placeholder="Enter visi description..."
                  className="border px-4 py-3 rounded-lg w-full h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-col md:flex-row justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full md:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingVisi ? handleUpdateVisi : handleCreateVisi}
                    className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingVisi ? "Update" : "Create"}
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

export default VisiManagement;