import React, { useEffect, useState } from "react";
import { CreateFunctionData, FunctionContent, functionService, UpdateFunctionData } from "../../../../services/Tentang/FunctionService";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";

const FunctionManagement = () => {
  const [functions, setFunctions] = useState<FunctionContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingFunction, setEditingFunction] = useState<FunctionContent | null>(null);
  const [newFunction, setNewFunction] = useState<CreateFunctionData>({ description: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchFunctions();
  }, []);

  const fetchFunctions = async () => {
    setLoading(true);
    try {
      const response = await functionService.getFunctions();
      setFunctions(response);
    } catch (err) {
      setError("Failed to fetch functions");
      setIsErrorModalOpen(true);
      console.error("Error fetching functions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFunction = async () => {
    if (!newFunction.description.trim()) {
      setError("Function description cannot be empty");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await functionService.createFunction(newFunction);
      await fetchFunctions();
      setSuccessMessage("Function created successfully");
      setIsSuccessModalOpen(true);
      setNewFunction({ description: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to create function");
      setIsErrorModalOpen(true);
      console.error("Error creating function:", err);
    }
  };

  const handleUpdateFunction = async () => {
    if (!editingFunction) return;

    try {
      const updatedData: UpdateFunctionData = {
        id: editingFunction.id,
        description: editingFunction.description,
      };
      await functionService.updateFunction(updatedData);
      await fetchFunctions();
      setSuccessMessage("Function updated successfully");
      setIsSuccessModalOpen(true);
      setEditingFunction(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update function");
      setIsErrorModalOpen(true);
      console.error("Error updating function:", err);
    }
  };

  const handleDeleteFunction = async (functionId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this function?");
    if (confirmDelete) {
      try {
        await functionService.deleteFunction(functionId);
        await fetchFunctions();
        setSuccessMessage("Function deleted successfully");
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError("Failed to delete function");
        setIsErrorModalOpen(true);
        console.error("Error deleting function:", err);
      }
    }
  };

  const filteredFunctions = functions.filter((f) =>
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-800">Function Management</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingFunction(null);
              setNewFunction({ description: "" });
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add New Function
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Updated At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFunctions.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{f.id}</td>
                  <td className="px-4 py-3">{f.description}</td>
                  <td className="px-4 py-3">
                    {new Date(f.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(f.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingFunction(f);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFunction(f.id)}
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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6">
                {editingFunction ? "Edit Function" : "Add New Function"}
              </h2>
              <div className="space-y-4">
                <textarea
                  value={editingFunction ? editingFunction.description : newFunction.description}
                  onChange={(e) => {
                    if (editingFunction) {
                      setEditingFunction({ ...editingFunction, description: e.target.value });
                    } else {
                      setNewFunction({ description: e.target.value });
                    }
                  }}
                  placeholder="Enter function description..."
                  className="border px-4 py-3 rounded-lg w-full h-32 resize-y"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    if (editingFunction) {
                      handleUpdateFunction();
                    } else {
                      handleCreateFunction();
                    }
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingFunction ? "Update" : "Create"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            </div>
        )}

        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Success</h2>
              <p>{successMessage}</p>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Error</h2>
              <p>{error}</p>
              <button
                onClick={() => setIsErrorModalOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
        </div>
      </div>
      </div>
  );
};

export default FunctionManagement;