import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Search, Menu, X, Image as ImageIcon } from "lucide-react";
import Sidebar from "../../../component/sidebar";
import { CreateHerbalStoreData, HerbalStore, herbalStoreService } from "../../../services/store";

const DashboardHerbalStorePage: React.FC = () => {
  const [herbalStores, setHerbalStores] = useState<HerbalStore[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentHerbalStore, setCurrentHerbalStore] = useState<Partial<HerbalStore>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // New state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchHerbalStores = async () => {
      try {
        setIsLoading(true);
        const fetchedHerbalStores = await herbalStoreService.getHerbalStores();
        setHerbalStores(fetchedHerbalStores);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch herbal stores");
        setIsLoading(false);
      }
    };

    fetchHerbalStores();
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAddHerbalStore = () => {
    setCurrentHerbalStore({});
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditHerbalStore = (herbalStore: HerbalStore) => {
    setCurrentHerbalStore(herbalStore);
  
    const preview = herbalStore.image instanceof File
      ? URL.createObjectURL(herbalStore.image)
      : herbalStore.image || null;
  
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
          setCurrentHerbalStore({
            ...currentHerbalStore,
            image: file  // Ini adalah objek File
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHerbalStore = async () => {
    try {
      console.log("Current Herbal Store:", currentHerbalStore);
      console.log("Image:", currentHerbalStore.image);
  
      const storeToSave = {
        ...currentHerbalStore,
        image: currentHerbalStore.image  // Pastikan ini adalah File
      } as CreateHerbalStoreData;
  
      if (isEditing && currentHerbalStore.id) {
        const updatedHerbalStore = await herbalStoreService.updateHerbalStore({
          id: currentHerbalStore.id,
          ...storeToSave
        });
        // ... 
      } else {
        const newHerbalStore = await herbalStoreService.createHerbalStore(storeToSave);
        console.log("New Herbal Store:", newHerbalStore);
      }
      // ...
    } catch (err: any) {
      console.error("Full error:", err);
      alert(err.message || "Failed to save herbal store");
    }
  };

  const handleDeleteHerbalStore = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this herbal store?")) {
      try {
        await herbalStoreService.deleteHerbalStore(id);
        setHerbalStores(herbalStores.filter((store) => store.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete herbal store");
      }
    }
  };

  const filteredHerbalStores = herbalStores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading herbal stores...</p>
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
        <h1 className="text-xl font-bold text-gray-800">Herbal Store Management</h1>
        <button
          onClick={handleAddHerbalStore}
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
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Herbal Store Management</h1>
            <button
              onClick={handleAddHerbalStore}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Herbal Store
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search herbal stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Herbal Stores Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Image</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Name</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base hidden md:table-cell">Address</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHerbalStores.map((store) => (
                  <tr key={store.id} className="border-t">
                    <td className="px-4 py-3">
                      {store.image ? (
                        <img 
                          src={`${process.env.REACT_APP_API_URL}${store.image}`} 
                          alt={store.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm md:text-base">{store.name}</td>
                    <td className="px-4 py-3 text-sm md:text-base hidden md:table-cell">{store.address}</td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEditHerbalStore(store)}
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHerbalStore(store.id)}
                        className="text-red-500 hover:underline text-sm md:text-base"
                      >
                        Delete
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
                {isEditing ? "Edit Herbal Store" : "Add Herbal Store"}
              </h2>

              <form className="space-y-6">
                {/* Image Upload Section */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-full md:w-auto flex justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Store Preview" 
                        className="w-48 h-48 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                        <ImageIcon className="w-12 h-12 md:w-8 md:h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium">Store Image</label>
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
                  {/* Store Details Section */}
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-gray-700">Store Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Name</label>
                        <input
                          type="text"
                          value={currentHerbalStore.name || ""}
                          onChange={(e) =>
                            setCurrentHerbalStore({
                              ...currentHerbalStore,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter herbal store name"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Address</label>
                        <input
                          type="text"
                          value={currentHerbalStore.address || ""}
                          onChange={(e) =>
                            setCurrentHerbalStore({
                              ...currentHerbalStore,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter address"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links Section */}
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-gray-700">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Facebook Link</label>
                        <input
                          type="text"
                          value={currentHerbalStore.link_facebook || ""}
                          onChange={(e) =>
                            setCurrentHerbalStore({
                              ...currentHerbalStore,
                              link_facebook: e.target.value,
                            })
                          }
                          placeholder="Enter Facebook link"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Website Link</label>
                        <input
                          type="text"
                          value={currentHerbalStore.link_website || ""}
                          onChange={(e) =>
                            setCurrentHerbalStore({
                              ...currentHerbalStore,
                              link_website: e.target.value,
                            })
                          }
                          placeholder="Enter website link"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Maps Link Section */}
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-gray-700">Location</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Maps Link</label>
                        <input
                          type="text"
                          value={currentHerbalStore.link_maps || ""}
                          onChange={(e) =>
                            setCurrentHerbalStore({
                              ...currentHerbalStore,
                              link_maps: e.target.value,
                            })
                          }
                          placeholder="Enter Google Maps link"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                        />
                      </div>
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
                      onClick={handleSaveHerbalStore}
                      className="w-full md:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                      {isEditing ? "Save Changes" : "Add Store"}
                    </button>
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

export default DashboardHerbalStorePage;