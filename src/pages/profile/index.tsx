import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service'; // Adjust the import path as needed
import Navbar from '../../component/includes/navbar';
import Footer from '../../component/includes/footer';

function Profile() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageType = localStorage.getItem('storageType');
    const storage = storageType === 'local' ? localStorage : sessionStorage;

    const storedUsername = storage.getItem('username');
    const storedEmail = storage.getItem('email');

    setUsername(storedUsername);
    setEmail(storedEmail);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login'; // Adjust the path as needed
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 shadow-2xl">
        <p className="text-red-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r  to-blue-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10 bg-">
        <div className=" rounded-lg shadow-lg p-8 max-w-lg mx-auto bg-slate-400">
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="rounded-full w-32 h-32 mb-4 border-4 border-blue-200 shadow-md"
            />
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">{username}</h2>
            <p className="text-gray-700 mb-4">{email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
