import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    axios.get('/cart/')
      .then(response => setCartItems(response.data.items))
      .catch(error => console.error(error));
  }, []);

  const handleOrderSubmit = () => {
    const orderPromises = cartItems.map(item => {
      const orderData = {
        product_id: item.product.id,
        quantity: item.quantity,
      };
      console.log('Sending order data:', orderData);  
      return axios.post('/order/', orderData);
    });

    Promise.all(orderPromises)
      .then(responses => {
        setOrderDetails(responses.map(response => response.data));
        axios.delete('/cart/')
          .catch(error => console.error('Error clearing cart:', error));
      })
      .catch(error => console.error('Error placing order:', error));
  };

  if (cartItems.length === 0) return <div>Loading...</div>;

  return (
    <div className="order-container p-4">
      <h2 className="text-2xl mb-4">Order Summary</h2>
      {cartItems.map(item => (
        <div key={item.id} className="order-item flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
          <div>
            <h3 className="text-lg font-bold">{item.product.ProductName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price}</p>
          </div>
        </div>
      ))}
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleOrderSubmit}
      >
        Place Order
      </button>

      {orderDetails && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Order Details</h3>
          {orderDetails.map((order, index) => (
            <div key={index} className="order-item flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="text-lg font-bold">{order.product.ProductName}</h3>
                <p>Quantity: {order.quantity}</p>
                <p>Price: ${order.product.price}</p>
              </div>
            </div>
          ))}
          <div className="total text-right text-lg font-bold">
            Total: ${orderDetails.reduce((total, order) => total + order.product.price * order.quantity, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
