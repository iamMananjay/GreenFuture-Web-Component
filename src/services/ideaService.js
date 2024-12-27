import { IDEA_URL } from '../api/api';
import axios from "axios";


export const fetchIdeas = async () => {
  try {
    const response = await fetch(IDEA_URL, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
    },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ideas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }
};


export const voteOnIdea = async (ideaId, userEmail, voteType) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    let endpoint;
    let method;

    // Determine the endpoint and method based on the vote type
    if (voteType === 'add') {
      endpoint = `${IDEA_URL}/${ideaId}/vote?userEmail=${encodeURIComponent(userEmail)}`;
      method = 'POST';
    } else if (voteType === 'remove') {
      endpoint = `${IDEA_URL}/${ideaId}/unvote?userEmail=${encodeURIComponent(userEmail)}`;
      method = 'DELETE';
    } 

    // Send the request
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the token for authentication
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${voteType} idea: ${response.statusText}`);
    }

    // No need to process response data as we don't need to update the frontend with new data
  } catch (error) {
    console.error(`Error trying to ${voteType} idea:`, error);
    throw error;
  }
};


export const checkUserVote = async (ideaId, userEmail) => {
  try {
    const response = await fetch(`${IDEA_URL}/${ideaId}/vote/check?userEmail=${userEmail}`);
    if (response.ok) {
      const hasVoted = await response.json();
      return hasVoted; // Returns true or false based on whether the user has voted
    } else {
      throw new Error('Error checking user vote');
    }
  } catch (error) {
    console.error('Error checking user vote:', error);
    throw error;
  }
};
export const updateIdea = async (ideaId, formData, token) => {
  console.log(ideaId, formData, token);
    const response = await fetch(`${IDEA_URL}/${ideaId}`, {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
      body: formData, // The formData will automatically set the correct Content-Type
  });

  if (response.ok) {
      const result = await response.json();
  } else {
      console.error('Error updating idea');
  }
};

// Delete an idea
export const deleteIdea = async (ideaId) => {
  try {
    const response = await fetch(`${IDEA_URL}/${ideaId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json(); // Parse JSON response
      throw new Error(errorData.message || "Failed to delete idea");
    }
    return { message: 'Idea deleted successfully' };
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
};

export const submitIdea = async (formData, token) => {
  const response = await fetch(IDEA_URL, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
      body: formData, // The formData will automatically set the correct Content-Type
  });

  if (response.ok) {
      const result = await response.json();
      console.log('Idea submitted successfully', result);
  } else {
      console.error('Error submitting idea');
  }
};

// fileService.js

// Function to handle downloading the file
export const downloadFile = async (ideaId, fileName) => {
  try {
    // Construct the URL for the file
    const fileUrl = `${IDEA_URL}/${ideaId}/files/${fileName}`;

    // Fetch the file from the backend
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('File download failed');
    }

    // Convert the response into a Blob object
    const blob = await response.blob();

    // Create an object URL for the Blob and trigger a download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // The name the file will have when downloaded
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up the object URL after the download
  } catch (error) {
    console.error('Download error:', error);
    alert('There was an issue downloading the file');
  }
};

/**
 * Fetch comments for a specific idea.
 * @param {number} ideaId - The ID of the idea.
 * @returns {Promise<Array>} - A promise that resolves to an array of comments.
 */
export const fetchComments = async (ideaId) => {
  try {
    const response = await axios.get(`${IDEA_URL}/${ideaId}/comments`);
    return response.data; // Assuming the backend returns an array of comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Add a new comment to a specific idea.
 * @param {number} ideaId - The ID of the idea.
 * @param {string} content - The content of the comment.
 * @param {string} commentedBy - The email or name of the user adding the comment.
 * @returns {Promise<Object>} - A promise that resolves to the added comment.
 */
export const addCommentToIdea = async (ideaId, content, commentedBy) => {
  try {
    // Send the data as query parameters
    const response = await axios.post(
      `${IDEA_URL}/${ideaId}/comments`,
      null, // No request body since parameters are in the URL
      {
        params: {
          content: content || '', // Ensure content is not undefined
          commentedBy: commentedBy || '', // Ensure commentedBy is not undefined
        },
      }
    );
    return response.data; // Assuming the backend returns the added comment
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};




