import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Search, Menu, X } from "lucide-react";
import Sidebar from "../../../component/sidebar";
import { User, userService } from "../../../services/user";

const DashboardUserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    role: "user", // Default role set to 'user' string
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userService.getAllUsers();
      
      setUsers(fetchedUsers);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle toggling sidebar and mobile menu
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAddUser = () => {
    setCurrentUser({ role: "user" }); // Reset role to 'user' string when adding new user
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (isEditing && currentUser.id) {
        await userService.updateUser({
          id: currentUser.id,
          username: currentUser.username!,
          email: currentUser.email!,
          password: currentUser.password!,
          role: currentUser.role!, // keep role as string
        });
      } else {
        await userService.createUser({
          username: currentUser.username!,
          email: currentUser.email!,
          password: currentUser.password!,
          role: currentUser.role!, // keep role as string
        });
      }
      setIsModalOpen(false);
      // Refetch users after save
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = (users || []).filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading users...</p>
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
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleAddUser}
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
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <button
              onClick={handleAddUser}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 px-4 py-2 border rounded-lg w-full focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Username</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Email</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Role</th>
                  <th className="px-4 py-3 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3 text-sm md:text-base">{user.username}</td>
                    <td className="px-4 py-3 text-sm md:text-base">{user.email}</td>
                    <td className="px-4 py-3 text-sm md:text-base">{user.role}</td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content Container */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                {isEditing ? "Edit User" : "Add User"}
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={currentUser.username || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        username: e.target.value,
                      })
                    }
                    placeholder="Enter username"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={currentUser.password || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Role</label>
                  <select
                    value={currentUser.role}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        role: e.target.value, // Role as string
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-green-500 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUserPage;
