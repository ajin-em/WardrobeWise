import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

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

  const handleOrderSubmit = () => {
    const orderData = cart.items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));
    
    axios.post('/order/', { items: orderData })
      .then(response => {
        console.log('Order placed successfully:', response.data);
        navigate('/order-summary');
      })
      .catch(error => console.error('Error placing order:', error));
  };

  if (!cart) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Your Cart</h2>
      {cart.items.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div>
          {cart.items.map(item => (
            <div
              key={item.id}
              className="cart-item flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.product.ProductName}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-900">Price: ${item.product.price}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded transition-colors duration-300 hover:bg-blue-600"
                  onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded transition-colors duration-300 hover:bg-red-600"
                  onClick={() => handleRemoveCartItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="total text-right text-lg font-bold mt-4">
            Total: ${cart.total}
          </div>
          <button
            className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-green-600"
            onClick={handleOrderSubmit}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
