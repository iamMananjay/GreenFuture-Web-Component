import axios from "axios";
import { INCENTIVE_URL } from '../api/api'; // Import the login API URL

export const getAllIncentives = async () => {
  try {
    const response = await axios.get(`${INCENTIVE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incentives:", error);
    throw error;
  }
};

export const createIncentive = async (incentive) => {
  try {
    const response = await axios.post(`${INCENTIVE_URL}`, incentive);
    return response.data;
  } catch (error) {
    console.error("Error creating incentive:", error);
    throw error;
  }
};

export const updateIncentive = async (id, incentive) => {
  try {
    const response = await axios.put(`${INCENTIVE_URL}/${id}`, incentive);
    return response.data;
  } catch (error) {
    console.error("Error updating incentive:", error);
    throw error;
  }
};

export const deleteIncentive = async (id) => {
  try {
    const response = await axios.delete(`${INCENTIVE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting incentive:", error);
    throw error;
  }
};
