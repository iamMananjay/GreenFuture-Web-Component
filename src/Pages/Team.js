import React, { useState, useEffect } from "react";
import {
  fetchTeams,
  fetchIdeas,
  fetchEmployees,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../services/teamService";
import { FaVideo, FaComments } from "react-icons/fa"; // Importing icons
import { getYourProfile } from "../services/employeeService"; // Import the profile service

const TeamForm = () => {
  const [teams, setTeams] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userProfile = await getYourProfile(token);
        setLoggedInUser(userProfile.users);

        const teamData = await fetchTeams();
        setTeams(teamData);

        const ideaData = await fetchIdeas();
        setIdeas(ideaData);

        const employeeData = await fetchEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewTeamName(e.target.value);
  };

  const handleIdeaChange = (e) => {
    setSelectedIdea(e.target.value);
  };

  const handleEmployeeSelect = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedMembers(selected);
  };

  const handleEditClick = (team) => {
    setNewTeamName(team.name);
    setSelectedIdea(team.idea.id.toString());
    setSelectedMembers(team.members.map((member) => member.id.toString()));
    setEditTeamId(team.id);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDeleteClick = async (teamId) => {
    try {
      await deleteTeam(teamId);
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamData = {
      name: newTeamName,
      idea: { id: selectedIdea },
      members: selectedMembers.map((memberId) => ({ id: memberId })),
    };

    try {
      if (isEditing) {
        await updateTeam(editTeamId, teamData);
      } else {
        await createTeam(teamData);
      }

      setShowForm(false);
      setNewTeamName("");
      setSelectedIdea("");
      setSelectedMembers([]);
      setEditTeamId(null);
      setIsEditing(false);

      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  const handleVideoClick = (teamName) => {
    const meetUrl = `https://meet.google.com/new`;
    window.open(meetUrl, "_blank");
  };

  const handleChatClick = (teamName) => {
    const chatUrl = `https://tawk.to/`;
    window.open(chatUrl, "_blank");
  };
  const role = localStorage.getItem('role');

  return (
    <div >
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Team Management Portal
      </h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length > 0 ? (
          teams
            .filter((team) =>
              team.members.some((member) => member.name === loggedInUser.name)
            )
            .map((team, index) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-bold text-purple-800 mb-2">
                  {team.name}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Idea:</strong> {team.idea.title}
                </p>
                <p className="text-gray-600">
                  <strong>Members:</strong>{" "}
                  {team.members.map((member) => member.name).join(", ")}
                </p>
                <div className="mt-4 flex justify-between">
                  {role !== "Employee" && (
                    <>
                      <button
                        onClick={() => handleEditClick(team)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(team.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleVideoClick(team.name)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    🎥 Video Call
                  </button>
                  <button
                    onClick={() => handleChatClick(team.name)}
                    className="text-green-600 hover:text-green-800"
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No teams available.
          </p>
        )}
      </div>
  
      {loggedInUser && loggedInUser.userRole !== "Employee" && (
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setNewTeamName("");
              setSelectedIdea("");
              setSelectedMembers([]);
            }}
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
          >
            ➕ Add Team
          </button>
        </div>
      )}
  
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
              {isEditing ? "Edit Team" : "Add New Team"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Team Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newTeamName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
  
              <div className="mb-4">
                <label
                  htmlFor="idea"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Select Idea
                </label>
                <select
                  id="idea"
                  value={selectedIdea}
                  onChange={handleIdeaChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select an Idea</option>
                  {ideas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mb-4">
                <label
                  htmlFor="members"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Select Members
                </label>
                <select
                  id="members"
                  multiple
                  value={selectedMembers}
                  onChange={handleEmployeeSelect}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
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
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                >
                  {isEditing ? "Update Team" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default TeamForm;
