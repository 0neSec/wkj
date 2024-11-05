import React, { useEffect, useState } from "react";
import {
  CreateProfileData,
  ProfileContent,
  profileService,
  UpdateProfileData,
} from "../../../../services/Tentang/TentangService";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";
import { userTentangMessages } from "../../../../types/massage";

const DashboardProfile = () => {
  const [profiles, setProfiles] = useState<ProfileContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<ProfileContent | null>(
    null
  );
  const [newProfile, setNewProfile] = useState<CreateProfileData>({
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      setProfiles(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : userTentangMessages.LOAD_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const insertParagraph = () => {
    if (editingProfile) {
      const newDescription = editingProfile.description + "\n";
      setEditingProfile({ ...editingProfile, description: newDescription });
    } else {
      const newDescription = newProfile.description + "\n";
      setNewProfile({ description: newDescription });
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfile.description.trim()) {
      setError(userTentangMessages.EMPTY_DESCRIPTION);
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await profileService.createProfile(newProfile);
      await fetchProfiles();
      setSuccessMessage(userTentangMessages.CREATE_SUCCESS);
      setIsSuccessModalOpen(true);
      setNewProfile({ description: "" });
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : userTentangMessages.CREATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error("Error creating profile:", err);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    try {
      const updatedData: UpdateProfileData = {
        id: editingProfile.id,
        description: editingProfile.description,
      };
      await profileService.updateProfile(updatedData);
      await fetchProfiles();
      setSuccessMessage(userTentangMessages.UPDATE_SUCCESS);
      setIsSuccessModalOpen(true);
      setEditingProfile(null);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : userTentangMessages.UPDATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error("Error updating profile:", err);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile content?"
    );
    if (confirmDelete) {
      try {
        await profileService.deleteProfile(profileId);
        await fetchProfiles();
        setSuccessMessage(userTentangMessages.DELETE_SUCCESS);
        setIsSuccessModalOpen(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : userTentangMessages.DELETE_FAILED;
        setError(errorMessage);
        setIsErrorModalOpen(true);
        console.error("Error deleting profile:", err);
      }
    }
  };

  const formatDescription = (text: string) => {
    return text.split("\n").join("<br/>");
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-24">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 mt-4 md:mt-24">
          <div className="max-w-7xl mx-auto">
            {/* Responsive Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Profile Content
              </h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingProfile(null);
                  setNewProfile({ description: "" });
                }}
                className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Profile Content
              </button>
            </div>

            {/* Responsive Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Responsive Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{profile.id}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatDescription(
                                profile.description.length > 100
                                  ? `${profile.description.substring(
                                      0,
                                      100
                                    )}...`
                                  : profile.description
                              ),
                            }}
                          />
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProfile(profile);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-500 hover:underline whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-red-500 hover:underline whitespace-nowrap"
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

            {/* Responsive Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                      {editingProfile
                        ? "Edit Profile Content"
                        : "Add Profile Content"}
                    </h2>
                    <div className="space-y-4">
                      <textarea
                        value={
                          editingProfile
                            ? editingProfile.description
                            : newProfile.description
                        }
                        onChange={(e) => {
                          if (editingProfile) {
                            setEditingProfile({
                              ...editingProfile,
                              description: e.target.value,
                            });
                          } else {
                            setNewProfile({ description: e.target.value });
                          }
                        }}
                        placeholder="Enter your profile description here..."
                        className="border px-4 py-3 rounded-lg w-full h-64 md:h-96 resize-y text-base"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                      <button
                        onClick={() => {
                          if (editingProfile) {
                            handleUpdateProfile();
                          } else {
                            handleCreateProfile();
                          }
                        }}
                        className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg text-base hover:bg-blue-600 transition-colors"
                      >
                        {editingProfile ? "Update" : "Create"}
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-full sm:w-auto bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-base hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Success Modal */}
            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Success</h2>
                    <p>{successMessage}</p>
                    <button
                      onClick={() => setIsSuccessModalOpen(false)}
                      className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Error Modal */}
            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                    <button
                      onClick={() => setIsErrorModalOpen(false)}
                      className="mt-4 w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
