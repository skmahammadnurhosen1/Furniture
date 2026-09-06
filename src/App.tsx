import React, { useState } from 'react';
import { PRODUCTS } from './data/furnitureData';
import { Product, CartItem, ToastMessage } from './types';
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
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

export default function App() {
  // Initial state reflects screenshot (2 items in cart)
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Modern Lounge Chair
      quantity: 1,
      selectedColor: 'Warm Oatmeal',
    },
    {
      product: PRODUCTS[3], // Coffee Table
      quantity: 1,
      selectedColor: 'Warm Oak',
    },
  ]);

  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[0]]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notifier helper
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'cart' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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

    addToast(
      `Added to Cart`,
      `${quantity}x ${product.name} added to your shopping bag`,
      'cart'
    );
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

  // Filtered products logic
  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === 'All') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Category selection handler from Category Section or dropdown
  const handleSelectRoomCategory = (roomOrCategory: string) => {
    // Map room names to categories if applicable
    const roomMap: Record<string, string> = {
      'Living Room': 'Sofas',
      'Bedroom': 'Beds',
      'Dining Room': 'Tables',
      'Office': 'Chairs',
      'Outdoor': 'Chairs',
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

  const handleSubscribeNewsletter = (email: string) => {
    addToast(
      'Subscribed!',
      `Use discount code FURNI20 for 20% off your first purchase.`,
      'success'
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col selection:bg-[#C08251] selection:text-white">
      {/* Header Navigation */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleSelectRoomCategory}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Page Flow following the screenshot */}
      <main className="flex-1">
        {/* 1. Hero Section with background & interactive sofa pin */}
        <Hero
          onShopNow={() => handleScrollToSection('featured-products')}
          onExplore={() => handleScrollToSection('categories-section')}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 2. Floating 4-Feature Benefits Bar */}
        <FeaturesBar />

        {/* 3. Shop By Category Showcase */}
        <CategoriesSection
          onSelectCategory={handleSelectRoomCategory}
          onViewAll={() => handleScrollToSection('featured-products')}
        />

        {/* 4. Featured Products ("BEST SELLERS") with tabs */}
        <FeaturedProducts
          products={filteredProducts}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 5. Promotional Banners (30% Off & Modern Sofas from $299) */}
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

        {/* 6. Newsletter Subscription Bar ("Stay Updated") */}
        <NewsletterSection onSubscribe={handleSubscribeNewsletter} />
      </main>

      {/* 7. Comprehensive Modern Dark Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onSelectCategory={handleSelectRoomCategory}
        onScrollToSection={handleScrollToSection}
      />

      {/* Interactive Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onAddToCart={(p) => {
          handleAddToCart(p, 1);
        }}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Notification Toast */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
