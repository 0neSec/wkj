import React, { useState, useEffect } from "react";
import { 
  Edit2, 
  Search, 
  Menu, 
  X, 
  Link2, 
  RefreshCw,
  AlertCircle,
  CheckCircle2 
} from "lucide-react";
import Sidebar from "../../../../component/sidebar";
import { 
  UpdateFooterContent2Data, 
  FooterContent2, 
  footerContent2Service 
} from "../../../../services/footer/maps";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

const DashboardFooterContent2Page: React.FC = () => {
  const [footerContents, setFooterContents] = useState<FooterContent2[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFooterContent, setCurrentFooterContent] = useState<Partial<FooterContent2>>({});
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const fetchFooterContents = async () => {
    try {
      setIsLoading(true);
      const fetchedFooterContents = await footerContent2Service.getFooterContent2();
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

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleEditFooterContent = (footerContent: FooterContent2) => {
    setCurrentFooterContent(footerContent);
    setIsModalOpen(true);
  };

  const handleUpdateFooterContent = async () => {
    try {
      if (currentFooterContent.id) {
        const contentToUpdate: UpdateFooterContent2Data = {
          id: currentFooterContent.id,
          title: currentFooterContent.title,
          link_maps: currentFooterContent.link_maps
        };
  
        const updatedContent = await footerContent2Service.updateFooterContent2(contentToUpdate);
        
        if (updatedContent) {
          setFooterContents(footerContents.map(content => 
            content.id === updatedContent.id ? updatedContent : content
          ));
          toast.success("Success", { description: "Footer link updated successfully" });
        }
        
        setIsModalOpen(false);
      }
    } catch (err: any) {
      console.error("Full error:", err);
      toast.error("Error", { description: err.message || "Failed to update footer content" });
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
        <h1 className="text-xl font-bold text-gray-800">Footer Links</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">Footer Links Management</h1>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search footer links..."
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
                  <th className="px-4 py-3 text-left text-sm md:text-base hidden md:table-cell">Google Maps Link</th>
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
                    <td className="px-4 py-3 text-sm md:text-base hidden md:table-cell">
                      <a 
                        href={content.link_maps} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline truncate max-w-[200px] inline-block"
                      >
                        <Link2 className="inline-block mr-2 w-4 h-4" />
                        {content.link_maps}
                      </a>
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
                  Edit Footer Link
                </h2>

                <form className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-semibold mb-4 text-gray-700">Link Details</h3>
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
                            placeholder="Enter link title"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Google Maps Link</label>
                          <input
                            type="text"
                            value={currentFooterContent.link_maps || ""}
                            onChange={(e) =>
                              setCurrentFooterContent({
                                ...currentFooterContent,
                                link_maps: e.target.value,
                              })
                            }
                            placeholder="Paste your Google Maps link"
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
                        onClick={handleUpdateFooterContent}
                        className="w-full md:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
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

export default DashboardFooterContent2Page;