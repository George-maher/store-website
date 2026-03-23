import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const sampleOffers = [
  {
    id: 'sample1',
    title: 'Summer Sale',
    description: 'Get up to 50% off on selected items',
    image: '/images/WhatsApp Image 2026-02-21 at 12.32.04 AM.jpeg',
    ctaText: 'Shop Now',
    ctaLink: '/'
  },
  {
    id: 'sample2',
    title: 'New Collection',
    description: 'Discover our latest arrivals',
    image: '/images/WhatsApp Image 2026-02-21 at 12.32.02 AM (3).jpeg',
    ctaText: 'Explore',
    ctaLink: '/'
  }
];

export default function OffersSlider() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    try {
      const unsub = onSnapshot(collection(db, 'offers'), (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (isMounted) {
          setOffers(items.length === 0 ? sampleOffers : items);
          setLoading(false);
        }
      }, (err) => {
        console.error('Failed to fetch offers:', err);
        if (isMounted) {
          setOffers(sampleOffers);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsub();
      };
    } catch (err) {
      console.error('Failed to init offers listener:', err);
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) {
            setOffers(sampleOffers);
            setLoading(false);
          }
        }, 0);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] md:h-[80vh] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="w-full mb-8">
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-2xl">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white !opacity-70',
            bulletActiveClass: '!bg-white !opacity-100',
          }}
          className="w-full h-full"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <div className="relative w-full h-full group">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 transform transition-all duration-500 group-hover:scale-105">
                      {offer.title}
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
                      {offer.description}
                    </p>
                    {offer.ctaText && (
                      <a
                        href={offer.ctaLink || '#'}
                        className="inline-flex items-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        {offer.ctaText}
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !left-4 !right-auto !text-white !bg-white/20 !backdrop-blur-sm !w-12 !h-12 !rounded-full !border !border-white/30 hover:!bg-white/30 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next !right-4 !left-auto !text-white !bg-white/20 !backdrop-blur-sm !w-12 !h-12 !rounded-full !border !border-white/30 hover:!bg-white/30 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination !bottom-6" />
      </div>
    </section>
  );
}
