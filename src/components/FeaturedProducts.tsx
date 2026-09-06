import React from 'react';
import { Star, Plus, Heart } from 'lucide-react';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onSelectProduct: (product: Product) => void;
}

const CATEGORY_TABS = ['All', 'Sofas', 'Beds', 'Tables', 'Chairs'];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
}) => {
  return (
    <section id="featured-products" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
        <div>
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#C08251] uppercase block mb-1.5 sm:mb-2">
            BEST SELLERS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-stone-500 text-xs sm:text-base mt-1 sm:mt-2">
            Our most loved pieces, chosen by customers.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          id="product-category-tabs"
          className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 self-start lg:self-auto bg-stone-100/80 p-1 sm:p-1.5 rounded-full border border-stone-200/60"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                onClick={() => onSelectCategory(tab)}
                className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid: 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => {
          const wishlisted = isWishlisted(product.id);
          return (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="group bg-white rounded-xl sm:rounded-2xl border border-stone-200/70 p-3 sm:p-5 flex flex-col justify-between shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Container with Wishlist Button */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2.5 sm:mb-4 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Wishlist Heart Button */}
                <button
                  id={`wishlist-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  aria-label={`Add ${product.name} to wishlist`}
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    wishlisted
                      ? 'bg-red-50 text-red-500 hover:scale-110'
                      : 'bg-white/90 backdrop-blur-sm text-stone-600 hover:text-red-500 hover:bg-white'
                  }`}
                >
                  <Heart
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors"
                    fill={wishlisted ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs sm:text-base font-bold text-stone-900 tracking-tight hover:text-[#C08251] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 sm:gap-1.5 mt-1">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-stone-400 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Price and Add to Cart Row */}
                <div className="flex items-center justify-between mt-2.5 sm:mt-4 pt-1.5 sm:pt-2 border-t border-stone-100">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-lg font-extrabold text-stone-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Round Add Button */}
                  <button
                    id={`add-to-cart-btn-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    aria-label={`Add ${product.name} to shopping cart`}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C08251] hover:bg-[#a56a3b] active:scale-90 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
