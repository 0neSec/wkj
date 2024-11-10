import React, { useEffect, useState } from "react";
import { Article, ArticleCategory, articleService, CreateArticleData, UpdateArticleData } from "../../../services/Artikel";
import { articleCategoryService } from "../../../services/Artikel/Category";
import Navbar from "../../../component/includes/navbar";
import Sidebar from "../../../component/includes/sidebar";


const ArticleManagement = () => {
  // State Management
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateArticleData>({
    name: "",
    description: "",
    article_category_id: 0,
    image_url: undefined,
  });

  // Data Fetching
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticles();
      setArticles(response);
    } catch (err) {
      showError("Failed to fetch articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await articleCategoryService.getArticleCategories();
      setCategories(response);
    } catch (err) {
      showError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
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
    setFormData({
      name: "",
      description: "",
      article_category_id: 0,
      image_url: undefined,
    });
    setEditingArticle(null);
    setIsModalOpen(false);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image_url: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Operations
  const handleCreateArticle = async () => {
    if (!formData.name.trim() || !formData.description.trim() || formData.article_category_id === 0) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      await articleService.createArticle(formData);
      await fetchArticles();
      showSuccess("Article created successfully");
      resetForm();
    } catch (err) {
      showError("Failed to create article");
      console.error("Error creating article:", err);
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;

    try {
      const updatedData: UpdateArticleData = {
        id: editingArticle.id,
        name: formData.name,
        description: formData.description,
        article_category_id: formData.article_category_id,
        image_url: formData.image_url,
      };
      await articleService.updateArticle(updatedData);
      await fetchArticles();
      showSuccess("Article updated successfully");
      resetForm();
    } catch (err) {
      showError("Failed to update article");
      console.error("Error updating article:", err);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      await articleService.deleteArticle(articleId);
      await fetchArticles();
      showSuccess("Article deleted successfully");
    } catch (err) {
      showError("Failed to delete article");
      console.error("Error deleting article:", err);
    }
  };

  // Filtered Data
  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                Article Management
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Article
              </button>
            </div>

            <input
              type="text"
              placeholder="Search articles..."
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
                      <th className="px-4 py-3 text-left">Image</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Created At</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{article.id}</td>
                        <td className="px-4 py-3">
                          <img
                            src={article.image_url || "/placeholder-image.jpg"}
                            alt={article.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate">{article.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          {article.article_category?.name}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="max-w-xs truncate">{article.description}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setFormData({
                                  name: article.name,
                                  description: article.description,
                                  article_category_id: article.article_category_id,
                                  image_url: undefined,
                                });
                                setImagePreview(article.image_url);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingArticle ? "Edit Article" : "Add New Article"}
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter article name..."
                  className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={formData.article_category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      article_category_id: Number(e.target.value),
                    })
                  }
                  className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter article description..."
                  rows={4}
                  className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full md:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingArticle ? handleUpdateArticle : handleCreateArticle}
                    className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingArticle ? "Update" : "Create"}
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

export default ArticleManagement;