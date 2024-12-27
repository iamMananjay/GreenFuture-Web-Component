import React, { useState, useEffect } from 'react';
import { getYourProfile } from "../services/employeeService"; // Assuming you have this service to get employee data

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    contact: '',
    gender: '',
    status: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  // Fetch user profile data (this can be the logged-in user's employee data)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await getYourProfile(token);

        setUser({
          name: response.users.name,
          email: response.users.email,
          role: response.users.userRole,
          contact: response.users.contact,
          gender: response.users.gender,
          status: response.users.status,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-white to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        User Profile
      </h1>
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Role
            </label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.role}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Contact
            </label>
            {isEditing ? (
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.contact}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Gender
            </label>
            {isEditing ? (
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.gender}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700">
              Status
            </label>
            {isEditing ? (
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 p-3 border border-purple-300 rounded-xl w-full focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{user.status}</p>
            )}
          </div>
        </div>
  
        <div className="mt-10 flex justify-end space-x-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
              >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Profile;
