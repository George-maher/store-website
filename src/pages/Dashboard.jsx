import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import AddProductForm from '../components/AddProductForm';
import { useTranslation } from '../utils/translations';

// Admin dashboard: add products and view existing ones
export default function Dashboard({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'recent'
  const [hiddenSampleIds, setHiddenSampleIds] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', category: '' });
  const [editLoading, setEditLoading] = useState(false);

  const sampleProducts = [
    { id: 's1', name: 'Cloud Runner Sneakers', description: 'Lightweight, breathable street sneakers.', price: '89', image: '/images/WhatsApp Image 2026-02-21 at 12.32.04 AM.jpeg', category: 'Shoes', createdAt: new Date('2026-02-21'), isSample: true },
    { id: 's2', name: 'Ocean Hoodie', description: 'Soft fleece hoodie with embroidered logo.', price: '59', image: '/images/WhatsApp Image 2026-02-21 at 12.32.02 AM (3).jpeg', category: 'Apparel', createdAt: new Date('2026-02-21'), isSample: true },
    { id: 's3', name: 'Neon Cap', description: 'Adjustable cap with neon piping.', price: '19', image: '/images/WhatsApp Image 2026-02-21 at 12.32.01 AM (2).jpeg', category: 'Accessories', createdAt: new Date('2026-02-21'), isSample: true },
  ];

  useEffect(() => {
    // realtime subscription to products so admin always sees all changes
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Failed to subscribe to products', err);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm(isEn ? 'Delete this product?' : 'حذف هذا المنتج؟')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert(isEn ? 'Failed to delete' : 'فشل في الحذف');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || ''
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        name: editForm.name,
        price: editForm.price,
        description: editForm.description,
        category: editForm.category,
        updatedAt: new Date()
      });
      
      setEditingProduct(null);
      setEditForm({ name: '', price: '', description: '', category: '' });
      alert(isEn ? 'Product updated successfully ' : 'تم تحديث المنتج بنجاح ');
    } catch (err) {
      console.error('Error updating product:', err);
      alert(isEn ? 'Failed to update product' : 'فشل في تحديث المنتج');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: '', price: '', description: '', category: '' });
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {t.adminDashboard}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.manageProducts}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{products.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t.totalProducts}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Section */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.addNewProduct}</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t.uploadInventory}</p>
              </div>
            </div>
            <AddProductForm lang={lang} />
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.productInventory}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t.viewCatalog}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${viewMode === 'all' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  {t.allProducts}
                </button>
                <button
                  onClick={() => setViewMode('recent')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${viewMode === 'recent' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  {t.recentProducts}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <tr>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.image}</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.productName}</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.price}</th>
                      <th className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.category}</th>
                      <th className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.created}</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {(() => {
                      const base = (products && products.length ? products : sampleProducts.filter(s => !hiddenSampleIds.includes(s.id)));
                      if (viewMode === 'recent') {
                        // sort by createdAt desc and take top 10
                        const toMillis = (t) => {
                          if (!t) return 0;
                          if (typeof t === 'number') return t;
                          if (typeof t.toMillis === 'function') return t.toMillis();
                          if (t.seconds) return t.seconds * 1000;
                          return 0;
                        };
                        return base
                          .slice()
                          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
                          .slice(0, 10)
                          .map((p) => p);
                      }
                      return base;
                    })().map((p) => {
                      const imgSrc = p.image
                        ? p.image.startsWith('http')
                          ? p.image
                          : p.image.startsWith('/images/')
                          ? p.image
                          : `/images/${p.image}`
                        : '/images/placeholder.jpg';

                      const createdAt = p.createdAt && p.createdAt.seconds ? new Date(p.createdAt.seconds * 1000) : p.createdAt ? new Date(p.createdAt) : null;

                      return (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                                <img className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl object-cover border border-gray-200 dark:border-gray-600" src={imgSrc} alt={p.name} />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{p.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-xs lg:max-w-sm">{p.description}</div>
                            <div className="sm:hidden mt-1">
                              <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {p.category || 'Uncategorized'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white"> {p.price} EGP</div>
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {p.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {createdAt ? createdAt.toLocaleDateString() : '-'}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="hidden sm:inline">{isEn ? 'Edit' : 'تعديل'}</span>
                              </button>
                              <button
                                onClick={() => p.isSample ? setHiddenSampleIds(prev => [...prev, p.id]) : handleDelete(p.id)}
                                className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-xl text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">{t.delete}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 ${!isEn ? 'rtl' : ''}`}>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                {isEn ? 'Edit Product' : 'تعديل المنتج'}
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">
                    {isEn ? 'Product Name' : 'اسم المنتج'}*
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">
                    {isEn ? 'Price' : 'السعر'}*
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">
                    {isEn ? 'Description' : 'الوصف'}
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">
                    {isEn ? 'Category' : 'الفئة'}
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${!isEn ? 'text-right' : ''}`}
                  >
                    <option value="">{isEn ? 'Select category' : 'اختر الفئة'}</option>
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

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {isEn ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-300 disabled:opacity-50"
                  >
                    {editLoading ? (isEn ? 'Updating...' : 'جاري التحديث...') : (isEn ? 'Update Product' : 'تحديث المنتج')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}