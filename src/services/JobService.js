import axios from 'axios';
import { JOBDESIGNATIONS_URL } from '../api/api';


export const fetchAllJobs = async () => {
    try {
        const response = await axios.get(JOBDESIGNATIONS_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        const response = await axios.get(`${JOBDESIGNATIONS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching job with id ${id}:`, error);
        throw error;
    }
};

export const createJob = async (job) => {
    try {
        const response = await axios.post(JOBDESIGNATIONS_URL, job);
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJob = async (id, job) => {
    try {
        const response = await axios.put(`${JOBDESIGNATIONS_URL}/${id}`, job);
        return response.data;
    } catch (error) {
        console.error(`Error updating job with id ${id}:`, error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        await axios.delete(`${JOBDESIGNATIONS_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting job with id ${id}:`, error);
        throw error;
    }
};
