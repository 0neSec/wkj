import React, { useState, useEffect } from "react";
import { 
  Edit2, 
  Search, 
  Menu, 
  X, 
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2 
} from "lucide-react";
import Sidebar from "../../../../component/sidebar";
import { 
  FooterContent3, 
  CreateFooterContent3Data,
  UpdateFooterContent3Data,
  footerContent3Service 
} from "../../../../services/footer/contact";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

const DashboardFooterContent3Page: React.FC = () => {
  const [footerContents, setFooterContents] = useState<FooterContent3[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [currentFooterContent, setCurrentFooterContent] = useState<Partial<FooterContent3>>({});
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const fetchFooterContents = async () => {
    try {
      setIsLoading(true);
      const fetchedFooterContents = await footerContent3Service.getFooterContent3();
      setFooterContents(fetchedFooterContents);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch footer contents");
      toast.error("Error", { description: "Unable to load footer contents" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterContents();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleEditFooterContent = (footerContent: FooterContent3) => {
    setCurrentFooterContent(footerContent);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleCreateFooterContent = () => {
    setCurrentFooterContent({});
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  const handleSaveFooterContent = async () => {
    try {
      if (isCreateMode) {
        // Create new content
        const contentToCreate: CreateFooterContent3Data = {
          title: currentFooterContent.title || '',
          description1: currentFooterContent.description1 || '',
          description2: currentFooterContent.description2 || ''
        };

        const createdContent = await footerContent3Service.createFooterContent3(contentToCreate);
        
        if (createdContent) {
          setFooterContents([...footerContents, createdContent]);
          toast.success("Success", { description: "Footer content created successfully" });
        }
      } else if (currentFooterContent.id) {
        // Update existing content
        const contentToUpdate: UpdateFooterContent3Data = {
          id: currentFooterContent.id,
          title: currentFooterContent.title,
          description1: currentFooterContent.description1,
          description2: currentFooterContent.description2
        };
  
        const updatedContent = await footerContent3Service.updateFooterContent3(contentToUpdate);
        
        if (updatedContent) {
          setFooterContents(footerContents.map(content => 
            content.id === updatedContent.id ? updatedContent : content
          ));
          toast.success("Success", { description: "Footer content updated successfully" });
        }
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Full error:", err);
      toast.error("Error", { description: err.message || "Failed to save footer content" });
    }
  };

  const handleDeleteFooterContent = async (id: number) => {
    try {
      await footerContent3Service.deleteFooterContent3(id);
      setFooterContents(footerContents.filter(content => content.id !== id));
      toast.success("Success", { description: "Footer content deleted successfully" });
    } catch (err: any) {
      console.error("Full error:", err);
      toast.error("Error", { description: err.message || "Failed to delete footer content" });
    }
  };

  const filteredFooterContents = footerContents.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
          <p className="text-gray-700">Loading footer contents...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-red-500"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster richColors position="top-right" />
      
      {/* Mobile Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden flex justify-between items-center p-4 bg-white shadow-md"
      >
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Footer Content</h1>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="md:hidden fixed inset-0 z-50 overflow-y-auto"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Footer Content Management</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateFooterContent}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Content
            </motion.button>
          </div>

          {/* Mobile Add Button */}
          <div className="md:hidden mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateFooterContent}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Content
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search footer contents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          {/* Footer Contents Table */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Title</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base hidden md:table-cell">Description 1</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFooterContents.map((content) => (
                  <motion.tr 
                    key={content.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm md:text-base">{content.title}</td>
                    <td className="px-4 py-3 text-sm md:text-base hidden md:table-cell truncate max-w-xs">
                      {content.description1}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditFooterContent(content)}
                        className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded-md transition flex items-center"
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteFooterContent(content.id)}
                        className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl mx-auto my-8 relative shadow-xl"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Scrollable Content Container */}
              <div className="max-h-[80vh] overflow-y-auto p-6">
                <h2 className="text-lg md:text-xl font-bold mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                  {isCreateMode ? 'Create Footer Content' : 'Edit Footer Content'}
                </h2>

                <form className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-semibold mb-4 text-gray-700">Content Details</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium">Title</label>
                          <input
                            type="text"
                            value={currentFooterContent.title || ""}
                            onChange={(e) =>
                              setCurrentFooterContent({
                                ...currentFooterContent,
                                title: e.target.value,
                              })
                            }
                            placeholder="Enter content title"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Description 1</label>
                          <textarea
                            value={currentFooterContent.description1 || ""}
                            onChange={(e) =>
                              setCurrentFooterContent({
                                ...currentFooterContent,
                                description1: e.target.value,
                              })
                            }
                            placeholder="Enter first description"
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Description 2</label>
                          <textarea
                            value={currentFooterContent.description2 || ""}
                            onChange={(e) =>
                              setCurrentFooterContent({
                                description2: e.target.value,
                          })
                        }
                            placeholder="Enter second description (optional)"
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white pt-4 border-t mt-6">
                    <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full md:w-auto px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleSaveFooterContent}
                        className="w-full md:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> 
                        {isCreateMode ? 'Create Content' : 'Save Changes'}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardFooterContent3Page;