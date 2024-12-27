// services/regionService.js
import { REGION_URL } from '../api/api'; // Import the REGION_URL
import axios from "axios";



/**
 * Fetch all regions
 * @returns {Promise} List of regions
 */
export const getAllRegions = async () => {
  try {
    const response = await axios.get(REGION_URL);
    return response.data; // Assuming the API returns data in the `data` field
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
};

/**
 * Create a new region
 * @param {Object} regionData - Data for the new region
 * @returns {Promise} Created region
 */
  export const createRegion = async (regionData) => {
    try {
      const response = await fetch(REGION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token logic

        },
        body: JSON.stringify(regionData),
      });
      if (!response.ok) throw new Error("Failed to create region");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


/**
 * Update an existing region
 * @param {string} regionId - ID of the region to update
 * @param {Object} regionData - Updated data for the region
 * @returns {Promise} Updated region
 */
export const updateRegion = async (regionId, regionData) => {
  try {
    const response = await axios.put(`${REGION_URL}/${regionId}`, regionData);
    return response.data;
  } catch (error) {
    console.error("Error updating region:", error);
    throw error;
  }
};

/**
 * Delete a region
 * @param {string} regionId - ID of the region to delete
 * @returns {Promise} Success message
 */
export const deleteRegion = async (regionId) => {
  try {
    const response = await axios.delete(`${REGION_URL}/${regionId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting region:", error);
    throw error;
  }
};


