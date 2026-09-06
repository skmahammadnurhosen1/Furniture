import React, { useState } from 'react';
import { X, MapPin, Phone, User, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import { ShippingAddress } from '../types';

interface CheckoutAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: ShippingAddress) => Promise<void>;
  initialAddress?: Partial<ShippingAddress>;
  totalAmount: number;
}

export const CheckoutAddressModal: React.FC<CheckoutAddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialAddress,
  totalAmount,
}) => {
  const [fullName, setFullName] = useState(initialAddress?.fullName || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [apartment, setApartment] = useState(initialAddress?.apartment || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || '');
  const [country, setCountry] = useState(initialAddress?.country || 'United States');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in all required address fields to proceed with your order.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const address: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      apartment: apartment.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };

    try {
      await onSubmit(address);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkout-address-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="checkout-address-card"
        className="w-full max-w-lg bg-[#FAF9F6] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative"
      >
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C08251] flex items-center justify-center border border-amber-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Shipping & Delivery Address
              </h3>
              <p className="text-xs text-stone-500">
                Please provide your delivery location to complete your order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Recipient Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Street Address *
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                id="checkout-street"
                type="text"
                required
                placeholder="123 Luxury Ave"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Apartment, Suite, Unit (Optional)
            </label>
            <input
              id="checkout-apartment"
              type="text"
              placeholder="Suite 300"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City *
              </label>
              <input
                id="checkout-city"
                type="text"
                required
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                State / Province
              </label>
              <input
                id="checkout-state"
                type="text"
                placeholder="NY"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postal / ZIP Code *
              </label>
              <input
                id="checkout-postal"
                type="text"
                required
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Country *
              </label>
              <input
                id="checkout-country"
                type="text"
                required
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Saved securely to your profile</span>
            </div>
            <button
              id="confirm-order-address-btn"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C08251] hover:bg-[#a86e41] text-stone-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-sm cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Placing Order...' : `Complete Order ($${totalAmount})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
