import React, { useState, useEffect } from "react";
import {
  createEmployee,
  getEmployees,
  updateEmployeeStatus,
  deleteEmployee,
} from "../services/employeeService";

import { fetchAllJobs } from "../services/JobService";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    gender: "",
    userRole: "",
    status: "active",
    designationId: "",
  });

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [jobDesignations, setJobDesignations] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchJobDesignations();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchJobDesignations = async () => {
    try {
      const data = await fetchAllJobs();
      setJobDesignations(data);
    } catch (error) {
      console.error("Error fetching job designations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [name]: value });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(newEmployee);
      setShowForm(false);
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        contact: "",
        gender: "",
        userRole: "",
        status: "active",
        designationId: "",
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployeeData = {
        name: editingEmployee.name,
        email: editingEmployee.email,
        password: editingEmployee.password,
        contact: editingEmployee.contact,
        gender: editingEmployee.gender,
        userRole: editingEmployee.userRole,
        status: "active",
        designation: editingEmployee.designationId
          ? { id: editingEmployee.designationId }
          : null,
      };

      await updateEmployeeStatus(editingEmployee.id, updatedEmployeeData);

      setEditingEmployee(null);
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      fetchEmployees();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const statusFilter =
      selectedStatus === "All" ||
      (selectedStatus === "Active" && employee.status === "active") ||
      (selectedStatus === "Inactive" && employee.status === "inactive");
    return statusFilter;
  });

  return (
    <div className="p-6 bg-white">
      <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">
        Employee Management
      </h1>

      <div className="mb-6 flex items-center justify-center space-x-4">
        <label className="text-lg text-gray-700">Filter by Status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-gray-700"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-red-500 text-center">No employees found.</p>
      ) : (
        <div className="space-y-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className={`flex items-center space-x-4 p-4 border rounded-lg ${
                employee.status === "inactive" ? "bg-gray-200" : "bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-3xl text-purple-600">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {employee.name}
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Email: {employee.email}</li>
                  <li>Contact: {employee.contact}</li>
                  <li>Gender: {employee.gender}</li>
                  <li>Status: {employee.status}</li>
                  <li>
                    Designation:{" "}
                    {employee.designation
                      ? employee.designation.name
                      : "Not Assigned"}
                  </li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                  >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-600"
                  >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEmployee(null);
          }}
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700"
        >
          Add Employee
        </button>
      </div>

      {showForm && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-10 rounded-xl shadow-2xl w-[600px]">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        {editingEmployee ? "Edit Employee" : "Add Employee"}
      </h2>
      <form
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
      >
        {["name", "email", "password", "contact"].map((field) => (
          <div className="mb-6" key={field}>
            <label
              htmlFor={field}
              className="block text-gray-200 text-lg mb-2 capitalize"
            >
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={
                editingEmployee ? editingEmployee[field] : newEmployee[field]
              }
              onChange={handleInputChange}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
              required
            />
          </div>
        ))}
        <div className="mb-6">
          <label htmlFor="gender" className="block text-gray-200 text-lg mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={
              editingEmployee ? editingEmployee.gender : newEmployee.gender
            }
            onChange={handleInputChange}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="userRole" className="block text-gray-200 text-lg mb-2">
            Role
          </label>
          <select
            id="userRole"
            name="userRole"
            value={
              editingEmployee ? editingEmployee.userRole : newEmployee.userRole
            }
            onChange={handleInputChange}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
            required
          >
            <option value="">Select Role</option>
            <option value="Innovation Manager">Innovation Manager</option>
            <option value="Regional IT Support">Regional IT Support</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="designationId"
            className="block text-gray-200 text-lg mb-2"
          >
            Job Designation (Optional)
          </label>
          <select
            id="designationId"
            name="designationId"
            value={
              editingEmployee
                ? editingEmployee.designation?.id || ""
                : newEmployee.designationId
            }
            onChange={handleInputChange}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
          >
            <option value="">Select Designation</option>
            {jobDesignations.map((designation) => (
              <option key={designation.id} value={designation.id}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg text-lg font-medium hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg text-lg font-medium hover:bg-purple-600 transition-all duration-300"
          >
            {editingEmployee ? "Update" : "Add"} Employee
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Employee;
