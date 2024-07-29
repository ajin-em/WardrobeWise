import React, { useEffect, useState } from 'react';
import { useApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const api = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await api.get('list-products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [api, isAuthenticated]);

  const handleBuyClick = async (productVariantId) => {
    try {
      const response = await api.post('order-product/', {
        product_variant: productVariantId, // Adjust based on your actual variant id field
        quantity: 1, // Adjust as needed
      });
      console.log(response.data);
      // Update product list or show success message
    } catch (error) {
      console.error('Failed to order product', error);
    }
  };

  if (!isAuthenticated) {
    return <p>Please log in to view products.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id} className="mb-2 p-4 border rounded">
            <h2 className="text-lg">{product.ProductName}</h2>
            <img src={product.ProductImage} alt={product.ProductName} className="w-32 h-32 object-cover"/>
            <p>Stock: {product.TotalStock}</p>
            {product.variants && product.variants.map(variant => (
              <div key={variant.id} className="mt-2">
                <p>{variant.variantName}</p>
                <p>Variant Stock: {variant.stock}</p>
                <button 
                  onClick={() => handleBuyClick(variant.id)} 
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Buy Variant
                </button>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
