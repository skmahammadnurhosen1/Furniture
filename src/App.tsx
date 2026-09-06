import React, { useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/furnitureData';
import { Product, CartItem, ToastMessage, ShippingAddress, StoreSettings } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesBar } from './components/FeaturesBar';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { PromotionalBanners } from './components/PromotionalBanners';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { SearchPage } from './components/SearchPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { CheckoutAddressModal } from './components/CheckoutAddressModal';
import { useAuth } from './context/AuthContext';
import { subscribeToProducts } from './services/productService';
import { subscribeToStoreSettings, DEFAULT_STORE_SETTINGS } from './services/storeService';
import { checkAdminStatus } from './services/adminService';
import { createOrder } from './services/orderService';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

export default function App() {
  const { user, profile, updateProfileData } = useAuth();

  // Primary page view: 'home' | 'search' | 'profile' | 'product' | 'admin-login' | 'admin-dashboard'
  const [currentPage, setCurrentPage] = useState<
    'home' | 'search' | 'profile' | 'product' | 'admin-login' | 'admin-dashboard'
  >('home');
  const [previousPage, setPreviousPage] = useState<'home' | 'search' | 'profile'>('home');
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'address' | 'orders'>('profile');

  // Real-time products from Firestore database (falling back to initial curated products)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Global store settings (address, phone, emails, WhatsApp number)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Active verified admin session
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeProducts = subscribeToProducts(
      (loadedProducts) => {
        if (loadedProducts && loadedProducts.length > 0) {
          setProducts(loadedProducts);
        }
      },
      (err) => {
        console.warn('Using local product catalog due to Firestore sync notice:', err);
      }
    );

    const unsubscribeSettings = subscribeToStoreSettings((settings) => {
      if (settings) {
        setStoreSettings(settings);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
    };
  }, []);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedColor: 'Warm Oatmeal',
    },
    {
      product: INITIAL_PRODUCTS[3],
      quantity: 1,
      selectedColor: 'Warm Oak',
    },
  ]);

  const [wishlist, setWishlist] = useState<Product[]>([INITIAL_PRODUCTS[0]]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Drawer and Dialog states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // User Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Checkout address prompt modal
  const [isCheckoutAddressModalOpen, setIsCheckoutAddressModalOpen] = useState<boolean>(false);
  const [pendingCheckoutTotal, setPendingCheckoutTotal] = useState<number>(0);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearch = () => {
    setCurrentPage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = (tab: 'profile' | 'address' | 'orders' = 'profile') => {
    setProfileActiveTab(tab);
    setCurrentPage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPreviousPage(currentPage === 'product' ? 'home' : currentPage);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    setCurrentPage(previousPage || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    if (adminEmail) {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('admin-login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminSignOut = () => {
    setAdminEmail(null);
    setCurrentPage('home');
    addToast('Signed Out', 'Signed out of administrator portal.', 'info');
  };

  // Toast helper
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'cart' = 'success'
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && (!color || item.selectedColor === color)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedColor: color || (product.colors ? product.colors[0]?.name : undefined),
          },
        ];
      }
    });

    addToast('Added to Cart', `${quantity}x ${product.name} added to your bag`, 'cart');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed', 'Product removed from your cart', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('Removed from Wishlist', `${product.name} removed`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Saved to Wishlist', `${product.name} saved to your favorites`, 'info');
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Checkout workflow:
  // 1. If not logged in -> ask to sign in
  // 2. If logged in, check if address exists
  //    - If address is missing: ask for address
  //    - If address is already present: place order directly with the saved address
  const handleStartCheckout = async (total: number) => {
    if (!user) {
      addToast('Sign In Required', 'Please sign in or create an account to proceed with checkout', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    const hasAddress = Boolean(profile?.street && profile?.city && profile?.postalCode);

    if (!hasAddress) {
      // User has not added their address yet -> prompt for it
      setPendingCheckoutTotal(total);
      setIsCheckoutAddressModalOpen(true);
    } else {
      // User already has address saved -> place order directly
      await handleExecuteOrder(
        {
          fullName: profile?.displayName || user.displayName || 'Valued Client',
          phone: profile?.phone || '',
          street: profile?.street || '',
          apartment: profile?.apartment,
          city: profile?.city || '',
          state: profile?.state || '',
          postalCode: profile?.postalCode || '',
          country: profile?.country || 'United States',
        },
        total
      );
    }
  };

  const handleExecuteOrder = async (address: ShippingAddress, total: number) => {
    if (!user) return;
    try {
      const orderId = await createOrder(
        user.uid,
        user.email || '',
        cart,
        total,
        address
      );

      setCart([]);
      setIsCartOpen(false);
      setIsCheckoutAddressModalOpen(false);

      addToast(
        'Order Placed Successfully!',
        `Order #${orderId} has been confirmed. You can track it anytime in your User Profile.`,
        'success'
      );
    } catch (err: any) {
      console.error('Order creation error:', err);
      addToast('Order Placement Error', err?.message || 'Failed to place order', 'info');
    }
  };

  const handleCheckoutAddressSubmit = async (address: ShippingAddress) => {
    // 1. Update user profile so they never have to re-enter it next time
    try {
      await updateProfileData({
        displayName: address.fullName,
        phone: address.phone,
        street: address.street,
        apartment: address.apartment,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      });
    } catch (e) {
      console.warn('Profile update warning:', e);
    }

    // 2. Submit order
    await handleExecuteOrder(address, pendingCheckoutTotal);
  };

  // Filtered products logic based on Firestore products
  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'All') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleSelectRoomCategory = (roomOrCategory: string) => {
    const roomMap: Record<string, string> = {
      'Living Room': 'Sofas',
      Bedroom: 'Beds',
      'Dining Room': 'Tables',
      Office: 'Chairs',
      Outdoor: 'Chairs',
    };
    if (roomMap[roomOrCategory]) {
      setActiveCategory(roomMap[roomOrCategory]);
    } else {
      setActiveCategory(roomOrCategory);
    }

    const el = document.getElementById('featured-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribeNewsletter = () => {
    addToast(
      'Subscribed!',
      `Use discount code FURNI20 for 20% off your first purchase.`,
      'success'
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Dedicated full-screen view for Administrator Login
  if (currentPage === 'admin-login') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col selection:bg-[#C08251] selection:text-white">
        <AdminLoginPage
          onBackToStore={handleNavigateHome}
          onLoginSuccess={(email) => {
            setAdminEmail(email);
            setCurrentPage('admin-dashboard');
            addToast('Welcome Admin', `Logged in as ${email}`, 'success');
          }}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Dedicated full-screen view for Administrator Dashboard
  if (currentPage === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col selection:bg-[#C08251] selection:text-white">
        <AdminDashboard
          currentAdminEmail={adminEmail || user?.email || 'admin@furnistudio.com'}
          products={products}
          storeSettings={storeSettings}
          onViewLiveStore={handleNavigateHome}
          onSignOut={handleAdminSignOut}
          onShowToast={addToast}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col selection:bg-[#C08251] selection:text-white">
      {/* Header Navigation with Auth and Profile Access */}
      <Header
        currentView={currentPage}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={handleOpenSearch}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={(cat) => {
          handleSelectRoomCategory(cat);
          if (currentPage !== 'home') setCurrentPage('home');
        }}
        onScrollToSection={(sectionId) => {
          if (currentPage !== 'home') {
            setCurrentPage('home');
            setTimeout(() => handleScrollToSection(sectionId), 80);
          } else {
            handleScrollToSection(sectionId);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={handleOpenProfile}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              onShopNow={() => handleScrollToSection('featured-products')}
              onExplore={() => handleScrollToSection('categories-section')}
              onSelectProduct={handleSelectProduct}
            />

            {/* 2. Floating 4-Feature Benefits Bar */}
            <FeaturesBar />

            {/* 3. Shop By Category Showcase */}
            <CategoriesSection
              onSelectCategory={handleSelectRoomCategory}
              onViewAll={() => handleScrollToSection('featured-products')}
            />

            {/* 4. Featured Products with Firestore items */}
            <FeaturedProducts
              products={filteredProducts}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
              onSelectProduct={handleSelectProduct}
            />

            {/* 5. Promotional Banners */}
            <PromotionalBanners
              onShopSale={() => {
                setActiveCategory('All');
                handleScrollToSection('featured-products');
              }}
              onExploreSofas={() => {
                setActiveCategory('Sofas');
                handleScrollToSection('featured-products');
              }}
            />

            {/* 6. Newsletter Subscription Bar */}
            <NewsletterSection onSubscribe={handleSubscribeNewsletter} />
          </>
        )}

        {currentPage === 'search' && (
          <SearchPage
            products={products}
            onBackToHome={handleNavigateHome}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onBackToHome={handleNavigateHome}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            initialTab={profileActiveTab}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={handleBackFromProduct}
            onAddToCart={(prod, qty, col) => handleAddToCart(prod, qty, col)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted(selectedProduct.id)}
            onSelectProduct={handleSelectProduct}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onShowToast={addToast}
            whatsappNumber={storeSettings.whatsappNumber}
          />
        )}
      </main>

      {/* 7. Comprehensive Modern Dark Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onSelectCategory={(cat) => {
          handleSelectRoomCategory(cat);
          if (currentPage !== 'home') setCurrentPage('home');
        }}
        onScrollToSection={(sectionId) => {
          if (currentPage !== 'home') {
            setCurrentPage('home');
            setTimeout(() => handleScrollToSection(sectionId), 80);
          } else {
            handleScrollToSection(sectionId);
          }
        }}
        onNavigateHome={handleNavigateHome}
        onOpenSearch={handleOpenSearch}
        onOpenProfile={handleOpenProfile}
        onOpenAdmin={handleOpenAdmin}
        storeSettings={storeSettings}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onStartCheckout={handleStartCheckout}
        onSelectProduct={handleSelectProduct}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onAddToCart={(p) => {
          handleAddToCart(p, 1);
        }}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onSelectProduct={handleSelectProduct}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          addToast('Signed In', `Welcome to Furni!`, 'success');
        }}
      />

      {/* Checkout Address Prompt Modal (only when user has not yet entered address) */}
      <CheckoutAddressModal
        isOpen={isCheckoutAddressModalOpen}
        onClose={() => setIsCheckoutAddressModalOpen(false)}
        onSubmit={handleCheckoutAddressSubmit}
        initialAddress={{
          fullName: profile?.displayName || user?.displayName || '',
          phone: profile?.phone || '',
          street: profile?.street || '',
          apartment: profile?.apartment || '',
          city: profile?.city || '',
          state: profile?.state || '',
          postalCode: profile?.postalCode || '',
          country: profile?.country || 'United States',
        }}
        totalAmount={pendingCheckoutTotal}
      />

      {/* Notification Toast */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
