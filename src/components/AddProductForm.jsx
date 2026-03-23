import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useTranslation } from '../utils/translations';

const AddProductForm = ({ lang = 'en' }) => {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cloudinary config
  const CLOUD_NAME = "drkudy9qj";
  const UPLOAD_PRESET = "react1_upload";

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      
      // Reset previews and create new ones for all selected files
      setImagePreviews([]);
      
      // Create previews for all selected files
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = reader.result;
            return newPreviews;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      
      // Reset previews and create new ones for all dropped files
      setImagePreviews([]);
      
      // Create previews for all dropped files
      droppedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = reader.result;
            return newPreviews;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      );

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject("Upload failed");
      xhr.send(formData);
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!files.length || !name || !price) {
      alert(isEn ? "Please fill all required fields and select at least one image" : "يرجى ملء جميع الحقول المطلوبة واختيار صورة واحدة على الأقل");
      return;
    }
    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload all images to Cloudinary
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Extract secure URLs from uploaded images
      const imageUrls = uploadedImages.map(img => img.secure_url);

      // Add product to Firestore with multiple images
      await addDoc(collection(db, "products"), {
        name,
        price,
        description,
        category,
        images: imageUrls, // Store array of image URLs
        createdAt: new Date(),
      });

      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setFiles([]);
      setImagePreviews([]);
      setUploadProgress(0);
      
      alert(isEn ? "Product added successfully ✅" : "تم إضافة المنتج بنجاح ✅");
    } catch {
      alert(isEn ? "Failed to add product" : "فشل في إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6 ${!isEn ? 'rtl' : ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {t.addNewProduct}
      </h2>
      <form onSubmit={handleAddProduct} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.productNameRequired}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${!isEn ? 'text-right' : ''}`}
                placeholder={isEn ? "e.g., Premium Sneakers" : "مثال: أحذية فاخرة"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.priceRequired}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${!isEn ? 'text-right' : ''}`}
                placeholder={isEn ? "e.g., 299" : "مثال: 299"}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${!isEn ? 'text-right' : ''}`}
                placeholder={isEn ? "Describe your product..." : "صف منتجك..."}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.selectCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${!isEn ? 'text-right' : ''}`}
              >
                <option value="">{t.selectCategory}</option>
                <option value="Socks">{isEn ? 'Socks' : 'جوارب'}</option>
                <option value="Caps">{isEn ? 'Caps' : 'قبعات'}</option>
                <option value="Wallets">{isEn ? 'Wallets' : 'محافظ'}</option>
                <option value="Shoes">{isEn ? 'Shoes' : 'أحذية'}</option>
                <option value="Apparel">{isEn ? 'Apparel' : 'ملابس'}</option>
                <option value="Accessories">{isEn ? 'Accessories' : 'إكسسوارات'}</option>
                <option value="Bags">{isEn ? 'Bags' : 'حقائب'}</option>
                <option value="Uncategorized">{isEn ? 'Uncategorized' : 'غير مصنف'}</option>
              </select>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.productImageRequired}
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>{isEn ? 'Upload files' : 'رفع ملفات'}</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        key={files.length}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        required={files.length === 0}
                      />
                    </label>
                    <p className="pl-1">{isEn ? 'or drag and drop' : 'أو اسحب وأفلت'}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isEn ? 'PNG, JPG, GIF up to 10MB each' : 'PNG, JPG, GIF حتى 10MB لكل ملف'}
                  </p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isEn ? 'Selected Images' : 'الصور المختارة'} ({files.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title={isEn ? 'Remove image' : 'إزالة الصورة'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEn ? 'Uploading images...' : 'جاري رفع الصور...'}
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setName("");
              setPrice("");
              setDescription("");
              setCategory("");
              setFiles([]);
              setImagePreviews([]);
              setUploadProgress(0);
            }}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {t.clearForm}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.uploading : t.addProduct}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;