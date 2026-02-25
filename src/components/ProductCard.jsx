import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { useTranslation } from '../utils/translations';

export default function ProductCard({ product, lang }) {
  const { addToCart } = useCart();
  const t = useTranslation(lang);

  const imgSrc = product.image
    ? product.image.startsWith('http')
      ? product.image
      : product.image.startsWith('/images/')
      ? product.image
      : `/images/${product.image}`
    : '/images/placeholder.jpg';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition hover:-translate-y-3 hover:scale-105">
      <div className="h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-black text-brand">{product.price} EGP</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <ShoppingCart size={16} />
              <span className="text-sm">{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}