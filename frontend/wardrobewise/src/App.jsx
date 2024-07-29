import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Register from './components/Register';
import Login from './components/Login';
import Order from './components/Order';

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('access');

  return (
    <div className="app-container p-4">
      <nav className="mb-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Store</Link>
        <div className="space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-blue-500">Login</Link>
              <Link to="/register" className="text-blue-500">Register</Link>
            </>
          ) : (
            <>
              <Link to="/products" className="text-blue-500">Products</Link>
              <Link to="/cart" className="text-blue-500">Cart</Link>
              <button onClick={handleLogout} className="text-blue-500">Logout</button>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/register" />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </div>
  );
};

export default App;
