import React, { useState } from 'react';
import axios from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/login/', formData)
      .then(response => {
        console.log('Logged in successfully');
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        navigate('/products');
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="login-container p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl mb-4">Login</h2>
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Username" 
          className="w-full mb-2 p-2 border rounded"
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Password" 
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;