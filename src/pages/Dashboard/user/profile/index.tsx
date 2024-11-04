import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import Navbar from '../../../../component/includes/navbar';
import Footer from '../../../../component/includes/footer';

function Profile() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="rounded-full w-32 h-32 mb-4 border-4 border-blue-500 shadow-lg"
              />
              <h2 className="text-4xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-600 mt-2 text-lg">Web Developer & Designer</p>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900">About Me</h3>
              <p className="text-gray-700 mt-4 leading-relaxed text-center max-w-2xl mx-auto">
                I'm a passionate developer with a love for creating beautiful and functional web applications.
                I specialize in front-end development but am always expanding my knowledge across full-stack technologies.
              </p>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900">Contact Information</h3>
              <ul className="mt-4 space-y-2 text-center">
                <li className="text-gray-700 text-lg">
                  <strong>Email:</strong> <a href="mailto:john.doe@example.com" className="text-blue-600 hover:underline">john.doe@example.com</a>
                </li>
                <li className="text-gray-700 text-lg">
                  <strong>Phone:</strong> +123 456 789
                </li>
              </ul>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900">Social Media</h3>
              <div className="flex space-x-6 mt-6 justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition duration-200"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"   
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 transition duration-200"
                >
                  <FaLinkedinIn size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
