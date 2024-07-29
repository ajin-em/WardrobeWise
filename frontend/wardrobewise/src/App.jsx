import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from '../src/components/Login';
import ProductList from '../src/components/ProductList';
import OrderProduct from '../src/components/OrderProduct';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl">My E-commerce App</h1>
        </header>
        <main className="p-4">
          <Login />
          <ProductList />
          <OrderProduct />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
