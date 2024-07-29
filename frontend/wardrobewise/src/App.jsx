import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Register from './components/Register';
import Login from './components/Login';
import Order from './components/Order';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access');

  return (
    <div className="app-container min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/register" />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
