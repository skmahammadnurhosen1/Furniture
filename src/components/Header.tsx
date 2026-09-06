import React, { useState, useEffect } from 'react';
import { Search, Heart, User as UserIcon, ShoppingBag, Menu, X, ChevronDown, LogOut, Package, MapPin } from 'lucide-react';
import { CATEGORIES } from '../data/furnitureData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView?: 'home' | 'search' | 'profile' | 'product';
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onSelectCategory: (categoryName: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: (tab?: 'profile' | 'address' | 'orders') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'home',
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onNavigateHome,
  onSelectCategory,
  onScrollToSection,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, profile, logout } = useAuth();
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

  // Lock body scroll when mobile drawer is open
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

  const userAvatar = profile?.photoBase64 || user?.photoURL;
  const userDisplayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || currentView !== 'home'
            ? 'bg-stone-900/95 backdrop-blur-md py-3 shadow-lg border-b border-white/10 text-white'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-4 sm:py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg border border-white/80 flex items-center justify-center p-1 bg-white/10 group-hover:bg-white/20 transition-colors">
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
              onClick={onNavigateHome}
              className={`relative py-1 transition-colors cursor-pointer group ${
                currentView === 'home' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Home</span>
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full transition-all" />
              )}
            </button>

            <button
              id="nav-shop-btn"
              onClick={() => {
                onNavigateHome();
                onScrollToSection('featured-products');
              }}
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
              Offers
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
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              aria-label="Search furniture"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                currentView === 'search'
                  ? 'bg-[#C08251] text-white shadow'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              aria-label="View Wishlist"
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  id="wishlist-badge-count"
                  className="absolute top-0.5 right-0.5 bg-[#C08251] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Profile Trigger */}
            <div className="relative">
              {user ? (
                <button
                  id="header-account-btn"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  aria-label="User Account"
                  className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 border rounded-full transition-all cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-[#C08251] border-[#C08251] text-white shadow'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#C08251] flex items-center justify-center text-white text-[11px] font-bold border border-white/20">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userDisplayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs text-white max-w-[80px] truncate hidden sm:inline">
                    {userDisplayName}
                  </span>
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 hover:border-white/80 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Account Dropdown Menu */}
              {user && accountMenuOpen && (
                <div
                  id="account-dropdown-menu"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-56 bg-stone-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs text-stone-200 animate-in fade-in duration-150"
                >
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="font-semibold text-white truncate">{userDisplayName}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                  </div>

                  <button
                    id="acc-profile-btn"
                    onClick={() => {
                      onOpenProfile('profile');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 mt-1"
                  >
                    <UserIcon className="w-4 h-4 text-stone-400" />
                    <span>User Profile</span>
                  </button>

                  <button
                    id="acc-address-btn"
                    onClick={() => {
                      onOpenProfile('address');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-stone-400" />
                    <span>Shipping Address</span>
                  </button>

                  <button
                    id="acc-orders-btn"
                    onClick={() => {
                      onOpenProfile('orders');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-stone-400" />
                    <span>My Orders</span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    id="acc-logout-btn"
                    onClick={async () => {
                      await logout();
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              aria-label="View Shopping Cart"
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute top-0.5 right-0.5 bg-[#C08251] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow"
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

      {/* Mobile Drawer Side Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden md:hidden">
          <div
            id="mobile-drawer-backdrop"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 z-[60]"
            onClick={() => setMobileMenuOpen(false)}
          />

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

            {/* User Profile Section on Mobile Drawer */}
            <div className="p-4 mx-4 my-3 bg-white/5 border border-white/10 rounded-xl">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#C08251] flex items-center justify-center text-white font-bold shrink-0">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        userDisplayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{userDisplayName}</p>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenProfile('profile');
                      }}
                      className="py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-semibold text-white flex items-center justify-center gap-1.5"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenProfile('orders');
                      }}
                      className="py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-semibold text-white flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Orders</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2 bg-[#C08251] hover:bg-[#a86e41] text-stone-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-5 py-2 flex flex-col gap-2 font-medium text-sm overflow-y-auto overscroll-contain">
              <button
                id="mobile-nav-home"
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className={`text-left font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-white bg-white/15' : 'text-stone-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                Home
              </button>

              <button
                id="mobile-nav-shop"
                onClick={() => {
                  onNavigateHome();
                  onScrollToSection('featured-products');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-stone-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                Shop Collection
              </button>

              {/* Categories Section */}
              <div className="py-2 px-3">
                <span className="text-xs uppercase text-[#C08251] tracking-wider font-semibold block mb-2">
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
                      className="text-left text-xs text-stone-300 hover:text-white py-1.5 px-2.5 rounded hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-stone-500">{c.items.split(',')[0]}</span>
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
            <div className="p-4 border-t border-white/10 bg-black/30 shrink-0">
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
