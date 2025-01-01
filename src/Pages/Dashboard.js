import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getYourProfile } from "../services/employeeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getYourProfile(token);
          setUsername(response.users.name);
        } else {
          console.error("Token not found!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#f1f1f1] to-[#e3e3e3] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full flex justify-between items-center p-6 bg-[#9c33b4] text-white">
          <div className="text-xl font-semibold">
            {loading ? 'Loading...' : `Welcome Back, ${username}!`}
          </div>
          <div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#9c33b4] cursor-pointer transition-all duration-300 hover:bg-[#f1f1f1]"
            onClick={handleProfileClick}
          >
            <FaUserCircle className="w-8 h-8 text-[#9c33b4]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
