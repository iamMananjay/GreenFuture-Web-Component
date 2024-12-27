import React, { useEffect, useState } from "react";
import {
  fetchAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../services/JobService";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState({ name: "", salary: "" });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await fetchAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateJob(editId, job);
      } else {
        await createJob(job);
      }
      fetchJobs();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleEdit = (job) => {
    setJob(job);
    setIsEditing(true);
    setEditId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const resetForm = () => {
    setJob({ name: "", salary: "" });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700">Job Designations</h1>
        <p className="text-lg text-gray-600 mt-2">Manage job titles and salaries</p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            setShowForm(true); // Show the form
            setIsEditing(false); // Reset edit mode to false
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Add New Job
        </button>
      </div>


      <div className="overflow-x-auto">
        {jobs.length > 0 ? (
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Salary (£)</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={job.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}
                >
                  <td className="px-6 py-4">{job.id}</td>
                  <td className="px-6 py-4">{job.name}</td>
                  <td className="px-6 py-4">£{job.salary}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                      >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-600"
                      >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-6">No jobs available.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
              {isEditing ? "Edit Job" : "Add New Job"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={job.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Salary (£)</label>
                <input
                  type="number"
                  name="salary"
                  value={job.salary}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-300 ease-in-out"
                >
                  {isEditing ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
