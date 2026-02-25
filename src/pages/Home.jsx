import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../utils/translations';

const sampleProducts = [
  { id: 's1', name: 'Cloud Runner Sneakers', description: 'Lightweight, breathable street sneakers.', price: '89', image: '/images/WhatsApp Image 2026-02-21 at 12.32.04 AM.jpeg', phone: '123456789', category: 'Shoes', createdAt: new Date('2026-02-21') },
  { id: 's2', name: 'Ocean Hoodie', description: 'Soft fleece hoodie with embroidered logo.', price: '59', image: '/images/WhatsApp Image 2026-02-21 at 12.32.02 AM (3).jpeg', phone: '123456789', category: 'Apparel', createdAt: new Date('2026-02-21') },
  { id: 's3', name: 'Neon Cap', description: 'Adjustable cap with neon piping.', price: '19', image: '/images/WhatsApp Image 2026-02-21 at 12.32.01 AM (2).jpeg', phone: '123456789', category: 'Accessories', createdAt: new Date('2026-02-21') },
];

export default function Home({ lang }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const CATEGORIES = [
    { key: 'All', label: t.all },
    { key: 'Socks', label: t.socks },
    { key: 'Caps', label: t.caps },
    { key: 'Wallets', label: t.wallets },
    { key: 'Accessories', label: t.accessories },
    { key: 'Bags', label: t.bags },
    { key: 'Uncategorized', label: t.uncategorized }
  ];

  useEffect(() => {
    let isMounted = true;
    try {
      const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (isMounted) setProducts(items.length === 0 ? sampleProducts : items);
      }, (err) => {
        console.error('Realtime failed, using fallback', err);
        if (isMounted) setProducts(sampleProducts);
      });

      return () => {
        isMounted = false;
        unsub();
      };
    } catch (err) {
      console.error('Failed to init realtime', err);
      setTimeout(() => setProducts(sampleProducts), 0);
    }
  }, []);

  return (
    <main className={`py-8 ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t.latestDrops}</h1>
          <div className="h-1 w-20 bg-brand rounded-full mt-3" />
          <p className="text-gray-600 dark:text-gray-300 mt-4">{t.homeDescription}</p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
          <input 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            placeholder={t.filterByName} 
            className={`p-3 border rounded-lg w-full max-w-sm ${!isEn ? 'text-right' : ''}`} 
          />
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-3 border rounded-lg">
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-3 border rounded-lg">
              <option value="latest">{t.latest}</option>
              <option value="oldest">{isEn ? 'Oldest' : 'الأقدم'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
            .filter(p => categoryFilter === 'All' ? true : (p.category || 'Uncategorized') === categoryFilter)
            .sort((a, b) => {
              const toMillis = (t) => {
                if (!t) return 0;
                if (typeof t === 'number') return t;
                if (typeof t.toMillis === 'function') return t.toMillis();
                if (t.seconds) return t.seconds * 1000;
                return 0;
              };
              const ta = toMillis(a.createdAt);
              const tb = toMillis(b.createdAt);
              return sortBy === 'latest' ? tb - ta : ta - tb;
            })
            .map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
        </div>
        </div>
      </main>
  );
}