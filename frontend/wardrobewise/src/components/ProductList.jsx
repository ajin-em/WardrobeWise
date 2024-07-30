import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../style.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/list-products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else {
          console.error('Error message:', error.message);
        }
      });

    axios.get('/cart/')
      .then(response => {
        setCartItems(response.data.items);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else {
          console.error('Error message:', error.message);
        }
      });
  }, []);

  const addToCart = (productId) => {
    axios.post('/cart/add/', { product_id: productId, quantity: 1 })
      .then(response => {
        console.log('Added to cart:', response.data);
        setCartItems([...cartItems, { product_id: productId }]);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else {
          console.error('Error message:', error.message);
        }
      });
  };

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  return (
    <div>
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-full h-48">
                <img
                  src={product.ProductImage}
                  alt={product.ProductName}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="p-2 text-center bg-black bg-opacity-50 text-rose-950">
                <h3 className="text-xl font-semibold mb-2 truncate">{product.ProductName}</h3>
                <p className="mb-1">{product.ProductCode}</p>
                <p className="text-lg font-semibold">${product.price}</p>
              </div>
              <div className="p-2 bg-gray-50 border-t border-gray-200 flex flex-col items-center">
                <button
                  className={`w-1/2 glass-effect text-white py-2 px-2 rounded-md text-sm font-semibold transition-colors duration-300 mb-2 ${isProductInCart(product.id) ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                  onClick={() => !isProductInCart(product.id) && addToCart(product.id)}
                  disabled={isProductInCart(product.id)}
                >
                  {isProductInCart(product.id) ? 'In Cart' : `Add to Cart`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
