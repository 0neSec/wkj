import React, { useEffect, useState } from "react";
import { CreateHistoryData, HistoryContent, historyService, UpdateHistoryData } from "../../../../services/Tentang/HistoryService";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";

const HistoryManagement = () => {
  const [histories, setHistories] = useState<HistoryContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingHistory, setEditingHistory] = useState<HistoryContent | null>(null);
  const [newHistory, setNewHistory] = useState<CreateHistoryData>({ description: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const response = await historyService.getHistories();
      setHistories(response);
    } catch (err) {
      setError("Failed to fetch histories");
      setIsErrorModalOpen(true);
      console.error("Error fetching histories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHistory = async () => {
    if (!newHistory.description.trim()) {
      setError("History description cannot be empty");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await historyService.createHistory(newHistory);
      await fetchHistories();
      setSuccessMessage("History created successfully");
      setIsSuccessModalOpen(true);
      setNewHistory({ description: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to create history");
      setIsErrorModalOpen(true);
      console.error("Error creating history:", err);
    }
  };

  const handleUpdateHistory = async () => {
    if (!editingHistory) return;

    try {
      const updatedData: UpdateHistoryData = {
        id: editingHistory.id,
        description: editingHistory.description,
      };
      await historyService.updateHistory(updatedData);
      await fetchHistories();
      setSuccessMessage("History updated successfully");
      setIsSuccessModalOpen(true);
      setEditingHistory(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update history");
      setIsErrorModalOpen(true);
      console.error("Error updating history:", err);
    }
  };

  const handleDeleteHistory = async (historyId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this history?");
    if (confirmDelete) {
      try {
        await historyService.deleteHistory(historyId);
        await fetchHistories();
        setSuccessMessage("History deleted successfully");
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError("Failed to delete history");
        setIsErrorModalOpen(true);
        console.error("Error deleting history:", err);
      }
    }
  };

  const filteredHistories = histories.filter((h) =>
    h.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-gray-800">History Management</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingHistory(null);
                  setNewHistory({ description: "" });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New History
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search histories..."
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
                  {filteredHistories.map((h) => (
                    <tr key={h.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{h.id}</td>
                      <td className="px-4 py-3">{h.description}</td>
                      <td className="px-4 py-3">
                        {new Date(h.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(h.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingHistory(h);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHistory(h.id)}
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
                    {editingHistory ? "Edit History" : "Add New History"}
                  </h2>
                  <div className="space-y-4">
                    <textarea
                      value={editingHistory ? editingHistory.description : newHistory.description}
                      onChange={(e) => {
                        if (editingHistory) {
                          setEditingHistory({ ...editingHistory, description: e.target.value });
                        } else {
                          setNewHistory({ description: e.target.value });
                        }
                      }}
                      placeholder="Enter history description..."
                      className="border px-4 py-3 rounded-lg w-full h-32 resize-y"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        if (editingHistory) {
                          handleUpdateHistory();
                        } else {
                          handleCreateHistory();
                        }
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {editingHistory ? "Update" : "Create"}
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

export default HistoryManagement;