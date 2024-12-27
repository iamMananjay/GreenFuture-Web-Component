
import { LOGIN_URL } from '../api/api'; // Import the login API URL

export const loginUser = async (credentials) => {
  try {
      const response = await fetch(LOGIN_URL, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
      });

      if (!response.ok) {
          throw new Error("Failed to log in");
      }

      return await response.json(); // Here you should return the response data as is
  } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Rethrow the error so that it can be handled in the component
  }
};




