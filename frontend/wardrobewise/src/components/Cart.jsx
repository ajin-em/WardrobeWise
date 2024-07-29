import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    axios.get('/cart/')
      .then(response => setCart(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleUpdateCartItem = (itemId, quantity) => {
    axios.put(`/cart/update/${itemId}/`, { quantity })
      .then(response => setCart(response.data))
      .catch(error => console.error(error));
  };

  const handleRemoveCartItem = (itemId) => {
    axios.delete(`/cart/remove/${itemId}/`)
      .then(response => setCart(response.data))
      .catch(error => console.error(error));
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div className="cart-container p-4">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
          <div>
            <h3 className="text-lg font-bold">{item.product.ProductName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded"
              onClick={() => handleRemoveCartItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="total text-right text-lg font-bold">
        Total: ${cart.total}
      </div>
      <button
        className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded"
        onClick={() => navigate('/order')}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
