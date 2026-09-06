import React from 'react';
import { Truck, ShieldCheck, Award, Headphones } from 'lucide-react';

const FEATURES = [
  {
    id: 'feature-shipping',
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On orders over $199',
  },
  {
    id: 'feature-payment',
    icon: ShieldCheck,
    title: 'Secure Payment',
    subtitle: '100% protected',
  },
  {
    id: 'feature-quality',
    icon: Award,
    title: 'Premium Quality',
    subtitle: 'Built to last',
  },
  {
    id: 'feature-support',
    icon: Headphones,
    title: '24/7 Support',
    subtitle: 'Always here for you',
  },
];

export const FeaturesBar: React.FC = () => {
  return (
    <section id="features-bar" className="relative z-30 -mt-6 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-stone-900/5 px-4 sm:px-8 py-4 sm:py-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-stone-200/80">
          {FEATURES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`flex items-center gap-2.5 sm:gap-4 ${
                  idx === 0 ? 'lg:pr-6' : idx === 3 ? 'lg:pl-6' : 'lg:px-6'
                } group`}
              >
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-stone-100/90 border border-stone-200 flex items-center justify-center text-stone-800 group-hover:bg-[#C08251] group-hover:text-white group-hover:border-[#C08251] transition-all duration-300 shrink-0 shadow-xs">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight truncate">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-normal mt-0.5 truncate">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
