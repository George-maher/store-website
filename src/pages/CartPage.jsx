import React from 'react';
import { useCart } from '../components/CartContext';
import { useTranslation } from '../utils/translations';

const WHATSAPP_NUMBER = '+201031149646';

function formatPrice(n) {
  return Number(n).toFixed(2);
}

export default function CartPage({ lang = 'en' }) {
  const isEn = lang === 'en';
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const t = useTranslation(lang);

  function handleCartOrder() {
    if (!cart || cart.length === 0) {
      alert(isEn ? 'Cart is empty' : 'السلة فارغة');
      return;
    }

    const greeting = isEn ? 'Hello, I would like to order:' : 'اهلا و سهلا انا حابب اطلب من عندك الحاجات دي:';
    const lines = cart.map((it, i) => `${i + 1}. ${it.name} — Qty: ${it.quantity} — $${formatPrice(it.price)}`);
    const totalLine = `Total: $${formatPrice(total)}`;

    const message = [greeting, '', ...lines, '', totalLine].join('\n');
    const encoded = encodeURIComponent(message);
    const phone = WHATSAPP_NUMBER.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, '_blank');
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t.yourCart}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{cart.length}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{isEn ? 'Items' : 'منتجات'}</div>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11V7a4 4 0 008 0v4m0-4v4m0-6V6a2 2 0 012-2h4a2 2 0 012 2v2m0-6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t.cartEmpty}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{isEn ? 'Start shopping to add items to your cart' : 'ابدأ التسوق لإضافة منتجات إلى سلتك'}</p>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2h-3" />
                </svg>
                {isEn ? 'Continue Shopping' : 'متابعة التسوق'}
              </button>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Cart Items Table */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <tr>
                        <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${!isEn ? 'text-right' : ''}`}>{t.product}</th>
                        <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${!isEn ? 'text-right' : ''}`}>{t.price}</th>
                        <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${!isEn ? 'text-right' : ''}`}>{t.quantity}</th>
                        <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${!isEn ? 'text-right' : ''}`}>{t.subtotal}</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {cart.map((it) => (
                        <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                          <td className={`px-4 sm:px-6 py-4 ${!isEn ? 'text-right' : ''}`}>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                                <img 
                                  src={it.image || '/images/placeholder.jpg'} 
                                  alt={it.name}
                                  className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{it.name}</h4>
                                {it.category && (
                                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                                    {it.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 sm:px-6 py-4 font-semibold text-gray-900 dark:text-white ${!isEn ? 'text-right' : ''}`}>EGP {formatPrice(it.price)}</td>
                          <td className={`px-4 sm:px-6 py-4 ${!isEn ? 'text-right' : ''}`}>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))}
                                className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => updateQuantity(it.id, parseInt(e.target.value) || 1)}
                                className={`w-16 text-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${!isEn ? 'text-right' : ''}`}
                              />
                              <button
                                onClick={() => updateQuantity(it.id, it.quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H8" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className={`px-4 sm:px-6 py-4 font-semibold text-gray-900 dark:text-white ${!isEn ? 'text-right' : ''}`}>EGP {formatPrice(it.price * it.quantity)}</td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            <button
                              onClick={() => removeFromCart(it.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="ml-1">{t.delete}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isEn ? 'Subtotal' : 'المجموع الفرعي'}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      EGP {formatPrice(total)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      {t.clear}
                    </button>
                    <button
                      onClick={handleCartOrder}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">🛒</span>
                      {t.orderNow}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
