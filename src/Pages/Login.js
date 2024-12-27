import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService'; // Import the login service

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const credentials = { email, password };
      const responseMessage = await loginUser(credentials); // Call the login service

      if (responseMessage.token) {
        localStorage.setItem('token', responseMessage.token);
        localStorage.setItem('role', responseMessage.userRole);
        navigate('/dashboard');
      } else {
        setError(responseMessage.message);
      }
    } catch (err) {
      setError('Invalid email or password'); // Set error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#9c33b4] to-[#6a1b9a]">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border-2 border-[#bf57dd]">
        <h1 className="text-4xl font-bold text-[#bf57dd] text-center mb-6 animate__animated animate__fadeIn">
          Greenfuture Energy
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Welcome Back! Please Log In
        </h2>
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium animate__animated animate__fadeIn animate__delay-1.5s">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { borderRadius: '12px', padding: '12px' },
            }}
            className="border-[#bf57dd] focus:outline-none focus:ring-2 focus:ring-[#bf57dd] transition-all duration-300"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { borderRadius: '12px', padding: '12px' },
            }}
            className="border-[#bf57dd] focus:outline-none focus:ring-2 focus:ring-[#bf57dd] transition-all duration-300"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              backgroundColor: '#bf57dd', // Purple color for the button
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            className="hover:bg-[#9b47b8] transition-all duration-300"
          >
            Login
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Greenfuture Energy. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
