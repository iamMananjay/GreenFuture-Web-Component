import React, { useState, useEffect } from "react";
import {
  getAllRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "../services/regionService";
import { getEmployees } from "../services/employeeService";

const RegionComponent = () => {
  const [regions, setRegions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingRegionId, setEditingRegionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionData = await getAllRegions();
        setRegions(regionData);

        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewRegionName(e.target.value);
  };

  const handleMemberSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedMembers(selected);
  };

  const handleEdit = (region) => {
    setIsEditing(true);
    setEditingRegionId(region.id);
    setNewRegionName(region.name);
    setSelectedMembers(region.members.map((member) => member.id));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regionData = {
      name: newRegionName,
      members: selectedMembers.map((memberId) => ({ id: memberId })),
    };

    try {
      if (isEditing) {
        await updateRegion(editingRegionId, regionData);
      } else {
        await createRegion(regionData);
      }

      setShowForm(false);
      setIsEditing(false);
      setNewRegionName("");
      setSelectedMembers([]);

      const updatedRegions = await getAllRegions();
      setRegions(updatedRegions);
    } catch (error) {
      console.error("Error submitting region:", error);
    }
  };

  const handleDelete = async (regionId) => {
    try {
      await deleteRegion(regionId);
      setRegions((prevRegions) => prevRegions.filter((region) => region.id !== regionId));
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Region Management Title */}
        <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">
          Region Management
        </h1>

        {/* Regions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.length > 0 ? (
            regions.map((region, index) => (
              <div
                key={region.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105"
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`,
                }}
              >
                <h2 className="text-xl font-semibold text-gray-800">{region.name}</h2>
                <p className="text-gray-600 mt-2">
                  Members: {region.members.map((member) => member.name).join(", ")}
                </p>
                <div className="mt-4 flex justify-between gap-4">
                  <button
                    onClick={() => handleEdit(region)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(region.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No regions available.</p>
          )}
        </div>

        {/* Add Region Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false); // Set isEditing to false when adding a new region
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300"
          >
            Add New Region
          </button>
        </div>

      </div>

      {/* Modal for Add/Edit Region */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              {isEditing ? "Edit Region" : "Add New Region"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-200 mb-2">
                  Region Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newRegionName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="members" className="block text-gray-200 mb-2">
                  Select Members
                </label>
                <select
                  id="members"
                  multiple
                  value={selectedMembers}
                  onChange={handleMemberSelect}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  {isEditing ? "Update Region" : "Create Region"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionComponent;
