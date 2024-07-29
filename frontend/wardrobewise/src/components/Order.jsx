import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const Order = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    axios.post('/order/')
      .then(response => setOrderDetails(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="order-container p-4">
      <h2 className="text-2xl mb-4">Order Summary</h2>
      {orderDetails.items.map(item => (
        <div key={item.id} className="order-item flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
          <div>
            <h3 className="text-lg font-bold">{item.product.ProductName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price}</p>
          </div>
        </div>
      ))}
      <div className="total text-right text-lg font-bold">
        Total: ${orderDetails.total}
      </div>
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => console.log('Order placed!')}
      >
        Place Order
      </button>
    </div>
  );
};

export default Order;
