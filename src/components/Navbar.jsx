import { Sun, Moon, Instagram, MessageCircle, Video, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useTranslation } from '../utils/translations';

export default function Navbar({ darkMode, setDarkMode, lang, setLang }) {
  const isEn = lang === 'en';
  const { cart } = useCart();
  const cartCount = cart.reduce((s, it) => s + it.quantity, 0);
  const t = useTranslation(lang);

  return (
    <nav className={`bg-brand text-white px-6 py-4 flex items-center justify-between shadow ${!isEn ? 'rtl' : ''}`}>
      <Link to="/" className="brand-logo">{t.storeName}</Link>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 text-white/90">
          <a href="https://www.instagram.com/d.e.g.o.y?igsh=MTlqN2Q5M3ViczV3bg==" className="hover:scale-110 transition-transform"><Instagram size={18} /></a>
          <a href="https://www.tiktok.com/@degoy411?_r=1&_t=ZS-948SuJznuoj" className="hover:scale-110 transition-transform"><Video size={18} /></a>
          <a href="https://wa.me/+201031149646" className="hover:scale-110 transition-transform"><MessageCircle size={18} /></a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="ml-2 text-sm font-semibold">{cartCount}</span>}
            <span className="ml-2 text-sm">{t.cart}</span>
          </Link>
          <button onClick={() => setLang(isEn ? 'ar' : 'en')} className="text-sm font-semibold uppercase">{isEn ? 'AR' : 'EN'}</button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}