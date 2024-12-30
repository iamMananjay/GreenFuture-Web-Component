import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getYourProfile } from "../services/employeeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // To handle loading state

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
          const response = await getYourProfile(token);
          setUsername(response.users.name);
        } else {
          console.error("Token not found!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#f1f1f1] to-[#e3e3e3]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col ml-64 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Welcome Section */}
        <div className="w-full flex justify-between items-center p-6 bg-[#9c33b4] text-white">
          <div className="flex items-center space-x-4">
            {loading ? (
              <span className="text-xl font-semibold">Loading...</span>
            ) : (
              <span className="text-xl font-semibold">Welcome Back, {username}!</span>
            )}
          </div>
          <div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#9c33b4] cursor-pointer transition-all duration-300 hover:bg-[#f1f1f1] hover:scale-110"
            onClick={handleProfileClick}
          >
            <FaUserCircle className="w-8 h-8 text-[#9c33b4]" />
          </div>
        </div>
        {/* dahkwhd */}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 mt-6">
          {/* Nested Routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
