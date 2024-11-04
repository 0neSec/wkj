import React, { useEffect, useState } from "react";
import { CreateProfileData, ProfileContent, profileService, UpdateProfileData } from "../../../../services/Tentang/TentangService";
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
  const [editingProfile, setEditingProfile] = useState<ProfileContent | null>(null);
  const [newProfile, setNewProfile] = useState<CreateProfileData>({ description: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      setProfiles(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userTentangMessages.LOAD_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const insertParagraph = () => {
    if (editingProfile) {
      const newDescription = editingProfile.description + '\n';
      setEditingProfile({ ...editingProfile, description: newDescription });
    } else {
      const newDescription = newProfile.description + '\n';
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
      const errorMessage = err instanceof Error ? err.message : userTentangMessages.CREATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error creating profile:', err);
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
      const errorMessage = err instanceof Error ? err.message : userTentangMessages.UPDATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error updating profile:', err);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile content?");
    if (confirmDelete) {
      try {
        await profileService.deleteProfile(profileId);
        await fetchProfiles();
        setSuccessMessage(userTentangMessages.DELETE_SUCCESS);
        setIsSuccessModalOpen(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : userTentangMessages.DELETE_FAILED;
        setError(errorMessage);
        setIsErrorModalOpen(true);
        console.error('Error deleting profile:', err);
      }
    }
  };

  const formatDescription = (text: string) => {
    return text.split('\n').join('<br/>');
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
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Profile Content</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingProfile(null);
                  setNewProfile({ description: "" });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Profile Content
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search profiles..."
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
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{profile.id}</td>
                      <td className="px-4 py-3" dangerouslySetInnerHTML={{ __html: formatDescription(profile.description) }} />
                      <td className="px-4 py-3">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
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
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-7xl w-full"> {/* Increased max-width and padding */}
                <h2 className="text-2xl font-bold mb-6"> {/* Increased text size and margin */}
                  {editingProfile ? "Edit Profile Content" : "Add Profile Content"}
                </h2>
                <div className="space-y-4">
                  <textarea
                    value={editingProfile ? editingProfile.description : newProfile.description}
                    onChange={(e) => {
                      if (editingProfile) {
                        setEditingProfile({ ...editingProfile, description: e.target.value });
                      } else {
                        setNewProfile({ description: e.target.value });
                      }
                    }}
                    placeholder="Enter your profile description here..."
                    className="border px-4 py-3 rounded-lg w-full h-96 resize-y text-base" /* Increased height significantly, added resize-y, better padding */
                  />
                </div>
                <div className="flex justify-end mt-6"> {/* Increased margin-top */}
                  <button
                    onClick={() => {
                      if (editingProfile) {
                        handleUpdateProfile();
                      } else {
                        handleCreateProfile();
                      }
                    }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-base hover:bg-blue-600 transition-colors" /* Larger padding and hover effect */
                  >
                    {editingProfile ? "Update" : "Create"}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-base hover:bg-gray-400 transition-colors" /* Matched styling with primary button */
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

export default DashboardProfile;
