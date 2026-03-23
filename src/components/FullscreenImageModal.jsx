import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FullscreenImageModal({ isOpen, onClose, images, currentIndex, onImageChange, productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const handlePrevious = useCallback(() => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    onImageChange(newIndex);
  }, [currentImageIndex, images.length, onImageChange]);

  const handleNext = useCallback(() => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    onImageChange(newIndex);
  }, [currentImageIndex, images.length, onImageChange]);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    onImageChange(index);
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

  if (!isOpen) return null;

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors duration-200"
        aria-label="Close fullscreen view"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-center">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={getImageSrc(currentImage)}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-white/20 text-white px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative overflow-hidden rounded transition-all duration-200 ${
                index === currentImageIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getImageSrc(image)}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-16 h-16 object-cover"
              />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-white/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}
