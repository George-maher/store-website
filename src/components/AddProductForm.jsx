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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Cloudinary config
  const CLOUD_NAME = "drkudy9qj";
  const UPLOAD_PRESET = "react1_upload";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!file || !name || !price) {
      alert(isEn ? "Please fill all required fields and select an image" : "يرجى ملء جميع الحقول المطلوبة واختيار صورة");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      // استخدم XMLHttpRequest عشان Progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        );

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
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
      }).then(async (data) => {
        const imageUrl = data.secure_url;

        // إضافة المنتج في Firestore
        await addDoc(collection(db, "products"), {
          name,
          price,
          description,
          category,
          image: imageUrl,
          createdAt: new Date(),
        });

        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setFile(null);
        setProgress(0);
        alert(isEn ? "Product added successfully ✅" : "تم إضافة المنتج بنجاح ✅");
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert(isEn ? "Failed to add product. Check console." : "فشل في إضافة المنتج. تحقق من وحدة التحكم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6 ${!isEn ? 'rtl' : ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {t.addNewProduct}
      </h2>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">{t.productNameRequired}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">{t.priceRequired}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">{t.description}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">{t.category}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
          >
            <option value="">{t.selectCategory}</option>
            <option value="Socks">{t.socks}</option>
            <option value="Caps">{t.caps}</option>
            <option value="Wallets">{t.wallets}</option>
            <option value="Shoes">{t.shoes || 'Shoes'}</option>
            <option value="Apparel">{t.apparel || 'Apparel'}</option>
            <option value="Accessories">{t.accessories}</option>
            <option value="Bags">{t.bags}</option>
            <option value="Uncategorized">{t.uncategorized}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">{t.productImageRequired}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-700 dark:text-gray-200"
            required
          />
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded mt-2 h-3 dark:bg-gray-700">
              <div
                className="bg-blue-500 h-3 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold transition duration-300"
        >
          {loading ? t.uploading : t.addProduct}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;