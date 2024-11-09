import React, { useEffect, useState } from "react";

import Navbar from "../../../component/includes/navbar";
import Sidebar from "../../../component/includes/sidebar";
import { CreateNewsData, NewsContent, newsService, UpdateNewsData } from "../../../services/news";

const NewsManagement = () => {
  // State Management
  const [news, setNews] = useState<NewsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsContent | null>(null);
  const [newNews, setNewNews] = useState<CreateNewsData>({
    title: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Data Fetching
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNews();
      setNews(response);
    } catch (err) {
      showError("Failed to fetch news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
    setNewNews({ title: "", description: "" });
    setEditingNews(null);
    setIsModalOpen(false);
  };

  // CRUD Operations
  const handleCreateNews = async () => {
    if (!newNews.title.trim() || !newNews.description.trim()) {
      showError("Title and description cannot be empty");
      return;
    }

    try {
      await newsService.createNews(newNews);
      await fetchNews();
      showSuccess("News created successfully");
      resetForm();
    } catch (err) {
      showError("Failed to create news");
      console.error("Error creating news:", err);
    }
  };

  const handleUpdateNews = async () => {
    if (!editingNews?.title.trim() || !editingNews?.description.trim()) {
      showError("Title and description cannot be empty");
      return;
    }

    try {
      const updatedData: UpdateNewsData = {
        id: editingNews.id,
        title: editingNews.title,
        description: editingNews.description,
      };
      await newsService.updateNews(updatedData);
      await fetchNews();
      showSuccess("News updated successfully");
      resetForm();
    } catch (err) {
      showError("Failed to update news");
      console.error("Error updating news:", err);
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      await newsService.deleteNews(newsId);
      await fetchNews();
      showSuccess("News deleted successfully");
    } catch (err) {
      showError("Failed to delete news");
      console.error("Error deleting news:", err);
    }
  };

  // Filtered Data
  const filteredNews = news.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase())
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

        <main className="flex-1 p-4 md:p-6 mt-10">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                News Management
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New News
              </button>
            </div>

            <input
              type="text"
              placeholder="Search news..."
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
                      <th className="px-4 py-3 text-left">Title</th>
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
                    {filteredNews.map((newsItem) => (
                      <tr key={newsItem.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{newsItem.id}</td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs md:max-w-md truncate">
                            {newsItem.title}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs md:max-w-md truncate">
                            {newsItem.description}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {new Date(newsItem.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {new Date(newsItem.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingNews(newsItem);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNews(newsItem.id)}
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
                  {editingNews ? "Edit News" : "Add New News"}
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
                <input
                  type="text"
                  value={editingNews ? editingNews.title : newNews.title}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({
                        ...editingNews,
                        title: e.target.value,
                      });
                    } else {
                      setNewNews({ ...newNews, title: e.target.value });
                    }
                  }}
                  placeholder="Enter news title..."
                  className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={editingNews ? editingNews.description : newNews.description}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({
                        ...editingNews,
                        description: e.target.value,
                      });
                    } else {
                      setNewNews({ ...newNews, description: e.target.value });
                    }
                  }}
                  placeholder="Enter news description..."
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
                    onClick={editingNews ? handleUpdateNews : handleCreateNews}
                    className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingNews ? "Update" : "Create"}
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

export default NewsManagement;