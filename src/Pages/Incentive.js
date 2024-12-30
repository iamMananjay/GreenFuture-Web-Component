import React, { useState, useEffect } from "react";
import { getAllIncentives, createIncentive, updateIncentive, deleteIncentive } from "../services/IncentiveService"; 
import { fetchTeams } from "../services/teamService"; 

const Incentive = () => {
  const [incentives, setIncentives] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editMode, setEditMode] = useState(false); 

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newIncentive, setNewIncentive] = useState({
    type: "Bonus", 
    amount: "",
    teamId: "", 
  });
  const [selectedIncentive, setSelectedIncentive] = useState(null); 

  useEffect(() => {
    const fetchIncentivesAndTeams = async () => {
      try {
        const incentivesData = await getAllIncentives();
        setIncentives(incentivesData);
        if (teams.length === 0) {
          const teamsData = await fetchTeams();
          setTeams(teamsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchIncentivesAndTeams();
  }, [teams.length]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncentive({ ...newIncentive, [name]: value });
  };

  const handleAddIncentive = async () => {
    try {
      const incentiveData = {
        type: newIncentive.type,
        team: { id: newIncentive.teamId }, 
        amount: newIncentive.amount,
      };

      if (editMode) {
        await updateIncentive(selectedIncentive.id, incentiveData);
      } else {
        await createIncentive(incentiveData);
      }

      const updatedIncentives = await getAllIncentives();
      setIncentives(updatedIncentives);

      setNewIncentive({
        type: "Bonus", 
        amount: "",
        teamId: "",
      });

      setIsFormVisible(false);
      setEditMode(false);

    } catch (error) {
      console.error("Error creating/updating incentive:", error);
    }
  };

  const handleEditIncentive = (incentive) => {
    setSelectedIncentive(incentive);
    setNewIncentive({
      type: incentive.type,
      amount: incentive.amount,
      teamId: incentive.team ? incentive.team.id : "",
    });
    setEditMode(true); 
    setIsFormVisible(true);
  };

  const handleDeleteIncentive = async (id) => {
    try {
      await deleteIncentive(id); 
      setIncentives(incentives.filter((incentive) => incentive.id !== id));
    } catch (error) {
      console.error("Error deleting incentive:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">Reward Management</h1>
      
      {/* Add New Incentive Button */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditMode(false); 
          }}
        >
          {isFormVisible ? "Close Form" : "Add New Incentive"}
        </button>
      </div>

      {/* Incentive Form */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center text-indigo-700">
            {selectedIncentive ? "Edit Incentive" : "Add New Incentive"}
          </h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Incentive Type</label>
            <select
              name="type"
              value={newIncentive.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Bonus">Bonus</option>
              <option value="Reward">Reward</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Amount (£)</label>
            <input
              type="number"
              name="amount"
              value={newIncentive.amount}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Team</label>
            <select
              name="teamId"
              value={newIncentive.teamId}
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
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddIncentive}
          >
            {selectedIncentive ? "Update Reward" : "Add Reward"}
          </button>
        </div>
      )}

      {/* Incentives Table */}
      <div>
        <table className="table-auto w-full border-collapse border border-gray-200 mt-4 rounded-lg">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="border border-gray-300 p-3 text-left text-sm font-medium">ID</th>
              <th className="border border-gray-300 p-3 text-left text-sm font-medium">Incentive Type</th>
              <th className="border border-gray-300 p-3 text-left text-sm font-medium">Team</th>
              <th className="border border-gray-300 p-3 text-left text-sm font-medium">Amount (£)</th>
              <th className="border border-gray-300 p-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incentives.map((incentive, index) => (
              <tr
                key={incentive.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-all`}
              >
                <td className="border border-gray-300 p-3 text-sm">{incentive.id}</td>
                <td className="border border-gray-300 p-3 text-sm">{incentive.type}</td>
                <td className="border border-gray-300 p-3 text-sm">{incentive.team ? incentive.team.name : "No Team"}</td>
                <td className="border border-gray-300 p-3 text-sm">{`£${incentive.amount}`}</td>
                <td className="border border-gray-300 p-3 text-sm flex space-x-2">
                  <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                      onClick={() => handleEditIncentive(incentive)}
                  >
                    Edit
                  </button>
                  <button
                      className="bg-red-500 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-600"
                      onClick={() => handleDeleteIncentive(incentive.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Incentive;
