import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaProjectDiagram, FaRegLightbulb, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const userRole = localStorage.getItem('role'); // Get user role from localStorage

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage on logout
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <div className="w-64 bg-gradient-to-r from-[#9c33b4] to-[#6a1b9a] text-white flex flex-col h-screen p-6 shadow-lg fixed top-0 left-0 z-10 overflow-y-auto">
      {/* Greenfuture Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center text-[#9c33b4] font-bold text-xl">
            GF
          </div>
          <span className="text-xl font-semibold">Greenfuture</span>
        </div>
      </div>

      <nav className="flex-1">
        <ul>
          {/* Conditional menu based on user role */}
          {userRole !== 'Employee' && (
            <>
              <li className="mb-6">
                <NavLink
                  to="/dashboard/regions"
                  className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
                  activeClassName="bg-white text-[#9c33b4]"
                >
                  <FaHome className="w-6 h-6" />
                  <span>Manage Regions</span>
                </NavLink>
              </li>
              <li className="mb-6">
                <NavLink
                  to="/dashboard/job"
                  className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
                  activeClassName="bg-white text-[#9c33b4]"
                >
                  <FaUser className="w-6 h-6" />
                  <span>Job Designations</span>
                </NavLink>
              </li>
              <li className="mb-6">
                <NavLink
                  to="/dashboard/employee"
                  className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
                  activeClassName="bg-white text-[#9c33b4]"
                >
                  <FaUsers className="w-6 h-6" />
                  <span>Manage Employees</span>
                </NavLink>
              </li>
              <li className="mb-6">
                <NavLink
                  to="/dashboard/project"
                  className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
                  activeClassName="bg-white text-[#9c33b4]"
                >
                  <FaProjectDiagram className="w-6 h-6" />
                  <span>Project Overview</span>
                </NavLink>
              </li>
              <li className="mb-6">
                <NavLink
                  to="/dashboard/incentive"
                  className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
                  activeClassName="bg-white text-[#9c33b4]"
                >
                  <FaRegLightbulb className="w-6 h-6" />
                  <span>Reward Distribution</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Always visible menu */}
          <li className="mb-6">
            <NavLink
              to="/dashboard/idea"
              className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
              activeClassName="bg-white text-[#9c33b4]"
            >
              <FaRegLightbulb className="w-6 h-6" />
              <span>Submit Idea</span>
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/dashboard/team"
              className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
              activeClassName="bg-white text-[#9c33b4]"
            >
              <FaUsers className="w-6 h-6" />
              <span>Collaboration Team</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-200"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
