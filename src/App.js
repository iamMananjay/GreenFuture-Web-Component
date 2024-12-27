import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Regions from './Pages/Regions';
import Employee from './Pages/Employee';
import Idea from './Pages/Idea';
import Team from './Pages/Team';
import Project from './Pages/Project';
import Incentive from './Pages/Incentive';
import Profile from './Pages/Profile';
import Job from './Pages/Job';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<Idea />} /> {/* Default route */}
          <Route path="regions" element={<Regions />} />
          <Route path="job" element={< Job/>} />
          <Route path="employee" element={<Employee />} />
          <Route path="idea" element={<Idea />} />
          <Route path="team" element={<Team />} />
          <Route path="project" element={<Project />} />
          <Route path="incentive" element={<Incentive />} />
          <Route path="profile" element={<Profile />} />  {/* Profile route */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
