import React from 'react';
import {
  Instagram,
  Facebook,
  Youtube,
  ChevronUp,
  Heart,
  QrCode,
  Smartphone,
  Shield,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { CATEGORIES } from '../data/furnitureData';
import { StoreSettings } from '../types';

interface FooterProps {
  onScrollToTop: () => void;
  onSelectCategory: (categoryName: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onNavigateHome?: () => void;
  onOpenSearch?: () => void;
  onOpenProfile?: (tab?: 'profile' | 'address' | 'orders') => void;
  onOpenAdmin?: () => void;
  storeSettings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onSelectCategory,
  onScrollToSection,
  onNavigateHome,
  onOpenSearch,
  onOpenProfile,
  onOpenAdmin,
  storeSettings,
}) => {
  return (
    <footer id="main-footer" className="bg-[#111215] text-stone-300 pt-16 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-stone-800/80">
          {/* Brand & Socials */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg border border-white/80 flex items-center justify-center p-1 bg-white/10">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center">
                Furni<span className="text-[#C08251]">.</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm mb-4 leading-relaxed">
              Furniture for a better tomorrow.
            </p>

            {storeSettings && (
              <div className="space-y-1.5 text-xs text-stone-400 mb-6">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C08251] shrink-0 mt-0.5" />
                  <span>{storeSettings.street}, {storeSettings.city} ({storeSettings.postalCode})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C08251] shrink-0" />
                  <a href={`mailto:${storeSettings.primaryEmail}`} className="hover:text-white transition-colors truncate">
                    {storeSettings.primaryEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C08251] shrink-0" />
                  <a href={`tel:${storeSettings.primaryPhone}`} className="hover:text-white transition-colors">
                    {storeSettings.primaryPhone}
                  </a>
                </div>
              </div>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                id="footer-social-instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-[#C08251] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                id="footer-social-facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-[#C08251] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#pinterest"
                id="footer-social-pinterest"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-[#C08251] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                {/* Custom Pinterest SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.224-.177.271-.409.164-1.523-.71-2.476-2.936-2.476-4.724 0-3.847 2.796-7.382 8.067-7.382 4.237 0 7.531 3.02 7.531 7.056 0 4.21-2.654 7.6-6.337 7.6-1.238 0-2.401-.644-2.8-1.407l-.762 2.906c-.276 1.053-1.022 2.373-1.523 3.184C9.537 23.824 10.749 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
              <a
                href="#youtube"
                id="footer-social-youtube"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-[#C08251] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    else onScrollToSection('hero');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    onScrollToSection('featured-products');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    onScrollToSection('categories-section');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    onScrollToSection('features-bar');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    onScrollToSection('promotions');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    onScrollToSection('newsletter');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(c.name);
                      onScrollToSection('featured-products');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onOpenProfile?.('orders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track Order
                </button>
              </li>
              <li>
                <a href="#returns" className="hover:text-white transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Download App & QR Code */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Download App
            </h4>
            <p className="text-stone-400 text-xs mb-4">Get our app for a better experience.</p>

            <div className="flex items-start gap-3">
              {/* App badges */}
              <div className="flex flex-col gap-2">
                <a
                  href="#appstore"
                  id="btn-app-store"
                  className="inline-flex items-center gap-2 bg-stone-900 border border-stone-700 hover:border-stone-500 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Smartphone className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase text-stone-400">Download on the</span>
                    <span className="block text-xs font-semibold text-white -mt-0.5">App Store</span>
                  </div>
                </a>

                <a
                  href="#googleplay"
                  id="btn-google-play"
                  className="inline-flex items-center gap-2 bg-stone-900 border border-stone-700 hover:border-stone-500 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {/* Google Play Triangle */}
                  <svg className="w-5 h-5 text-[#34A853]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-.955V2.769c0-.36.142-.707.38-1.002.072.015.152.03.229.047z" fill="#4285F4"/>
                    <path d="M17.45 8.341l-3.658 3.659 3.658 3.659 4.148-2.395c1.19-.687 1.19-1.808 0-2.495l-4.148-2.428z" fill="#FBBC05"/>
                    <path d="M13.792 12L3.609 1.814A1.97 1.97 0 0 1 4.5 1.5c.42 0 .84.11 1.22.33l11.73 6.511-3.658 3.659z" fill="#EA4335"/>
                    <path d="M13.792 12l3.658 3.659L5.72 22.17a2.38 2.38 0 0 1-1.22.33 1.97 1.97 0 0 1-.891-.314L13.792 12z" fill="#34A853"/>
                  </svg>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase text-stone-400">GET IT ON</span>
                    <span className="block text-xs font-semibold text-white -mt-0.5">Google Play</span>
                  </div>
                </a>
              </div>

              {/* QR Code graphic */}
              <div className="bg-white p-2 rounded-xl border border-stone-700 flex flex-col items-center justify-center shadow">
                <QrCode className="w-14 h-14 text-stone-950" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <p>© 2026 {storeSettings?.storeName || 'Furni'}. All rights reserved.</p>
            {onOpenAdmin && (
              <button
                id="footer-admin-portal-btn"
                onClick={onOpenAdmin}
                className="hover:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-stone-500 hover:underline"
              >
                <Shield className="w-3.5 h-3.5 text-[#C08251]" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>

          <p className="flex items-center gap-1 text-stone-400">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 fill-[#C08251] text-[#C08251]" />
            <span>for better homes.</span>
          </p>

          {/* Scroll to Top */}
          <button
            id="scroll-to-top-btn"
            onClick={onScrollToTop}
            aria-label="Scroll back to top"
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-[#C08251] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
