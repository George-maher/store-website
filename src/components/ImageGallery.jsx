import React, { useState, useRef } from 'react';
import FullscreenImageModal from './FullscreenImageModal';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, selectedIndex, onImageSelect, productName }) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedIndex);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex] || images[0];

  const handleImageClick = () => {
    setIsFullscreenOpen(true);
  };

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    onImageSelect(index);
  };

  const handlePrevious = () => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    onImageSelect(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    onImageSelect(newIndex);
  };

  const getImageSrc = (image) => {
    if (!image) return '/images/placeholder.jpg';
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : 
             image.startsWith('/images/') ? image : 
             `/images/${image}`;
    }
    return image.url || '/images/placeholder.jpg';
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>

        {/* Main Image with Zoom Effect */}
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-square cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          <img
            src={getImageSrc(currentImage)}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZooming ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: isZooming ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
            }}
            loading="lazy"
          />
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative overflow-hidden rounded-lg transition-all duration-200 ${
                index === currentImageIndex
                  ? 'ring-2 ring-brand ring-offset-2 scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img
                src={getImageSrc(image)}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover"
                loading="lazy"
              />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-brand/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <FullscreenImageModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        images={images}
        currentIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        productName={productName}
      />
    </div>
  );
}
