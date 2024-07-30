import React, { useState } from 'react';
import axios from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '' // Ensure this matches the backend expectation
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
    axios.post('/register/', formData)
      .then(response => {
        console.log('Registered successfully');
        navigate('/login');
      })
      .catch(error => {
        if (error.response) {
          console.error('Error:', error.response.data);
        } else if (error.request) {
          console.error('Error:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      });
  };

  return (
    <div className="register-container bg-gray-100 flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-2xl mb-4">Register</h2>
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Username" 
          className="w-full mb-2 p-2 border rounded"
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          className="w-full mb-2 p-2 border rounded"
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Password" 
          className="w-full mb-2 p-2 border rounded"
        />
        <input 
          type="password" 
          name="confirm_password" 
          value={formData.confirm_password} 
          onChange={handleChange} 
          placeholder="Confirm Password" 
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
