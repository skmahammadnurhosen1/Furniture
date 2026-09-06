import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ArrowLeft,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingBag,
  Package,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Product } from '../types';

interface SearchPageProps {
  products: Product[];
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  initialQuery?: string;
  initialCategory?: string;
}

const CATEGORIES = ['All', 'Chairs', 'Sofas', 'Tables', 'Beds', 'Lamps', 'Storage'];
const ROOMS = ['All Rooms', 'Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor'];

export const SearchPage: React.FC<SearchPageProps> = ({
  products = [],
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  initialQuery = '',
  initialCategory = 'All',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Popular search tags for instant discovery
  const popularKeywords = [
    'Lounge Chair',
    'Oak Dining Table',
    'Bouclé Sofa',
    'Bed Frame',
    'Pendant Lamp',
    'Sideboard',
  ];

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();

    return (products || [])
      .filter((product) => {
        // Query search against name, category, room, description, material
        const matchesQuery =
          !q ||
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.room.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          (product.materials && product.materials.some((m) => m.toLowerCase().includes(q)));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        // Room filter
        const matchesRoom =
          selectedRoom === 'All Rooms' ||
          product.room.toLowerCase() === selectedRoom.toLowerCase();

        // In-stock filter
        const matchesStock = !inStockOnly || product.inStock;

        return matchesQuery && matchesCategory && matchesRoom && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, query, selectedCategory, selectedRoom, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedRoom('All Rooms');
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <div id="search-page-container" className="min-h-screen bg-[#FAF9F6] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back Action */}
        <div className="flex items-center justify-between py-4 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button
              onClick={onBackToHome}
              className="hover:text-stone-900 transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Search Collection</span>
          </div>

          <button
            id="search-back-to-home-btn"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>

        {/* Page Hero / Search Input Header */}
        <div className="py-8 sm:py-10">
          <div className="max-w-3xl">
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Search Catalog<span className="text-[#C08251]">.</span>
            </h1>
            <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
              Find minimalist furniture, organic dining setups, bespoke armchairs, and calming bedroom accents crafted for modern sanctuaries.
            </p>
          </div>

          {/* Big Search Bar */}
          <div className="mt-6 relative max-w-3xl">
            <div className="relative flex items-center shadow-md bg-white rounded-2xl border border-stone-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#C08251] focus-within:border-transparent transition-all">
              <div className="pl-5 pr-3 text-stone-400">
                <Search className="w-6 h-6 text-stone-400" />
              </div>
              <input
                id="search-page-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chairs, solid wood tables, bouclé sofas, beds..."
                className="w-full py-4 text-base sm:text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="p-2 mr-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Popular Search Suggestions */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Popular:
            </span>
            {popularKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => setQuery(keyword)}
                className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  query.toLowerCase() === keyword.toLowerCase()
                    ? 'bg-[#C08251] text-white font-medium shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-[#C08251] hover:text-[#C08251]'
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting Control Strip */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-xs font-semibold text-stone-500 shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Room Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-stone-500">Room:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#C08251] cursor-pointer"
              >
                {ROOMS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-1.5 ml-2 cursor-pointer select-none text-stone-600 hover:text-stone-900">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-[#C08251] focus:ring-[#C08251]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-stone-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#C08251] cursor-pointer"
                >
                  <option value="featured">Curated & Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {(query || selectedCategory !== 'All' || selectedRoom !== 'All Rooms' || inStockOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-900 underline font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone-500">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'result' : 'results'}
            {query && (
              <span>
                {' '}
                for "<strong className="text-stone-900">{query}</strong>"
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-1">
              No furniture matches your criteria
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              We couldn't find anything matching your current filters. Try relaxing your search terms or exploring our popular categories.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                onClick={onBackToHome}
                className="px-4 py-2 border border-stone-300 hover:border-stone-500 text-stone-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const favorited = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    />

                    {/* Room & Stock Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                      <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {product.room}
                      </span>
                      {product.featured && (
                        <span className="bg-[#C08251] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      aria-label="Wishlist"
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer shadow-md ${
                        favorited
                          ? 'bg-rose-50 text-rose-500 scale-105'
                          : 'bg-white/90 backdrop-blur-md text-stone-600 hover:text-rose-500 hover:bg-white'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favorited ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                        <span>{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-stone-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#C08251] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block">Price</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-stone-900">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-stone-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className="flex items-center gap-1.5 bg-stone-900 hover:bg-[#C08251] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
