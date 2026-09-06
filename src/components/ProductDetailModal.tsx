import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          id="product-modal-dialog"
          className="relative bg-white rounded-3xl max-w-3xl w-full text-left overflow-hidden shadow-2xl border border-stone-200 transform transition-all"
        >
          {/* Close button */}
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 shadow hover:scale-105 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image */}
            <div className="relative bg-stone-100 min-h-[320px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 bg-stone-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tracking-wider text-[#C08251] uppercase">
                    {product.room} • {product.category}
                  </span>
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted
                        ? 'text-red-500 bg-red-50'
                        : 'text-stone-400 hover:text-red-500 hover:bg-stone-100'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-600">
                    5.0 ({product.reviewsCount} customer reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-extrabold text-stone-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-stone-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold text-stone-900 mb-2">
                      Finish / Fabric:{' '}
                      <span className="font-normal text-stone-600">{selectedColor}</span>
                    </p>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedColor === color.name
                              ? 'scale-110 border-stone-900 ring-2 ring-stone-400/50'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions and Specs */}
                {product.dimensions && (
                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-4 text-xs text-stone-500">
                    <div>
                      <strong className="text-stone-800">Dimensions:</strong> {product.dimensions}
                    </div>
                    {product.materials && (
                      <div>
                        <strong className="text-stone-800">Craft:</strong>{' '}
                        {product.materials.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={() => {
                      onAddToCart(product, quantity, selectedColor);
                      onClose();
                    }}
                    className="flex-1 bg-[#C08251] hover:bg-[#a96d3e] text-stone-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (${product.price * quantity})</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-700" />
                    Fast dispatch in 24-48 hours
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                    10-Year Warranty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
