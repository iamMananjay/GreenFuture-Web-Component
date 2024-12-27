import axios from "axios";
import { PROJECT_URL } from "../api/api";

// Get all projects
export const getProjects = async () => {
  try {
    const response = await axios.get(PROJECT_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Add a new project
export const addProject = async (project) => {
  try {
    const response = await axios.post(PROJECT_URL, project);  // Sending project data
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id, project) => {
  try {
    const response = await axios.put(`${PROJECT_URL}/${id}`, project);  // Correct URL format with project ID
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    await axios.delete(`${PROJECT_URL}/${id}`);  // Correct URL format with project ID
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
