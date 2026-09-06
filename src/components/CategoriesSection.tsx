import React from 'react';
import { ArrowRight, Armchair, Bed, UtensilsCrossed, Briefcase, SunMedium } from 'lucide-react';
import { CATEGORIES } from '../data/furnitureData';
import { Category } from '../types';

interface CategoriesSectionProps {
  onSelectCategory: (categoryName: string) => void;
  onViewAll: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Living Room': Armchair,
  'Bedroom': Bed,
  'Dining Room': UtensilsCrossed,
  'Office': Briefcase,
  'Outdoor': SunMedium,
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  onViewAll,
}) => {
  return (
    <section id="categories-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#C08251] uppercase block mb-1.5 sm:mb-2">
            EXPLORE
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Shop By Category
          </h2>
          <p className="text-stone-500 text-xs sm:text-base mt-1 sm:mt-2">
            Find the perfect furniture for every corner of your home.
          </p>
        </div>

        <button
          id="categories-view-all-btn"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#C08251] group cursor-pointer transition-colors self-start sm:self-auto"
        >
          <span>View All</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 group-hover:bg-[#C08251] text-white flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Categories Layout: Elegant horizontal snap carousel on mobile, 5-col grid on desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 no-scrollbar">
        {CATEGORIES.map((cat: Category) => {
          const IconComponent = CATEGORY_ICONS[cat.name] || Armchair;
          return (
            <div
              key={cat.id}
              id={`category-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative w-[72vw] max-w-[270px] shrink-0 snap-start sm:w-auto sm:max-w-none h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-3 text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#C08251] transition-colors">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-white group-hover:text-[#E8D1B5] transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-normal truncate mt-0.5">
                      {cat.items}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-[#C08251] group-hover:border-[#C08251] transition-all">
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
