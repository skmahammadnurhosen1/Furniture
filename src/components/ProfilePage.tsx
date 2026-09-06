import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  User,
  MapPin,
  Package,
  Save,
  LogOut,
  Clock,
  ChevronRight,
  Phone,
  Mail,
  Home,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserOrders } from '../services/orderService';
import { Order, UserProfile } from '../types';

interface ProfilePageProps {
  onBackToHome: () => void;
  onOpenAuth: () => void;
  initialTab?: 'profile' | 'address' | 'orders';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBackToHome,
  onOpenAuth,
  initialTab = 'profile',
}) => {
  const { user, profile, updateProfileData, uploadProfilePhotoFromBase64, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders'>(initialTab);

  // Form states
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [street, setStreet] = useState(profile?.street || '');
  const [apartment, setApartment] = useState(profile?.apartment || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [postalCode, setPostalCode] = useState(profile?.postalCode || '');
  const [country, setCountry] = useState(profile?.country || 'United States');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile data when available
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || user?.displayName || '');
      setPhone(profile.phone || '');
      setStreet(profile.street || '');
      setApartment(profile.apartment || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPostalCode(profile.postalCode || '');
      setCountry(profile.country || 'United States');
    }
  }, [profile, user]);

  // Subscribe to live user orders from Firestore
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      const unsubscribe = subscribeToUserOrders(
        user.uid,
        (userOrders) => {
          setOrders(userOrders);
          setLoadingOrders(false);
        },
        () => {
          setLoadingOrders(false);
        }
      );
      return () => unsubscribe();
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  // Handle local gallery photo upload & canvas compression
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          uploadProfilePhotoFromBase64(compressedBase64)
            .then(() => {
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            })
            .catch((err) => console.error('Failed to save profile photo:', err))
            .finally(() => setIsUploadingPhoto(false));
        } else {
          setIsUploadingPhoto(false);
        }
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload: Partial<UserProfile> = {
        displayName: displayName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      };

      await updateProfileData(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // If user is not logged in, display the sign-in gateway
  if (!user) {
    return (
      <div id="profile-unauth-container" className="min-h-screen bg-[#FAF9F6] pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <button
              onClick={onBackToHome}
              className="hover:text-stone-900 transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">My Account</span>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#C08251]/10 rounded-2xl flex items-center justify-center mx-auto text-[#C08251] mb-5">
              <User className="w-8 h-8" />
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Sign In to Your Furni Account
            </h1>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Access your order tracking, manage delivery addresses for 1-click checkout, and customize your profile photo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto">
              <button
                onClick={onOpenAuth}
                className="w-full py-3 px-6 bg-stone-900 hover:bg-[#C08251] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Sign In or Register
              </button>
              <button
                onClick={onBackToHome}
                className="w-full py-3 px-6 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avatarDisplay = profile?.photoBase64 || user.photoURL;

  return (
    <div id="profile-page-container" className="min-h-screen bg-[#FAF9F6] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between py-4 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button
              onClick={onBackToHome}
              className="hover:text-stone-900 transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">My Account</span>
          </div>

          <button
            id="profile-back-to-home-btn"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>

        {/* User Hero Banner */}
        <div className="mt-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Profile Avatar with Gallery Upload */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#C08251] bg-stone-100 flex items-center justify-center shadow-inner">
                  {avatarDisplay ? (
                    <img
                      src={avatarDisplay}
                      alt={displayName || 'User profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-stone-400" />
                  )}
                </div>

                {/* Gallery photo upload button */}
                <button
                  type="button"
                  id="page-gallery-photo-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  title="Upload avatar from device gallery"
                  aria-label="Upload photo from device gallery"
                  className="absolute bottom-0 right-0 p-2 bg-[#C08251] hover:bg-[#a86e41] text-white rounded-full shadow-md transition-transform transform hover:scale-110 cursor-pointer"
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
                    {displayName || user.displayName || 'Furniture Connoisseur'}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified Member
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user.email}</span>
                </p>

                {profile?.createdAt && (
                  <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                onBackToHome();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:border-stone-300 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-sm space-y-1">
              <button
                id="page-tab-profile"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Personal Info</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                id="page-tab-address"
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                id="page-tab-orders"
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'orders'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {orders.length}
                </span>
              </button>
            </div>

            {/* Quick Helper Box */}
            <div className="mt-4 bg-[#C08251]/10 rounded-2xl p-4 border border-[#C08251]/20 text-stone-700">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#C08251]" />
                1-Click Checkout
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Save your delivery address once, and all future Furni orders will automatically ship without requiring repeated form filling.
              </p>
            </div>
          </div>

          {/* Main Tab Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              {/* TAB 1: PERSONAL INFORMATION */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-stone-900">
                      Personal Information
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Update your name, contact phone number, and avatar.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Your profile details have been saved successfully to cloud storage.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Eleanor Vance"
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Email Address <span className="text-stone-400 font-normal">(Account Linked)</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 234-5678"
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-[11px] text-stone-400">
                      Changes persist safely across all your sessions and devices.
                    </p>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-[#C08251] text-white rounded-xl text-xs font-semibold transition-colors shadow cursor-pointer disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SHIPPING ADDRESS */}
              {activeTab === 'address' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-stone-900">
                      Default Shipping Address
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Save your primary delivery location so you never have to re-enter it during checkout.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Shipping address saved successfully.</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Street Address
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="742 Evergreen Terrace"
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          Apartment, Suite, Unit <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="Apt 4B"
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Springfield"
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Oregon"
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          Postal / ZIP Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="97477"
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-[11px] text-stone-400">
                      Address will be automatically selected during cart checkout.
                    </p>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-[#C08251] text-white rounded-xl text-xs font-semibold transition-colors shadow cursor-pointer disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Address'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-stone-900">
                      Order History
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Review previous purchases, shipping destinations, and real-time delivery status.
                    </p>
                  </div>

                  {loadingOrders ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C08251]" />
                      <p className="text-xs">Loading your orders from cloud database...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-stone-200 rounded-2xl p-6">
                      <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-stone-800">No orders placed yet</h3>
                      <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                        Explore our handcrafted furniture catalog and order your first designer piece.
                      </p>
                      <button
                        onClick={onBackToHome}
                        className="mt-4 px-4 py-2 bg-stone-900 hover:bg-[#C08251] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Browse Furniture Collection
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusColors: Record<string, string> = {
                          Processing: 'bg-amber-50 text-amber-800 border-amber-200',
                          Shipped: 'bg-blue-50 text-blue-800 border-blue-200',
                          Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        };

                        const formattedDate = order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent';

                        return (
                          <div
                            key={order.id}
                            className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all bg-stone-50/50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200 text-xs">
                              <div>
                                <span className="text-stone-400">Order ID: </span>
                                <strong className="text-stone-900 font-mono">#{order.id.slice(0, 10)}</strong>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-stone-500 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formattedDate}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                    statusColors[order.status] || 'bg-stone-100 text-stone-800'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="py-3 space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                                    />
                                    <div>
                                      <p className="font-semibold text-stone-900">{item.product.name}</p>
                                      <p className="text-[11px] text-stone-500">
                                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-stone-900">
                                    ${item.product.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Delivery Destination & Total */}
                            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-stone-500">
                                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span className="truncate max-w-xs">
                                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-stone-400 mr-1">Total:</span>
                                <strong className="text-sm text-stone-900 font-bold">
                                  ${order.totalAmount}
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
