import { useState } from 'react';
import { getResponsiveImageUrl } from '../api/cloudinary';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      // Show auth modal or redirect to login
      alert('Please log in to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      await axiosInstance.post('/cart', {
        product_id: product.id,
        quantity: 1,
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // Get optimized image URL
  const imageUrl = product.image_url 
    ? getResponsiveImageUrl(product.image_url, 800)
    : '/assets/americano.png'; // Fallback image

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Product Image with dark background */}
      <div className="relative h-72 overflow-hidden bg-[#30442B]">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-48 w-auto transform drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/americano.png';
            }}
          />
        </div>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-r from-[#30442B]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Added to cart overlay */}
        {addedToCart && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center">
            <div className="text-white text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-semibold">Added to Cart!</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col bg-white p-6">
        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#30442B]">
            {product.name}
          </h3>
        </div>
        
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-[#30442B]">
            ₱{parseFloat(product.price).toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || addedToCart}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors duration-300 ${
              addedToCart
                ? 'bg-green-500 cursor-default'
                : isAdding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#30442B] hover:bg-[#405939]'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {addedToCart ? '✓ Added' : isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
