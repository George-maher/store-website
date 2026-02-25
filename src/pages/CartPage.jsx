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
    <main className={`py-8 ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{t.yourCart}</h2>

        {cart.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow">{t.cartEmpty}</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">{t.product}</th>
                    <th className="text-left p-3">{t.price}</th>
                    <th className="text-left p-3">{t.quantity}</th>
                    <th className="text-left p-3">{t.subtotal}</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-3">{it.name}</td>
                      <td className="p-3">${formatPrice(it.price)}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => updateQuantity(it.id, e.target.value)}
                          className="w-20 p-2 border rounded"
                        />
                      </td>
                      <td className="p-3">${formatPrice(it.price * it.quantity)}</td>
                      <td className="p-3">
                        <button onClick={() => removeFromCart(it.id)} className="text-sm text-red-600 hover:underline">
                          {t.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-lg font-semibold">{t.total}: ${formatPrice(total)}</div>
              <div className="flex gap-3">
                <button onClick={clearCart} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">{t.clear}</button>
                <button onClick={handleCartOrder} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  {t.orderNow}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
