import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/furnitureData';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.room.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-start justify-center pt-20 p-4">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search chairs, dining sets, minimalist beds, sofas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick search suggestions */}
          <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-stone-400 font-medium shrink-0">Popular:</span>
            {['Modern Lounge Chair', 'Dining Set', 'Bed', 'Coffee Table', 'Sofa'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="bg-white border border-stone-200 px-2.5 py-1 rounded-full text-stone-600 hover:border-[#C08251] hover:text-[#C08251] transition-colors shrink-0"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-stone-100">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-stone-500">
                <p className="text-sm">No furniture found matching "{query}"</p>
                <p className="text-xs text-stone-400 mt-1">Try searching for "sofa", "bed", or "table".</p>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="flex items-center gap-4 py-3 hover:bg-stone-50 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#C08251] transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-xs text-stone-500">{p.room} • {p.category}</p>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">${p.price}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#C08251] group-hover:text-white flex items-center justify-center text-stone-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
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
