// src/components/Login.jsx
import React, { useState } from 'react';
import { useApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const api = useApi();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', {
        username,
        password
      });
      login(response.data.access);
      // Redirect or show success message
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4">
      <div>
        <label htmlFor="username" className="block mb-2">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default Login;
