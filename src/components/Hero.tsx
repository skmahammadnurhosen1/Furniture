import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HERO_BACKGROUND_IMAGE } from '../data/furnitureData';
import { Product } from '../types';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExplore }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[88vh] sm:min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-end lg:justify-center overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-24 lg:pt-20 lg:pb-36"
    >
      {/* Hero Background Image with Subtle Film Grain / Vignette */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="Modern Minimalist Interior Living Room"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[65%_center] sm:object-center transform scale-105 transition-transform duration-1000"
        />
        {/* Soft atmospheric gradient overlays for perfect text contrast while preserving image warmth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20 lg:from-black/75 lg:via-black/45 lg:to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 lg:from-black/80 lg:to-black/40" />
      </div>

      {/* Left Vertical Aesthetic Decor */}
      <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4 text-white/60">
        <div className="flex flex-col gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 border border-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 border border-white/40" />
        </div>
        <div className="h-12 w-[1px] bg-white/30" />
        <span
          className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/70"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Solid Wood
        </span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full flex flex-col justify-end lg:justify-center">
        <div className="max-w-2xl text-left">
          {/* Pill Eyebrow (Hidden on mobile, visible on desktop) */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs tracking-widest font-semibold uppercase mb-4 sm:mb-6 shadow-sm">
            <span>MODERN</span>
            <span className="text-[#C08251] font-bold">•</span>
            <span>STYLISH</span>
            <span className="text-[#C08251] font-bold">•</span>
            <span>COMFORTABLE</span>
          </div>

          {/* Main Headline: Positioned right above the subtitle */}
          <h1 className="text-[34px] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-white tracking-tight leading-[1.08] mb-2 sm:mb-3">
            Make Your <br />
            Home <span className="font-serif-display italic font-normal text-[#E8D1B5]">Beautiful</span>
          </h1>

          {/* Tagline: Positioned right below the headline and right above the buttons */}
          <p className="text-xs sm:text-base lg:text-lg text-stone-200/90 font-light max-w-sm sm:max-w-lg leading-relaxed mb-3.5 sm:mb-6">
            Premium furniture crafted for comfort, style and a better living experience.
          </p>

          {/* Action Buttons: Positioned directly below the tagline */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Primary Shop Now Button */}
            <button
              id="hero-shop-now-btn"
              onClick={onShopNow}
              className="group inline-flex items-center gap-2.5 sm:gap-3 bg-[#C08251] hover:bg-[#b07444] text-stone-950 font-semibold px-5 py-3 sm:px-6 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold sm:font-semibold tracking-wide">Shop Now</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-900 text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </button>

            {/* Secondary Explore Button */}
            <button
              id="hero-explore-btn"
              onClick={onExplore}
              className="group inline-flex items-center gap-2.5 sm:gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium px-4.5 py-3 sm:px-5 sm:py-3.5 rounded-full shadow transition-all cursor-pointer active:scale-95 sm:active:scale-100"
            >
              <span className="text-xs sm:text-sm tracking-wide">Explore</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/60 flex items-center justify-center text-white group-hover:border-white group-hover:bg-white/10 transition-colors">
                <Play className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
