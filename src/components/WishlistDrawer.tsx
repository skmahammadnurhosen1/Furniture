import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">Saved Favorites</h2>
              <span className="text-xs bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>
            <button
              id="close-wishlist-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <Heart className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone-300" />
                <p className="text-base font-semibold text-stone-700">No saved items yet</p>
                <p className="text-xs text-stone-500 mt-1">Tap the heart icon on any piece to save it for later.</p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-3.5 border border-stone-200/80 flex gap-4 shadow-sm items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500">{product.category}</p>
                    <p className="text-sm font-extrabold text-stone-900 mt-1">
                      ${product.price}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                        }}
                        className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-[#C08251] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-stone-400 hover:text-red-500 p-1.5 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
