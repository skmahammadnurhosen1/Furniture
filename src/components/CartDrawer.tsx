import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 199;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = items.length === 0 || isFreeShipping ? 0 : 25;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FURNI20' || promoCode.trim().toUpperCase() === 'WELCOME15') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "FURNI20"');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setTimeout(() => {
        onClearCart();
        setCheckoutComplete(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C08251]" />
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">Your Cart</h2>
              <span className="text-xs bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF4EC] px-6 py-3 border-b border-[#F0E4D3]">
            {isFreeShipping ? (
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Congratulations! You qualified for Free Shipping.
              </p>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Add <strong className="text-[#A86632]">${amountToFreeShipping}</strong> more for free shipping!</span>
                  <span>{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C08251] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutComplete ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Order Confirmed!</h3>
                <p className="text-sm text-stone-500 mt-2">
                  Thank you for shopping with Furni. A confirmation email has been dispatched.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone-300" />
                <p className="text-base font-semibold text-stone-700">Your cart is currently empty</p>
                <p className="text-xs text-stone-500 mt-1">Discover handcrafted furniture pieces for your home.</p>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#C08251] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || 'default'}`}
                  className="bg-white rounded-xl p-3 border border-stone-200/80 flex gap-3.5 shadow-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.selectedColor && (
                        <p className="text-[11px] text-stone-400 mt-0.5">Color: {item.selectedColor}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-stone-900">
                        ${item.product.price * item.quantity}
                      </span>
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r-md"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && !checkoutComplete && (
            <div className="p-6 bg-white border-t border-stone-200/80 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (use FURNI20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 uppercase focus:outline-none focus:ring-1 focus:ring-[#C08251]"
                />
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-[#C08251] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
              {discountPercent > 0 && (
                <p className="text-[11px] text-emerald-600 font-semibold">
                  ✓ {discountPercent}% discount applied!
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span className="text-base text-[#A86632]">${total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#C08251] hover:bg-[#b07444] text-stone-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isCheckingOut ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <span>Checkout (${total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
