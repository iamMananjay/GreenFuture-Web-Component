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
    <div className="w-64 bg-gradient-to-r from-[#9c33b4] to-[#6a1b9a] text-white flex flex-col h-full p-6 shadow-lg fixed top-0 left-0 z-10">
      {/* Greenfuture Logo at the Top */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center text-[#9c33b4] font-bold text-xl">
            GF
          </div>
          <span className="text-xl font-semibold">Greenfuture</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul>
          {/* Conditional menu based on user role */}
          {userRole !== 'Employee' && (
            <>
              <li className="mb-6 flex flex-col items-center transition-all duration-300">
                <NavLink
                  to="/dashboard/regions"
                  className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
                  activeClassName="bg-white text-[#9c33b4] scale-110"
                >
                  <FaHome className="w-8 h-8 transition-all duration-300" />
                  <span className="text-sm">Manage Regions</span>
                </NavLink>
              </li>
              <li className="mb-6 flex flex-col items-center transition-all duration-300">
                <NavLink
                  to="/dashboard/job"
                  className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
                  activeClassName="bg-white text-[#9c33b4] scale-110"
                >
                  <FaUser className="w-8 h-8 transition-all duration-300" />
                  <span className="text-sm">Job Designations</span>
                </NavLink>
              </li>
              <li className="mb-6 flex flex-col items-center transition-all duration-300">
                <NavLink
                  to="/dashboard/employee"
                  className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
                  activeClassName="bg-white text-[#9c33b4] scale-110"
                >
                  <FaUsers className="w-8 h-8 transition-all duration-300" />
                  <span className="text-sm">Manage Employees</span>
                </NavLink>
              </li>
              <li className="mb-6 flex flex-col items-center transition-all duration-300">
                <NavLink
                  to="/dashboard/project"
                  className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
                  activeClassName="bg-white text-[#9c33b4] scale-110"
                >
                  <FaProjectDiagram className="w-8 h-8 transition-all duration-300" />
                  <span className="text-sm">Project Overview</span>
                </NavLink>
              </li>
              <li className="mb-6 flex flex-col items-center transition-all duration-300">
                <NavLink
                  to="/dashboard/incentive"
                  className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
                  activeClassName="bg-white text-[#9c33b4] scale-110"
                >
                  <FaRegLightbulb className="w-8 h-8 transition-all duration-300" />
                  <span className="text-sm">Reward Distribution</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Always visible menu for everyone */}
          <li className="mb-6 flex flex-col items-center transition-all duration-300">
            <NavLink
              to="/dashboard/idea"
              className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
              activeClassName="bg-white text-[#9c33b4] scale-110"
            >
              <FaRegLightbulb className="w-8 h-8 transition-all duration-300" />
              <span className="text-sm">Submit Idea</span>
            </NavLink>
          </li>
          <li className="mb-6 flex flex-col items-center transition-all duration-300">
            <NavLink
              to="/dashboard/team"
              className="flex flex-col items-center space-y-2 p-2 hover:bg-white hover:text-[#9c33b4] hover:scale-105 rounded-lg transition-all duration-300"
              activeClassName="bg-white text-[#9c33b4] scale-110"
            >
              <FaUsers className="w-8 h-8 transition-all duration-300" />
              <span className="text-sm">Collaboration Team</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="mt-auto flex flex-col items-center">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 hover:bg-white hover:text-[#9c33b4] rounded-lg transition-all duration-300"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
