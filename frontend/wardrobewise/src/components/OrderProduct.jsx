import React, { useState } from 'react';
import { useApi } from '../utils/api';

const OrderProduct = () => {
  const [productVariantId, setProductVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('order-product/', { product_variant: productVariantId, quantity });
      alert('Order placed successfully');
    } catch (error) {
      console.error('Failed to place order', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div>
        <label htmlFor="productVariantId" className="block">Product Variant ID:</label>
        <input
          type="text"
          id="productVariantId"
          value={productVariantId}
          onChange={(e) => setProductVariantId(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Order</button>
    </form>
  );
};

export default OrderProduct;
