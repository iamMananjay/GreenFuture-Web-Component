import { EMPLOYEE_URL,USER_DETAIL,REGION_URL } from '../api/api'; // Import the employee API URL
import axios from "axios";

// Fetch all employees
export const getEmployees = async () => {
  try {
    const response = await fetch(EMPLOYEE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }
    return await response.json(); // Return employee data

  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export const  getYourProfile=async(token)=>{
  try{
      const response = await axios.get(USER_DETAIL, 
      {
          headers: {Authorization: `Bearer ${token}`}
      })
      return response.data;
  }catch(err){
      throw err;
  }
}

// Create a new employee
export const createEmployee = async (employeeData) => {

  try {
    // Dynamic API call (uncomment when backend API is ready)
    const response = await fetch(EMPLOYEE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error("Failed to create employee");
    }

    return await response.json(); // Return created employee data

  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Update the status of an employee (active/inactive)
export const updateEmployeeStatus = async (employeeId, status) => {
  try {

    const response = await fetch(`${EMPLOYEE_URL}/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status ), // Pass the status in the request body
    });

    if (!response.ok) {
      const errorData = await response.json(); // Extract error details if available
      throw new Error(errorData.message || "Failed to update employee status");
    }

    const updatedEmployee = await response.json();

    return updatedEmployee; // Return the updated employee data
  } catch (error) {
    console.error("Error updating employee status:", error.message);
    throw error; // Re-throw the error for further handling
  }
};


export const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${EMPLOYEE_URL}/${employeeId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse JSON response
      throw new Error(errorData.message || "Failed to delete employee");
    }
       // If the response is 204, no content is expected
    if (response.status === 204) {
        return { success: true };
    }

    getEmployees();
    return await response.json();
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    throw error;
  }
};


// Fetch branches by region
export const getBranchesByRegion = async (region, token) => {
  try {
    const response = await axios.get(`${REGION_URL}/${region}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the headers
      }
    });
    return response.data; // Return branch data
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error; // Throw error to be handled by the caller
  }
};




