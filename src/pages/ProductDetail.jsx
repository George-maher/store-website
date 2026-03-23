import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../components/CartContext';
import { useTranslation } from '../utils/translations';
import ImageGallery from '../components/ImageGallery';
import RelatedProducts from '../components/RelatedProducts';
import { ShoppingCart, ArrowLeft, Package, CheckCircle, Heart, Share2, Star, Truck, Shield, RefreshCw } from 'lucide-react';

export default function ProductDetail({ lang }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const t = useTranslation(lang);
  const isEn = lang === 'en';
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(id ? '' : 'Product ID not provided');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'products', id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const productData = { id: docSnapshot.id, ...docSnapshot.data() };
        setProduct(productData);
        setError(null);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    }, (err) => {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock !== undefined && product.stock <= 0) return;
    
    // Add product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(newQuantity, product?.stock || 999));
    setQuantity(qty);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Toast notification will be handled by the calling component
    }
  };

  const renderRating = (rating = 0, reviews = 0) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating > 0 ? `${rating}.0` : 'New'}
          {reviews > 0 && ` (${reviews})`}
        </span>
      </div>
    );
  };

  const renderFeatures = () => {
    const features = [
      { icon: Truck, text: t.freeShipping },
      { icon: Shield, text: t.securePayment },
      { icon: RefreshCw, text: t.easyReturns }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200 dark:border-gray-700">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <feature.icon className="w-5 h-5" />
            <span className="text-sm">{feature.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Prepare images array
  const productImages = product?.images || [product?.image].filter(Boolean) || [];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t.loadingProduct}</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.productNotFound}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || t.productDoesNotExist}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition"
          >
            {t.goBack}
          </button>
        </div>
      </main>
    );
  }

  const isInStock = product.stock !== undefined ? product.stock > 0 : true;
  const hasOffer = product.discount || product.salePrice;
  const displayPrice = hasOffer ? product.salePrice : product.price;
  const originalPrice = hasOffer ? product.price : null;
  const maxQuantity = product.stock || 999;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button
            onClick={() => navigate('/')}
            className="hover:text-gray-900 dark:hover:text-white transition"
          >
            {t.home}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            <ImageGallery
              images={productImages}
              selectedIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              productName={product.name}
            />
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {/* Category */}
              {product.category && (
                <p className="text-sm text-brand font-medium uppercase tracking-wide mb-2">
                  {product.category}
                </p>
              )}

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {renderRating(product.rating, product.reviews)}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-brand">
                  {displayPrice} EGP
                </span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {originalPrice} EGP
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {t.save} {originalPrice - displayPrice} EGP
                    </span>
                  </>
                )}
              </div>

              {/* Offer Badge */}
              {hasOffer && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full mb-4">
                  <span>{t.sale}</span>
                  {product.discount && (
                    <span>{product.discount}% OFF</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t.description}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description || t.noDescription}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {t.inStock}
                    {product.stock && ` (${product.stock} available)`}
                  </span>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {t.outOfStock}
                  </span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              {isInStock && (
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">
                    {t.quantityLabel}
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 focus:outline-none bg-transparent"
                      min="1"
                      max={maxQuantity}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      disabled={quantity >= maxQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addedToCart}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 ${
                    addedToCart 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-500' 
                      : isInStock 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {t.addedToCart}
                    </>
                  ) : isInStock ? (
                    <>
                      <ShoppingCart className="inline-block w-5 h-5 mr-2" />
                      {t.addToCart}
                    </>
                  ) : (
                    t.outOfStock
                  )}
                </button>

                <button
                  onClick={handleWishlist}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Heart 
                    className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Features */}
            {renderFeatures()}

            {/* Additional Product Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.productDetails}
              </h3>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">
                    {t.sku}
                  </dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {product.sku || product.id}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">
                    {t.category}
                  </dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {product.category || t.uncategorized}
                  </dd>
                </div>
                {product.stock !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      {t.stock}
                    </dt>
                    <dd className="text-gray-900 dark:text-white font-medium">
                      {product.stock} {isEn ? t.items : 'قطع'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <RelatedProducts
            currentProductId={product.id}
            category={product.category}
            lang={lang}
          />
        </div>
      </div>
    </main>
  );
}
