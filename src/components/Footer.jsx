import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/translations';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Video, MessageCircle } from 'lucide-react';

export default function Footer({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);

  return (
    <footer className={`bg-gray-900 text-white ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t.storeName}</h3>
            <p className="text-gray-300 text-sm mb-2">
              {isEn ? 'Your destination for premium fashion and accessories' : 'وجهتك للملابس والإكسسوارات المميزة'}
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{isEn ? 'Cairo, Egypt' : 'القاهرة، مصر'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{isEn ? 'Quick Links' : 'روابط سريعة'}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {isEn ? 'Home' : 'الرئيسية'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {t.cart}
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {isEn ? 'All Products' : 'جميع المنتجات'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{isEn ? 'Customer Service' : 'خدمة العملاء'}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/201031149646" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEn ? 'Contact Us' : 'اتصل بنا'}</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+201031149646" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isEn ? 'Call Us' : 'اتصل بنا'}</span>
                </a>
              </li>
            
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{isEn ? 'Follow Us' : 'تابعنا'}</h3>
            <div className="flex space-x-4">
          
              
              <a 
                href="https://www.instagram.com/d.e.g.o.y?igsh=MTlqN2Q5M3ViczV3bg==" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@degoy411?_r=1&_t=ZS-94sNpIFgCsk" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Tiktok"
              >
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2026 {t.storeName}. {isEn ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
             
          
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
