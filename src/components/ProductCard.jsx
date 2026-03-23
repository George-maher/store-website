import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useTranslation } from '../utils/translations';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

export default function ProductCard({ product, lang }) {
  const { addToCart } = useCart();
  const t = useTranslation(lang);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageSrc = (product) => {
    // Handle both single image and multiple images array
    if (product.images && product.images.length > 0) {
      return product.images[0]; // Use first image as main display
    } else if (product.image) {
      return product.image.startsWith('http')
        ? product.image
        : product.image.startsWith('/images/')
          ? product.image
          : `/images/${product.image}`;
    }
    return '/images/placeholder.jpg';
  };

  const imgSrc = getImageSrc(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Visual feedback
    const button = e.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Added!</span>`;
    button.classList.add('bg-green-600', 'hover:bg-green-700');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('bg-green-600', 'hover:bg-green-700');
    }, 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Could open a quick view modal here
    window.open(`/product/${product.id}`, '_blank');
  };

  const renderRating = (rating = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {rating > 0 ? `${rating}.0` : 'New'}
        </span>
      </div>
    );
  };

  const hasDiscount = product.discount || product.salePrice;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const originalPrice = hasDiscount ? product.price : null;

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl relative">
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlist}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              {product.discount ? `${product.discount}% OFF` : 'SALE'}
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          <img
            src={imgSrc}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Image count indicator for multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{product.images.length - 1}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col gap-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-brand font-medium uppercase tracking-wide">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {renderRating(product.rating)}

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand">
              {displayPrice} EGP
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice} EGP
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 
                  ? `${product.stock} in stock` 
                  : 'Out of stock'
                }
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              product.stock === 0 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-300 dark:border-gray-600' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-500 hover:border-blue-600'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={18} className="flex-shrink-0" />
              {product.stock === 0 
                ? (lang === 'en' ? 'Out of Stock' : 'نفد المخزون')
                : t.addToCart
              }
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
