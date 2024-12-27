export const BASE_URL =  'http://localhost:8080'; // Update with your actual backend URL


// Login API
export const LOGIN_URL = `${BASE_URL}/auth/login`;

// Employee API
export const EMPLOYEE_URL = `${BASE_URL}/api/employees`;

export const IDEA_URL = `${BASE_URL}/api/ideas`;
export const USER_DETAIL = `${BASE_URL}/auth/get-profile`;
export const TEAM_DETAIL = `${BASE_URL}/api/teams`;
export const REGION_URL = `${BASE_URL}/api/regions`;  
export const PROJECT_URL = `${BASE_URL}/api/projects`;  
export const INCENTIVE_URL = `${BASE_URL}/api/incentives`;  
export const JOBDESIGNATIONS_URL = `${BASE_URL}/api/job-designations`; 
 





// Utility function for making API requests
export const apiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};





