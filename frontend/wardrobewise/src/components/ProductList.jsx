import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/list-products/')
      .then(response => {
        console.log('Products data:', response.data);
        setProducts(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
        } else {
          console.error('Error message:', error.message);
        }
      });
  }, []);

  const addToCart = (productVariantId) => {
    axios.post('/cart/add/', { product_variant_id: productVariantId, quantity: 1 })
      .then(response => console.log('Added to cart:', response.data))
      .catch(error => {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
        } else {
          console.error('Error message:', error.message);
        }
      });
  };

  return (
    <div>
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-full h-48">
                <img
                  src={product.ProductImage}
                  alt={product.ProductName}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="p-2 text-center ">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate ">{product.ProductName}</h3>
                <p className="text-gray-600 mb-1">{product.ProductCode}</p>
                <p className="text-gray-900 text-lg font-semibold">${product.price}</p>
              </div>
              <div className="p-2 bg-gray-50 border-t border-gray-200 flex flex-col items-center">
                {product.variants && Array.isArray(product.variants) ? (
                  product.variants.map(variant => (
                    <button
                      key={variant.id || `no-id-${Math.random()}`} // Fallback key if id is missing
                      className="w-1/2 bg-green-500 text-white py-2 px-2 rounded-md text-sm font-semibold transition-colors duration-300 hover:bg-green-600 mb-2"
                      onClick={() => addToCart(variant.id)}
                    >
                      Add {variant.name} to Cart
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No variants available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
