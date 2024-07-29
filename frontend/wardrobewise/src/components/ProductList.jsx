import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/list-products/')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddToCart = (productVariantId) => {
    axios.post('/cart/add/', { product_variant: productVariantId, quantity: 1 })
      .then(response => console.log('Added to cart'))
      .catch(error => console.error(error));
  };

  return (
    <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <div key={product.id} className="product bg-white p-4 rounded-lg shadow">
          <img src={product.ProductImage} alt={product.ProductName} className="w-full h-48 object-cover rounded-t-lg" />
          <h3 className="mt-2 text-lg font-bold">{product.ProductName}</h3>
          <button 
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => handleAddToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
