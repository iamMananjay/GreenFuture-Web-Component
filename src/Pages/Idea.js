import React, { useState, useEffect } from 'react';
import { getYourProfile } from "../services/employeeService";
import { FaSpinner, FaThumbsUp, FaThumbsDown, FaTimesCircle, FaPaperclip } from 'react-icons/fa';

import {
  fetchIdeas,
  submitIdea,
  updateIdea,
  deleteIdea,
  voteOnIdea,
  downloadFile,
  fetchComments,
  addCommentToIdea,
} from '../services/ideaService';

const Idea = () => {
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const [editingIdea, setEditingIdea] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [showAddComment, setShowAddComment] = useState({});
const [newCommentContent, setNewCommentContent] = useState({});
const [showComments, setShowComments] = useState({});
const [comments, setComments] = useState({});
const [isSyncing, setIsSyncing] = useState(false);
const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getYourProfile(token);
        setUserEmail(response.users.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    fetchIdeasData();
  }, []);

  const fetchIdeasData = async () => {
    try {
      const data = await fetchIdeas();
      setIdeas(data);

      const userVotesData = {};
      data.forEach((idea) => {
        if (idea.votes && idea.votes.some(vote => vote.userEmail === userEmail)) {
          const userVote = idea.votes.find(vote => vote.userEmail === userEmail);
          userVotesData[idea.id] = userVote.voteType;
        }
      });
      setUserVotes(userVotesData);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  const filterTopIdeas = () => {
    setLoading(true);
    setTimeout(() => {
      const sortedIdeas = [...ideas].sort((a, b) => b.voteCount - a.voteCount);
      const topIdeas = sortedIdeas.slice(0, 2);
      setFilteredIdeas(topIdeas);
      setLoading(false);
    }, 5000);
  };

  const showAllIdeas = () => {
    setShowAll(true);
    setFilteredIdeas([]);
  };

  const toggleFormVisibility = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      resetForm();
    }
  };

  const resetForm = () => {
    setIdeaTitle('');
    setIdeaDescription('');
    setEditingIdea(null);
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  // Prepare the idea object
  const newIdea = {
    title: ideaTitle,
    description: ideaDescription,
    status: 'pending',
    voteCount: 0,
    submittedBy: userEmail,
  };
  const token = localStorage.getItem('token');
  
  // Create FormData for multipart request
  const formData = new FormData();

  // Append the idea object as a JSON string
  formData.append("idea", JSON.stringify(newIdea));

  // Check if there's an attachment, and append the file(s)
  if (attachment) {
      formData.append("files", attachment);
  }

  try {
    // Make API call depending on whether you're creating or updating the idea
    if (editingIdea) {
      // Update the idea
      await updateIdea(editingIdea.id, formData, token);
    } else {
      // Submit the new idea with the file attachment
      await submitIdea(formData, token);
    }

    // Reset form fields after successful submission
    resetForm();
    setShowForm(false);

    // Optionally refresh ideas data
    fetchIdeasData();
  } catch (error) {
    console.error('Error submitting or updating idea:', error);
  }
};

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setIdeaTitle(idea.title);
    setIdeaDescription(idea.description);
    setShowForm(true);
  };

  const handleDelete = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(ideaId);
        fetchIdeasData();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleVote = async (ideaId, voteType) => {
    try {
      await voteOnIdea(ideaId, userEmail, voteType);
      fetchIdeasData();
    } catch (error) {
      console.error('Error voting on idea:', error);
    }
  };
  const role = localStorage.getItem('role');
   // Handle file download when the user clicks on the download link
   const handleDownloadFile = (ideaId, fileName) => {
    // Call the service method to download the file
    downloadFile(ideaId, fileName);
  }; 

  const toggleAddComment = (ideaId) => {
    // Toggle the visibility of the "Add Comment" box for the specific idea
    setShowAddComment((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
  };
  
  const toggleShowComments = async (ideaId) => {
    try {
      // Toggle the visibility of the comments section
      setShowComments((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
  
      // Fetch comments only if the comments section is being opened
      if (!showComments[ideaId]) {
        const fetchedComments = await fetchComments(ideaId); // Fetch comments from the backend
        setComments((prev) => ({ ...prev, [ideaId]: fetchedComments }));
      }
    } catch (error) {
      console.error(`Failed to fetch comments for idea ${ideaId}:`, error);
      // Optionally, show an error message to the user
    }
  };
  
  const handleAddComment = async (ideaId) => {
    const content = newCommentContent[ideaId];
    if (!content.trim()) {
      // Optional: Show a warning if the comment is empty or only whitespace
      console.warn('Comment content cannot be empty.');
      return;
    }
  
    try {
      await addCommentToIdea(ideaId, content,userEmail); // Add the comment to the backend
      const updatedComments = await fetchComments(ideaId); // Fetch updated comments
      setComments((prev) => ({ ...prev, [ideaId]: updatedComments }));
      setNewCommentContent((prev) => ({ ...prev, [ideaId]: '' })); // Clear the input box
    } catch (error) {
      console.error(`Failed to add comment for idea ${ideaId}:`, error);
      // Optionally, show an error message to the user
    }
  };

  const syncOfflineIdeas = async () => {
    setIsSyncing(true);
    setToastMessage(""); // Clear previous toast messages

    // Simulate a delay for syncing (e.g., 5 seconds)
    setTimeout(() => {
      setIsSyncing(false);
      setToastMessage("No offline data to sync. Everything Upto date.");

      // Remove the toast message after 5 seconds
      setTimeout(() => {
        setToastMessage(""); // Clear the message after another 5 seconds
      }, 5000);
    }, 5000);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h3 className="text-4xl font-bold text-center text-gray-800 mb-8">Ideas</h3>
  
      {/* Sync Offline Ideas Button */}
      {role !== "Employee" && (
        <div className="flex justify-end mb-8">
          <button
            onClick={syncOfflineIdeas}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
          >
            Sync Offline Ideas
          </button>
        </div>
      )}
  
      {/* Syncing Animation */}
      {isSyncing && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin text-yellow-500 text-4xl">
            <FaSpinner />
          </div>
          <div className="ml-4">
            <p className="text-lg text-gray-600">Syncing offline ideas...</p>
            <p className="font-semibold text-yellow-600 animate-pulse">Please wait!</p>
          </div>
        </div>
      )}
  
      {/* Toast Message */}
      {toastMessage && (
        <div className="mt-8 bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md">
          {toastMessage}
        </div>
      )}
  
      {/* Filter and Show All Ideas Buttons */}
      {role !== "Employee" && (
        <>
          {ideas.length !== 0 && (
            <button
              onClick={filterTopIdeas}
              className="bg-green-600 text-white px-6 py-3 rounded-lg mt-8 hover:bg-green-700 transition duration-300"
            >
              Filter Top Ideas (AI)
            </button>
          )}
  
          {filteredIdeas.length > 0 && !loading && (
            <button
              onClick={showAllIdeas}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
            >
              Show All Ideas
            </button>
          )}
        </>
      )}
  
      {/* Loading Animation for AI Filtering */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin text-blue-500 text-4xl">
            <FaSpinner />
          </div>
          <div className="ml-4">
            <p className="text-lg text-gray-600">AI Filtering in progress...</p>
            <p className="font-semibold text-blue-600 animate-pulse">Magic is happening!</p>
          </div>
        </div>
      )}
  
      {/* Ideas Display Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            <div>
              <h4 className="text-2xl font-semibold text-gray-800">{idea.title}</h4>
              <p className="text-gray-600 mt-2">{idea.description}</p>
              <p className="text-sm text-gray-500 mt-2">Votes: {idea.voteCount}</p>
              <p className="text-sm text-gray-500">Posted By: {idea.submittedBy}</p>
  
              {/* Attachments */}
              {idea.attachedFiles && idea.attachedFiles.length > 0 && (
                <div className="mt-4">
                  {idea.attachedFiles.map((fileName, fileIndex) => (
                    <div key={fileIndex} className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDownloadFile(idea.id, fileName)}
                        className="text-blue-500 hover:text-blue-600 transition duration-300"
                      >
                        Download {fileName}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            {/* Buttons for Edit, Delete, and Voting */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center space-x-4">
                {idea.submittedBy === userEmail && (
                  <>
                    <button
                      onClick={() => handleEdit(idea)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
  
              <div className="flex items-center space-x-4">
                {idea.submittedBy !== userEmail && (
                  <>
                    {idea.votes.some((vote) => vote.userEmail === userEmail) ? (
                      <button
                        onClick={() => handleVote(idea.id, 'remove')}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                      >
                        Remove Vote
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVote(idea.id, 'add')}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        Vote
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
  
            {/* Comment Section */}
            <div className="mt-6">
              <button
                onClick={() => toggleAddComment(idea.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
              >
                {showAddComment[idea.id] ? 'Close Add Comment' : 'Add Comment'}
              </button>
              <button
                onClick={() => toggleShowComments(idea.id)}
                className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 ml-4 transition duration-300"
              >
                {showComments[idea.id] ? 'Close Comments' : 'Show Comments'}
              </button>
  
              {/* Add Comment Box */}
              {showAddComment[idea.id] && (
                <div className="mt-6">
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    placeholder="Write your comment..."
                    value={newCommentContent[idea.id] || ''}
                    onChange={(e) =>
                      setNewCommentContent({
                        ...newCommentContent,
                        [idea.id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleAddComment(idea.id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 mt-4 transition duration-300"
                  >
                    Submit Comment
                  </button>
                </div>
              )}
  
              {/* Show Comments List */}
              {showComments[idea.id] && (
                <div className="mt-6 space-y-4">
                  {comments[idea.id]?.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <p className="font-semibold">{comment.commentedBy}</p>
                      <p className="text-gray-600">{comment.content}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.commentedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
  
      {showForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg mx-auto relative"
    >
      <h4 className="text-2xl font-semibold text-gray-800 mb-6">
        {editingIdea ? 'Update Idea' : 'Submit New Idea'}
      </h4>
      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          Idea Title
        </label>
        <input
          type="text"
          id="title"
          value={ideaTitle}
          onChange={(e) => setIdeaTitle(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg"
          placeholder="Enter idea title"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 mb-2">
          Idea Description
        </label>
        <textarea
          id="description"
          value={ideaDescription}
          onChange={(e) => setIdeaDescription(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg"
          placeholder="Enter idea description"
          required
        />
      </div>

      {/* Attachment File Input */}
      <div className="mb-6">
        <label htmlFor="attachment" className="block text-gray-700 mb-2 flex items-center">
          <FaPaperclip className="mr-3" /> Attach a file
        </label>

        {/* Display existing attachment if editing */}
        {editingIdea && editingIdea.attachedFiles && editingIdea.attachedFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-700">Existing attachment:</p>
            <a
              href={`your_file_server_url/${editingIdea.attachedFiles[0]}`} // Provide the correct URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {editingIdea.attachedFiles[0]} {/* File name */}
            </a>
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          id="attachment"
          onChange={(e) => setAttachment(e.target.files[0])}
          className="p-4 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
      >
        {editingIdea ? 'Update Idea' : 'Submit Idea'}
      </button>

      {/* Close Button */}
      <button
        type="button"
        onClick={toggleFormVisibility}
        className="bg-gray-500 text-white px-6 py-3 rounded-full ml-4 hover:bg-gray-600 transition duration-300"
      >
        <FaTimesCircle className="inline-block mr-2" /> Close Form
      </button>
    </form>
  </div>
)}

  
      {/* Button to open the form */}
      {!showForm && (
        <button
          onClick={toggleFormVisibility}
          className="bg-green-600 text-white px-6 py-3 rounded-lg mt-8 hover:bg-green-700 transition duration-300"
        >
          Submit New Idea
        </button>
      )}
    </div>
  );
  
  
  
};

export default Idea ;
