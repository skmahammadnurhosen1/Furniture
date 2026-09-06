import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROMO_BANNER_1, PROMO_BANNER_2 } from '../data/furnitureData';

interface PromotionalBannersProps {
  onShopSale: () => void;
  onExploreSofas: () => void;
}

export const PromotionalBanners: React.FC<PromotionalBannersProps> = ({
  onShopSale,
  onExploreSofas,
}) => {
  return (
    <section id="promotions" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Banner 1: Limited Time Offer (30% Off) */}
        <div
          id="promo-card-sale"
          className="lg:col-span-7 relative min-h-[230px] sm:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-lg group cursor-pointer"
          onClick={onShopSale}
        >
          {/* Background Image */}
          <img
            src={PROMO_BANNER_1.image}
            alt="30% Off Limited Time Offer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

          {/* Banner Content */}
          <div className="absolute inset-0 p-5 sm:p-12 flex flex-col justify-between text-white">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#E5B583] uppercase block mb-1.5 sm:mb-3">
                {PROMO_BANNER_1.subtitle}
              </span>
              <h3 className="text-2xl sm:text-5xl font-bold tracking-tight leading-[1.15] max-w-xs text-white">
                Get Up To <br />
                <span className="text-[#F2D7B3]">30% Off</span>
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-1.5 sm:mt-3 font-normal">
                {PROMO_BANNER_1.description}
              </p>
            </div>

            <div>
              <button
                id="promo-shop-now-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onShopSale();
                }}
                className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#C08251] hover:bg-[#b07444] text-stone-950 font-semibold px-4.5 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm shadow-md transition-all group-hover:scale-105"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner 2: Modern Sofas Collection */}
        <div
          id="promo-card-sofas"
          className="lg:col-span-5 relative min-h-[200px] sm:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-lg group cursor-pointer bg-stone-100"
          onClick={onExploreSofas}
        >
          {/* Background Image */}
          <img
            src={PROMO_BANNER_2.image}
            alt="Modern Sofas Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/35 to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 p-5 sm:p-10 flex flex-col justify-between text-white">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-stone-300 uppercase block mb-1.5 sm:mb-2">
                {PROMO_BANNER_2.subtitle}
              </span>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                {PROMO_BANNER_2.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-300 mt-2 sm:mt-3 uppercase tracking-wide">
                Starting from
              </p>
              <p className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
                {PROMO_BANNER_2.startingPrice}
              </p>
            </div>

            <div>
              <button
                id="promo-sofas-arrow-btn"
                aria-label="Explore Modern Sofas"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-stone-900 group-hover:bg-[#C08251] text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
