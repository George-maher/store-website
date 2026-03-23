import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ currentProductId, category, lang }) {
  const isEn = lang === 'en';
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) return;

    let q;
    
    // Try to get products from the same category first
    if (category) {
      q = query(
        collection(db, 'products'),
        where('category', '==', category),
        limit(8)
      );
    } else {
      // If no category, get any products
      q = query(
        collection(db, 'products'),
        limit(8)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.id !== currentProductId); // Exclude current product
      
      setRelatedProducts(products.slice(0, 6)); // Limit to 6 related products
      setLoading(false);
    }, (error) => {
      console.error('Error fetching related products:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentProductId, category]);

  const getImageSrc = (image) => {
    if (!image) return '/images/placeholder.jpg';
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : 
             image.startsWith('/images/') ? image : 
             `/images/${image}`;
    }
    return image.url || '/images/placeholder.jpg';
  };

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {isEn ? 'Related Products' : 'منتجات ذات صلة'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEn ? 'Related Products' : 'منتجات ذات صلة'}
        </h2>
        <Link
          to="/"
          className="text-brand hover:text-brand/80 font-medium transition-colors"
        >
          {isEn ? 'View All' : 'عرض الكل'}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl">
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                <img
                  src={getImageSrc(product.image || product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Offer Badge */}
                {product.discount || product.salePrice ? (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {isEn ? 'SALE' : 'خصم'}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-brand transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-brand">
                    {product.salePrice || product.price} EGP
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.price} EGP
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
