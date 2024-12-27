import React, { useState, useEffect } from "react";
import { getProjects, addProject, deleteProject } from "../services/projectService";
import { fetchIdeas } from "../services/ideaService";
import { fetchTeams } from "../services/teamService";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    team: "",
    idea: "",
    stage: "Pending",
  });

  const [teams, setTeams] = useState([]);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjectsData();
  }, []);

  const fetchTeamsAndIdeas = async () => {
    try {
      const teamResponse = await fetchTeams();
      const ideaResponse = await fetchIdeas();
      setTeams(teamResponse);
      setIdeas(ideaResponse);
    } catch (error) {
      console.error("Error fetching teams or ideas:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddOrUpdateProject = async () => {
    try {
      if (editMode) {
        const updatedProject = {
          id: editProjectId,
          name: newProject.name,
          team: { id: newProject.team },
          idea: { id: newProject.idea },
          stage: newProject.stage,
        };

        await addProject(updatedProject);
      } else {
        const projectData = {
          name: newProject.name,
          team: { id: newProject.team },
          idea: { id: newProject.idea },
          stage: newProject.stage,
        };

        await addProject(projectData);
      }

      const updatedProjects = await getProjects();
      setProjects(updatedProjects);

      setNewProject({
        name: "",
        team: "",
        idea: "",
        stage: "Pending",
      });

      setIsFormVisible(false);
      setEditMode(false);
      setEditProjectId(null);
    } catch (error) {
      console.error("Error adding or updating project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditProject = (project) => {
    setNewProject({
      name: project.name,
      team: project.team?.id || "",
      idea: project.idea?.id || "",
      stage: project.stage,
    });
    setEditMode(true);
    setEditProjectId(project.id);
    setIsFormVisible(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700">Projects</h1>
        <p className="text-lg text-gray-600 mt-2">Manage your projects and teams</p>
      </div>

      <div className="flex justify-center mb-6">
  <button
    onClick={() => {
      setIsFormVisible(!isFormVisible);
      if (!isFormVisible) {
        fetchTeamsAndIdeas();
        setEditMode(false); // Reset editMode to false when opening the form
        setEditProjectId(null); // Reset the project ID when adding a new project
      }
    }}
    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    {isFormVisible ? "Close Form" : "Add New Project"}
  </button>
</div>


      <div className="overflow-x-auto">
        {projects.length > 0 ? (
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-left">Idea</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}
                >
                  <td className="px-6 py-4">{project.name}</td>
                  <td className="px-6 py-4">{project.team?.name || "No Team"}</td>
                  <td className="px-6 py-4">{project.idea?.title || "No Idea"}</td>
                  <td className="px-6 py-4">{project.stage}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
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
          <p className="text-center text-gray-600 mt-6">No projects available.</p>
        )}
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
              {editMode ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleAddOrUpdateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Team</label>
                <select
                  name="team"
                  value={newProject.team}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Idea</label>
                <select
                  name="idea"
                  value={newProject.idea}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Idea</option>
                  {ideas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  name="stage"
                  value={newProject.stage}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-300 ease-in-out"
                >
                  {editMode ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
