import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/furnitureData';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (categoryName: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onSelectCategory,
  onScrollToSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open so background does not scroll or cover elements
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-900/90 backdrop-blur-md py-3 shadow-lg border-b border-white/10 text-white'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-4 sm:py-5 text-white'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => onScrollToSection('hero')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg border border-white/80 flex items-center justify-center p-1 bg-white/10 group-hover:bg-white/20 transition-colors">
            {/* Minimalist house/chair icon */}
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
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            id="nav-home-btn"
            onClick={() => onScrollToSection('hero')}
            className="relative py-1 text-white hover:text-stone-200 transition-colors cursor-pointer group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full transition-all" />
          </button>

          <button
            id="nav-shop-btn"
            onClick={() => onScrollToSection('featured-products')}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Shop
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              id="nav-categories-dropdown-btn"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoryDropdownOpen ? 'rotate-180 text-white' : 'text-white/70'
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div
                id="categories-dropdown-menu"
                onMouseLeave={() => setCategoryDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-56 bg-stone-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`dropdown-category-${cat.slug}`}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setCategoryDropdownOpen(false);
                      onScrollToSection('featured-products');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-stone-400">{cat.items.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="nav-about-btn"
            onClick={() => onScrollToSection('features-bar')}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>

          <button
            id="nav-blog-btn"
            onClick={() => onScrollToSection('promotions')}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Blog
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => onScrollToSection('newsletter')}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Search Trigger */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            aria-label="Search furniture"
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            id="header-wishlist-btn"
            onClick={onOpenWishlist}
            aria-label="View Wishlist"
            className="relative p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span
                id="wishlist-badge-count"
                className="absolute -top-0.5 -right-0.5 bg-[#C08251] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow"
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Profile Trigger */}
          <div className="relative">
            <button
              id="header-account-btn"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-label="User Account"
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {accountMenuOpen && (
              <div
                id="account-dropdown-menu"
                onMouseLeave={() => setAccountMenuOpen(false)}
                className="absolute right-0 top-full mt-2 w-48 bg-stone-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs text-stone-200"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="font-semibold text-white">Welcome Guest</p>
                  <p className="text-[11px] text-stone-400">furni.vip@interior.com</p>
                </div>
                <button
                  id="acc-orders-btn"
                  onClick={() => {
                    onOpenCart();
                    setAccountMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors mt-1"
                >
                  My Orders
                </button>
                <button
                  id="acc-saved-btn"
                  onClick={() => {
                    onOpenWishlist();
                    setAccountMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Saved Favorites
                </button>
                <button
                  id="acc-support-btn"
                  onClick={() => {
                    onScrollToSection('features-bar');
                    setAccountMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  24/7 Concierge
                </button>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute -top-0.5 -right-0.5 bg-[#C08251] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-[#C08251] bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Side Menu - rendered outside <header> so it's not trapped by header backdrop-filter or height */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-[60] overflow-hidden md:hidden">
        {/* Backdrop */}
        <div
          id="mobile-drawer-backdrop"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 z-[60]"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Side Drawer sliding from right */}
        <div
          id="mobile-nav-panel"
          className="fixed inset-y-0 right-0 w-[300px] max-w-[85vw] h-full bg-stone-900 border-l border-white/10 text-stone-200 shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain z-[61] transition-transform duration-300 ease-out animate-in slide-in-from-right"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-stone-900/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg border border-white/80 flex items-center justify-center p-1 bg-white/10">
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                Furni<span className="text-[#C08251]">.</span>
              </span>
            </div>

            <button
              id="close-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-5 py-6 flex flex-col gap-3 font-medium text-base overflow-y-auto overscroll-contain">
            <button
              id="mobile-nav-home"
              onClick={() => {
                onScrollToSection('hero');
                setMobileMenuOpen(false);
              }}
              className="text-left text-white font-semibold py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Home
            </button>

            <button
              id="mobile-nav-shop"
              onClick={() => {
                onScrollToSection('featured-products');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Shop Collection
            </button>

            {/* Categories Section */}
            <div className="py-2 px-3">
              <span className="text-xs uppercase text-[#C08251] tracking-wider font-semibold block mb-2.5">
                Categories
              </span>
              <div className="flex flex-col gap-1 pl-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    id={`mobile-cat-${c.slug}`}
                    onClick={() => {
                      onSelectCategory(c.name);
                      setMobileMenuOpen(false);
                      onScrollToSection('featured-products');
                    }}
                    className="text-left text-sm text-stone-300 hover:text-white py-1.5 px-2.5 rounded hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-stone-500">{c.items.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="mobile-nav-about"
              onClick={() => {
                onScrollToSection('features-bar');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              About & Quality
            </button>

            <button
              id="mobile-nav-offers"
              onClick={() => {
                onScrollToSection('promotions');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Special Offers
            </button>

            <button
              id="mobile-nav-contact"
              onClick={() => {
                onScrollToSection('newsletter');
                setMobileMenuOpen(false);
              }}
              className="text-left text-stone-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-white/10 bg-black/30 shrink-0">
            <div className="flex items-center justify-around gap-2 text-stone-300">
              <button
                onClick={() => {
                  onOpenSearch();
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center gap-1 text-xs hover:text-white transition-colors p-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-stone-400" />
                <span>Search</span>
              </button>
              <button
                onClick={() => {
                  onOpenWishlist();
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center gap-1 text-xs hover:text-white transition-colors p-2 relative cursor-pointer"
              >
                <Heart className="w-4 h-4 text-stone-400" />
                <span>Saved</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-2 bg-[#C08251] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  onOpenCart();
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center gap-1 text-xs hover:text-white transition-colors p-2 relative cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-stone-400" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-2 bg-[#C08251] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
