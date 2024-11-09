import React, { useState } from 'react';
import { Users } from 'lucide-react';
import Navbar from '../../../component/includes/navbar';
import Sidebar from '../../../component/includes/sidebar';
import { FaFemale, FaMale } from 'react-icons/fa';

const ManagementUsers = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'Male', role: 'User', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', gender: 'Female', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', gender: 'Male', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', gender: 'Female', role: 'User', status: 'Active' },
    { id: 5, name: 'Tom Hanks', email: 'tom@example.com', gender: 'Male', role: 'Admin', status: 'Inactive' },
    { id: 6, name: 'Alice Walker', email: 'alice@example.com', gender: 'Female', role: 'User', status: 'Inactive' },
    { id: 7, name: 'Bob Marley', email: 'bob@example.com', gender: 'Male', role: 'User', status: 'Active' },
    { id: 8, name: 'Diana Prince', email: 'diana@example.com', gender: 'Female', role: 'Admin', status: 'Inactive' },
    { id: 9, name: 'Bruce Wayne', email: 'bruce@example.com', gender: 'Male', role: 'User', status: 'Active' },
    { id: 10, name: 'Clark Kent', email: 'clark@example.com', gender: 'Male', role: 'Admin', status: 'Inactive' },
    { id: 11, name: 'Lois Lane', email: 'lois@example.com', gender: 'Female', role: 'User', status: 'Active' },
    { id: 12, name: 'Peter Parker', email: 'peter@example.com', gender: 'Male', role: 'User', status: 'Inactive' },
    { id: 13, name: 'Mary Jane', email: 'mary@example.com', gender: 'Female', role: 'User', status: 'Active' },
    { id: 14, name: 'Tony Stark', email: 'tony@example.com', gender: 'Male', role: 'Admin', status: 'Inactive' },
  ];

  const totalUsers = users.length;
  const maleUsers = users.filter(user => user.gender === 'Male').length;
  const femaleUsers = users.filter(user => user.gender === 'Female').length;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Get current users for the page
  const startIdx = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIdx, startIdx + usersPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex mt-16">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Total Users Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full p-3 bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-700">{totalUsers}</h3>
                  </div>
                </div>
              </div>

              {/* Male Users Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full p-3 bg-green-100">
                    <FaMale className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Male Users</p>
                    <h3 className="text-2xl font-bold text-gray-700">{maleUsers}</h3>
                  </div>
                </div>
              </div>

              {/* Female Users Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full p-3 bg-purple-100">
                    <FaFemale className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Female Users</p>
                    <h3 className="text-2xl font-bold text-gray-700">{femaleUsers}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Gender</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.gender}</td>
                          <td className="px-4 py-3">{user.role}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementUsers;
