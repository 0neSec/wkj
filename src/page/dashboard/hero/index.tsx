import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Search, Menu, X, Image as ImageIcon } from "lucide-react";
import Sidebar from "../../../component/sidebar";
import { CreateHeroContentData, HeroContent, heroContentService } from "../../../services/hero";

const DashboardHeroContentPage: React.FC = () => {
  const [heroContents, setHeroContents] = useState<HeroContent[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentHeroContent, setCurrentHeroContent] = useState<Partial<HeroContent>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // New state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroContents = async () => {
      try {
        setIsLoading(true);
        const fetchedHeroContents = await heroContentService.getHeroContent();
        setHeroContents(fetchedHeroContents);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch hero contents");
        setIsLoading(false);
      }
    };

    fetchHeroContents();
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAddHeroContent = () => {
    setCurrentHeroContent({});
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditHeroContent = (heroContent: HeroContent) => {
    setCurrentHeroContent(heroContent);
  
    const preview = heroContent.image instanceof File
      ? URL.createObjectURL(heroContent.image)
      : heroContent.image || null;
  
    setImagePreview(preview);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImagePreview(reader.result as string);
          
          // Pastikan objek File disimpan dengan benar
          setCurrentHeroContent({
            ...currentHeroContent,
            image: file  // Ini adalah objek File
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeroContent = async () => {
    try {
      const contentToSave = {
        ...currentHeroContent,
        image: currentHeroContent.image  // Pastikan ini adalah File
      } as CreateHeroContentData;
  
      if (isEditing && currentHeroContent.id) {
        const updatedHeroContent = await heroContentService.updateHeroContent({
          id: currentHeroContent.id,
          ...contentToSave
        });
        
        if (updatedHeroContent) {
          setHeroContents(heroContents.map(content => 
            content.id === updatedHeroContent.id ? updatedHeroContent : content
          ));
        }
      } else {
        const newHeroContent = await heroContentService.createHeroContent(contentToSave);
        
        if (newHeroContent) {
          setHeroContents([...heroContents, newHeroContent]);
        }
      }
      
      setIsModalOpen(false);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Full error:", err);
      alert(err.message || "Failed to save hero content");
    }
  };

  const handleDeleteHeroContent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this hero content?")) {
      try {
        await heroContentService.deleteHeroContent(id);
        setHeroContents(heroContents.filter((content) => content.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete hero content");
      }
    }
  };

  const filteredHeroContents = heroContents.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading hero contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Hero Content Management</h1>
        <button
          onClick={handleAddHeroContent}
          className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto">
          <Sidebar />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Desktop Header */}


          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search hero contents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Hero Contents Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Image</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Title</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeroContents.map((content) => (
                  <tr key={content.id} className="border-t">
                    <td className="px-4 py-3">
                      {content.image ? (
                        <img 
                          src={`${process.env.REACT_APP_API_URL}${content.image}`} 
                          alt={content.title} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm md:text-base">{content.title}</td>
                    <td className="px-4 py-3 text-sm md:text-base hidden md:table-cell">
                      {content.description.length > 50 
                        ? `${content.description.slice(0, 50)}...` 
                        : content.description}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEditHeroContent(content)}
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-auto my-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setImagePreview(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content Container */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                {isEditing ? "Edit Hero Content" : "Add Hero Content"}
              </h2>

              <form className="space-y-6">
                {/* Image Upload Section */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-full md:w-auto flex justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Hero Content Preview" 
                        className="w-48 h-48 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                        <ImageIcon className="w-12 h-12 md:w-8 md:h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium">Hero Content Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label 
                      htmlFor="imageUpload" 
                      className="w-full block text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>

                {/* Main Form Fields */}
                <div className="space-y-6">
                  {/* Hero Content Details Section */}
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-gray-700">Hero Content Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Title</label>
                        <input
                          type="text"
                          value={currentHeroContent.title || ""}
                          onChange={(e) =>
                            setCurrentHeroContent({
                              ...currentHeroContent,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter hero content title"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Description</label>
                        <textarea
                          value={currentHeroContent.description || ""}
                          onChange={(e) =>
                            setCurrentHeroContent({
                              ...currentHeroContent,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter hero content description"
                          rows={4}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Sticky at bottom */}
                  <div className="sticky bottom-0 bg-white pt-4 border-t mt-6">
                    <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setImagePreview(null);
                        }}
                        className="w-full md:w-auto px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveHeroContent}
                        className="w-full md:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                      >
                        {isEditing ? "Save Changes" : "Add Hero Content"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeroContentPage;