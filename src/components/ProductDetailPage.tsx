import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  Share2,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  User as UserIcon,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onOpenAuth: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'cart' | 'error') => void;
  whatsappNumber?: string;
}

// Store WhatsApp Order destination (fallback: India country code 91 + number 9134280545)
const DEFAULT_WHATSAPP_NUMBER = '919134280545';

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onOpenAuth,
  onShowToast,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}) => {
  const { user, profile, updateProfileData } = useAuth();
  const displayWhatsApp = whatsappNumber || '+91 91342 80545';

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Natural Wood'
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'shipping'>('specs');

  // Modal dialog states
  const [isDirectOrderModalOpen, setIsDirectOrderModalOpen] = useState<boolean>(false);
  const [isShippingPromptModalOpen, setIsShippingPromptModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Delivery details form state
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [apartment, setApartment] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateRegion, setStateRegion] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');

  // Sync with current user profile whenever available
  useEffect(() => {
    if (profile || user) {
      setFullName((prev) => prev || profile?.displayName || user?.displayName || '');
      setPhoneNumber((prev) => prev || profile?.phone || '');
      setStreetAddress((prev) => prev || profile?.street || '');
      setApartment((prev) => prev || profile?.apartment || '');
      setCity((prev) => prev || profile?.city || '');
      setStateRegion((prev) => prev || profile?.state || '');
      setPostalCode((prev) => prev || profile?.postalCode || '');
    }
  }, [profile, user]);

  // Check if profile has all mandatory shipping information
  const checkProfileCompleteness = (
    nameVal: string,
    phoneVal: string,
    streetVal: string,
    cityVal: string,
    postalVal: string
  ) => {
    return Boolean(
      nameVal.trim() &&
      phoneVal.trim() &&
      streetVal.trim() &&
      cityVal.trim() &&
      postalVal.trim()
    );
  };

  const isCurrentProfileComplete = checkProfileCompleteness(
    profile?.displayName || user?.displayName || fullName,
    profile?.phone || phoneNumber,
    profile?.street || streetAddress,
    profile?.city || city,
    profile?.postalCode || postalCode
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast('Link Copied', 'Product URL copied to clipboard.', 'info');
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Compile WhatsApp order message and trigger window.open
  const executeWhatsAppOrder = (
    customerName: string,
    customerPhone: string,
    customerStreet: string,
    customerApt: string,
    customerCity: string,
    customerState: string,
    customerPostal: string
  ) => {
    const totalAmount = product.price * quantity;
    const formattedAddress = [
      customerStreet.trim(),
      customerApt.trim(),
      customerCity.trim(),
      customerState.trim(),
      customerPostal.trim() ? `PIN: ${customerPostal.trim()}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const message = `*NEW ORDER - FURNI STUDIO*
----------------------------------------
*Product:* ${product.name}
*Category:* ${product.room} • ${product.category}
*Finish / Color:* ${selectedColor}
*Quantity:* ${quantity}
*Price:* $${product.price}
*Total Amount:* $${totalAmount}

*CUSTOMER DETAILS:*
*Name:* ${customerName.trim()}
*Phone:* ${customerPhone.trim()}
*Delivery Address:* ${formattedAddress}
----------------------------------------
Hello! I would like to place this order. Please confirm delivery timeline and payment details.`;

    const encoded = encodeURIComponent(message);
    const targetNumber = (whatsappNumber || DEFAULT_WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (onShowToast) {
      onShowToast(
        'WhatsApp Order Launched',
        `Connecting to official store WhatsApp (${targetNumber})...`,
        'success'
      );
    }
  };

  // Click handler for "Order via WhatsApp"
  const handleInitiateWhatsAppOrder = () => {
    // Check if the user already has full profile data
    const hasCompleteData = checkProfileCompleteness(
      profile?.displayName || user?.displayName || fullName,
      profile?.phone || phoneNumber,
      profile?.street || streetAddress,
      profile?.city || city,
      profile?.postalCode || postalCode
    );

    if (hasCompleteData) {
      // User has all info -> Direct order via WhatsApp!
      executeWhatsAppOrder(
        profile?.displayName || user?.displayName || fullName,
        profile?.phone || phoneNumber,
        profile?.street || streetAddress,
        profile?.apartment || apartment,
        profile?.city || city,
        profile?.state || stateRegion,
        profile?.postalCode || postalCode
      );
    } else {
      // User info is missing -> Open the shipping details modal
      setFormError('');
      setIsShippingPromptModalOpen(true);
    }
  };

  // Handle saving details from the modal and immediately placing order
  const handleSaveAndOrderViaWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError('Please enter a valid contact phone number.');
      return;
    }
    if (!streetAddress.trim()) {
      setFormError('Please enter your street address.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter your city.');
      return;
    }
    if (!postalCode.trim()) {
      setFormError('Please enter your postal / PIN code.');
      return;
    }

    setFormError('');
    setIsSavingProfile(true);

    try {
      // If user is authenticated, update their permanent profile in Firestore
      if (user && updateProfileData) {
        await updateProfileData({
          displayName: fullName.trim(),
          phone: phoneNumber.trim(),
          street: streetAddress.trim(),
          apartment: apartment.trim(),
          city: city.trim(),
          state: stateRegion.trim(),
          postalCode: postalCode.trim(),
          country: 'India',
        });
      }

      // Close modal
      setIsShippingPromptModalOpen(false);

      // Immediately launch WhatsApp with complete customer details
      executeWhatsAppOrder(
        fullName,
        phoneNumber,
        streetAddress,
        apartment,
        city,
        stateRegion,
        postalCode
      );

      if (onShowToast) {
        onShowToast(
          'Profile Updated',
          'Your delivery details have been saved to your profile.',
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to update profile during checkout:', err);
      // Even if Firestore update fails, still launch WhatsApp so customer is not blocked
      setIsShippingPromptModalOpen(false);
      executeWhatsAppOrder(
        fullName,
        phoneNumber,
        streetAddress,
        apartment,
        city,
        stateRegion,
        postalCode
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Similar items in the same room or category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.room === product.room))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-24 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-stone-200">
          <button
            id="back-to-store-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 overflow-hidden">
            <button onClick={onBack} className="hover:underline text-stone-500">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="text-stone-500">{product.room}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="text-stone-500">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="font-semibold text-stone-900 truncate max-w-[160px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="share-product-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              id="wishlist-toggle-top-btn"
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-rose-500 hover:bg-stone-50'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 shadow-xs">
          {/* Left Column: Image Showcase (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-stone-50/50 border-b lg:border-b-0 lg:border-r border-stone-200">
            <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.originalPrice && (
                  <span className="bg-stone-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-[#C08251] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-emerald-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    New Arrival
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>In Stock • Ready to Dispatch</span>
              </div>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-200">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
                <Truck className="w-4 h-4 text-stone-700 mb-1" />
                <span className="text-[11px] font-semibold text-stone-800">Free Delivery</span>
                <span className="text-[10px] text-stone-500">Pan-India transit</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-stone-700 mb-1" />
                <span className="text-[11px] font-semibold text-stone-800">10-Year Warranty</span>
                <span className="text-[10px] text-stone-500">Artisan framing</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
                <Sparkles className="w-4 h-4 text-stone-700 mb-1" />
                <span className="text-[11px] font-semibold text-stone-800">Direct Workshop</span>
                <span className="text-[10px] text-stone-500">Handcrafted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing & Minimalist Order Controls (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Category & Room tag */}
              <div className="flex items-center justify-between gap-4">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide text-stone-700 bg-stone-100 uppercase">
                  {product.room} • {product.category}
                </span>

                <span className="text-xs text-stone-400">SKU: FURNI-{product.id.padStart(4, '0')}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">
                  5.0 <span className="text-stone-400 font-normal">({product.reviewsCount} customer reviews)</span>
                </span>
              </div>

              {/* Pricing Box */}
              <div className="flex items-baseline gap-3 mt-5 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-3xl font-extrabold text-stone-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through font-normal">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="ml-auto text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Color Finish Picker */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                      Selected Finish
                    </label>
                    <span className="text-xs font-medium text-stone-500">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-xs font-medium">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Total Preview */}
              <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                    Quantity
                  </label>
                  <div className="inline-flex items-center border border-stone-300 rounded-lg bg-white p-0.5">
                    <button
                      id="decrease-qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      id="increase-qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Total</span>
                  <span className="text-2xl font-bold text-stone-900">
                    ${product.price * quantity}
                  </span>
                </div>
              </div>

              {/* MINIMALIST ORDERING BUTTONS */}
              <div className="mt-6 space-y-2.5 pt-5 border-t border-stone-200">
                {/* 1. Direct Order Button (Minimalist Charcoal) */}
                <button
                  id="direct-order-btn"
                  onClick={() => setIsDirectOrderModalOpen(true)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Direct Order</span>
                </button>

                {/* 2. Order via WhatsApp Button (Minimalist Forest Green) */}
                <button
                  id="whatsapp-order-btn"
                  onClick={handleInitiateWhatsAppOrder}
                  className="w-full bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-sm font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order via WhatsApp</span>
                </button>

                {/* 3. Add to Cart Button (Minimalist Outline) */}
                <button
                  id="page-add-to-cart-btn"
                  onClick={() => onAddToCart(product, quantity, selectedColor)}
                  className="w-full border border-stone-300 hover:border-stone-800 hover:bg-stone-50 text-stone-800 text-sm font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-600" />
                  <span>Add to Cart</span>
                </button>

                {/* Minimalist Profile Status Indicator */}
                <div className="pt-2 text-center">
                  {isCurrentProfileComplete ? (
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Shipping details verified. Instant WhatsApp checkout enabled.</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-500">
                      * Shipping details will be verified before launching WhatsApp order.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Specifications, Care, and Shipping Tabs */}
            <div className="mt-8 pt-5 border-t border-stone-200">
              <div className="flex border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 mr-5 transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 mr-5 transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'care'
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Care Guide
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'shipping'
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className="py-3.5 text-xs text-stone-600 leading-relaxed">
                {activeTab === 'specs' && (
                  <div className="space-y-1.5">
                    <p>
                      <strong className="text-stone-800">Dimensions:</strong>{' '}
                      {product.dimensions || '84" W x 38" D x 34" H'}
                    </p>
                    <p>
                      <strong className="text-stone-800">Room Category:</strong> {product.room}
                    </p>
                    <p>
                      <strong className="text-stone-800">Style Category:</strong> {product.category}
                    </p>
                    {product.materials && (
                      <p>
                        <strong className="text-stone-800">Materials:</strong>{' '}
                        {product.materials.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-1.5">
                    <p>• Dust gently with a clean, microfiber cloth.</p>
                    <p>• Blot spills immediately with a clean, damp white cloth.</p>
                    <p>• Keep away from prolonged direct heat or damp environments.</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-1.5">
                    <p>
                      • <strong>Dispatch:</strong> Leaves workshop within 24 to 48 hours.
                    </p>
                    <p>
                      • <strong>White-Glove Delivery:</strong> Carefully handled by verified couriers.
                    </p>
                    <p>
                      • <strong>Inquiries:</strong> Available directly via WhatsApp support at {displayWhatsApp}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-stone-900">You May Also Like</h2>
                <p className="text-xs text-stone-500">
                  Complementary designs curated for your {product.room}
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                View collection &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-colors cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      ${rel.price}
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-stone-500 uppercase">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-semibold text-stone-900 group-hover:text-stone-700 transition-colors truncate mt-0.5">
                        {rel.name}
                      </h4>
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-stone-600">View</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: DIRECT ORDER STATUS NOTICE (Pure English, Minimalist) */}
      {isDirectOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            id="direct-order-notice-modal"
            className="relative bg-white rounded-2xl max-w-md w-full p-6 text-center border border-stone-200 shadow-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              id="close-direct-order-modal-btn"
              onClick={() => setIsDirectOrderModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Banner */}
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-stone-900">
              Direct Checkout Unavailable
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Service Announcement
            </p>

            {/* Clear English Notice Message */}
            <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs leading-relaxed text-stone-700">
              <p className="font-semibold text-stone-900">
                Cash on Delivery is currently not available, and our payment gateway is temporarily disabled. Please check back in a few days.
              </p>
              <p className="text-stone-600">
                WhatsApp ordering is active and ready. You can place your order directly through our official WhatsApp desk.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                id="switch-to-whatsapp-btn"
                onClick={() => {
                  setIsDirectOrderModalOpen(false);
                  handleInitiateWhatsAppOrder();
                }}
                className="w-full bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order via WhatsApp</span>
              </button>

              <button
                id="dismiss-direct-order-btn"
                onClick={() => setIsDirectOrderModalOpen(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPLETE PROFILE & DELIVERY INFORMATION (Mandatory for WhatsApp Order) */}
      {isShippingPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            id="complete-shipping-modal"
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 text-left border border-stone-200 shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              id="close-shipping-prompt-btn"
              onClick={() => setIsShippingPromptModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800">
                <MapPin className="w-5 h-5 text-stone-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Complete Shipping Details
                </h3>
                <p className="text-xs text-stone-500">
                  Required before proceeding with WhatsApp order
                </p>
              </div>
            </div>

            {/* Summary of item being ordered */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3 mb-4 text-xs">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-900 truncate">{product.name}</p>
                <p className="text-stone-500 text-[11px]">
                  Finish: {selectedColor} • Qty: {quantity} • Total: ${product.price * quantity}
                </p>
              </div>
            </div>

            {/* Explanation / Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 mb-4 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                To send your order to WhatsApp ({displayWhatsApp}), please complete all required delivery fields. Your profile will be updated automatically.
              </span>
            </div>

            {/* Form Error Notice */}
            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* The Shipping Details Form */}
            <form onSubmit={handleSaveAndOrderViaWhatsApp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Contact Phone Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Street Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. 42 Heritage Park Lane"
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    City <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    State / Region (Optional)
                  </label>
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    placeholder="State"
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Postal / PIN Code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 700001"
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-1">
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Your information is secured and will be remembered for future orders.</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="submit"
                  id="confirm-shipping-and-order-btn"
                  disabled={isSavingProfile}
                  className="w-full bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>
                    {isSavingProfile ? 'Saving Details...' : 'Save & Continue to WhatsApp'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  id="cancel-shipping-modal-btn"
                  onClick={() => setIsShippingPromptModalOpen(false)}
                  className="w-full text-stone-500 hover:text-stone-800 text-xs font-medium py-2 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
