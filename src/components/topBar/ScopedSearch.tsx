'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProductContext } from '@/context';
import {
  Search,
  X,
  ChevronDown,
  PackageCheck,
  Leaf,
  RotateCcw,
  TrendingUp,
  Clock,
} from 'lucide-react';
import type { Product } from '@/types';

/* ── Category config ─────────────────────────────────────────────── */
const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: "men's clothing", label: "Men's Clothing" },
  { value: "women's clothing", label: "Women's Clothing" },
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelery', label: 'Jewelery' },
  { value: 'others', label: 'Others' },
] as const;

/* ── Intent-based filters ────────────────────────────────────────── */
const INTENT_FILTERS = [
  {
    id: 'in-stock',
    label: 'In Stock Only',
    icon: PackageCheck,
    description: 'Show only available products',
  },
  {
    id: 'eco-friendly',
    label: 'Eco-Friendly',
    icon: Leaf,
    description: 'Sustainably sourced & packaged',
  },
  {
    id: 'reorder',
    label: 'Past Purchases',
    icon: RotateCcw,
    description: 'Quickly reorder previous items',
  },
] as const;

/* ── Skeleton loader ─────────────────────────────────────────────── */
function SearchSkeleton() {
  return (
    <div className="space-y-3 p-4" role="status" aria-label="Loading search results">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Product result row ──────────────────────────────────────────── */
function ProductResult({
  product,
  isActive,
  onClick,
}: {
  product: Product;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="option"
      aria-selected={isActive}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
      tabIndex={-1}
    >
      <img
        src={product.image}
        alt=""
        className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <span>${product.price.toFixed(2)}</span>
          <span className="text-gray-300">·</span>
          <span className="capitalize">{product.category}</span>
        </p>
      </div>
    </button>
  );
}

/* ── Active filter chip (inline, compact) ────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-0.5 bg-gray-900 text-white text-[11px] font-medium pl-2 pr-1 py-0.5 rounded-md shrink-0 max-w-[120px]">
      <span className="truncate">{label}</span>
      <button
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 hover:bg-white/20 rounded transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCOPED SEARCH – Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function ScopedSearch() {
  const router = useRouter();
  const { items, setSearchByTitle, setSearchByCategory } = useProductContext();

  /* ── Local state ───────────────────────────────────────────────── */
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeIntentFilters, setActiveIntentFilters] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Derived data ──────────────────────────────────────────────── */
  const predictions = useMemo(() => {
    if (!query.trim() || !items) return [];
    const q = query.toLowerCase();
    let results = items.filter(p => {
      const matchesTitle = p.title.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesTitle && matchesCategory;
    });

    // Intent filter: In Stock Only
    if (activeIntentFilters.includes('in-stock')) {
      results = results.filter(p => (p.stock ?? 1) > 0);
    }

    return results.slice(0, 6);
  }, [query, items, selectedCategory, activeIntentFilters]);

  const trendingProducts = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0)).slice(0, 4);
  }, [items]);

  const recentSearches = useMemo(
    () => ['Wireless headphones', 'Gold bracelet', 'Winter jacket'],
    []
  );

  const categoryLabel =
    CATEGORIES.find(c => c.value === selectedCategory)?.label ?? 'All Categories';

  const showDropdown = isFocused;
  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = activeIntentFilters.length > 0 || !!selectedCategory;

  /* ── Simulate search delay for skeleton demo ───────────────────── */
  useEffect(() => {
    if (!hasQuery) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(() => setIsSearching(false), 300);
    return () => clearTimeout(t);
  }, [query, selectedCategory, hasQuery]);

  /* ── Keyboard shortcut: Cmd/Ctrl+K ─────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
        setIsFocused(false);
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isFocused]);

  /* ── Click-outside handler ─────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Reset active index on predictions change ──────────────────── */
  useEffect(() => {
    setActiveIndex(-1);
  }, [predictions]);

  /* ── Handlers ──────────────────────────────────────────────────── */
  const applySearch = useCallback(
    (title?: string, category?: string) => {
      setSearchByTitle(title || undefined);
      setSearchByCategory(category || undefined);
      setIsFocused(false);
      inputRef.current?.blur();

      // Navigate to root if on a different page
      if (category) {
        const slug =
          category === "men's clothing" ? 'clothes' : category === 'others' ? 'others' : category;
        router.push(`/${slug}`);
      } else {
        router.push('/');
      }
    },
    [setSearchByTitle, setSearchByCategory, router]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      applySearch(query, selectedCategory);
    },
    [query, selectedCategory, applySearch]
  );

  const handleProductClick = useCallback(
    (product: Product) => {
      setQuery(product.title);
      applySearch(product.title, selectedCategory);
    },
    [selectedCategory, applySearch]
  );

  const handleCategorySelect = useCallback((value: string) => {
    setSelectedCategory(value);
    setShowCategoryDropdown(false);
    inputRef.current?.focus();
  }, []);

  const toggleIntentFilter = useCallback((id: string) => {
    setActiveIntentFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const maxIndex = predictions.length - 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => (i < maxIndex ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => (i > 0 ? i - 1 : maxIndex));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        handleProductClick(predictions[activeIndex]);
      }
    },
    [predictions, activeIndex, handleProductClick]
  );

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="relative w-full max-w-2xl" ref={containerRef}>
      {/* Backdrop blur when active */}
      {showDropdown && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => {
            setIsFocused(false);
            setShowCategoryDropdown(false);
            inputRef.current?.blur();
          }}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className={`relative z-40 flex items-center bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
          isFocused
            ? 'border-black shadow-lg ring-2 ring-black/5'
            : 'border-gray-300 hover:border-gray-400 shadow-sm'
        }`}
        role="search"
        aria-label="Search products"
      >
        {/* Category scope button */}
        <div className="relative">
          <button
            ref={categoryBtnRef}
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="hidden sm:flex items-center gap-1.5 pl-3.5 pr-2 py-2.5 text-sm text-gray-600 hover:text-gray-900 border-r border-gray-200 whitespace-nowrap transition-colors"
            aria-haspopup="listbox"
            aria-expanded={showCategoryDropdown}
            aria-label={`Search scope: ${categoryLabel}`}
          >
            <span className="text-xs font-medium">{categoryLabel}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Category dropdown */}
          {showCategoryDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150"
              role="listbox"
              aria-label="Select category"
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  role="option"
                  aria-selected={cat.value === selectedCategory}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    cat.value === selectedCategory
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleCategorySelect(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input + inline filter chips */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <Search className="h-4 w-4 text-gray-400 ml-3 sm:ml-2.5 shrink-0" aria-hidden="true" />

          {/* Inline active filter chips */}
          {hasActiveFilters && (
            <div
              className="flex items-center gap-1 shrink-0"
              role="status"
              aria-label="Active filters"
            >
              {selectedCategory && (
                <FilterChip
                  label={categoryLabel}
                  onRemove={() => {
                    setSelectedCategory('');
                    setSearchByCategory(undefined);
                  }}
                />
              )}
              {activeIntentFilters.map(id => {
                const f = INTENT_FILTERS.find(fi => fi.id === id);
                return f ? (
                  <FilterChip key={id} label={f.label} onRemove={() => toggleIntentFilter(id)} />
                ) : null;
              })}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown && hasQuery}
            aria-controls="search-results-listbox"
            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            aria-label="Search for products by name or description"
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 py-2.5 px-2.5 focus:outline-none min-w-0"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchByTitle(undefined);
                inputRef.current?.focus();
              }}
              className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Kbd shortcut hint */}
          {!isFocused && !query && (
            <kbd className="hidden lg:inline-flex items-center gap-0.5 mr-3 px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px] font-mono border border-gray-200">
              ⌘K
            </kbd>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Submit search"
          >
            <Search className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* ── Search dropdown ─────────────────────────────────────── */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto"
          id="search-results-listbox"
          role="listbox"
          aria-label="Search results"
        >
          {/* Intent-based filters */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Smart Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {INTENT_FILTERS.map(filter => {
                const Icon = filter.icon;
                const isActive = activeIntentFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleIntentFilter(filter.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    aria-pressed={isActive}
                    title={filter.description}
                  >
                    <Icon className="h-3 w-3" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results area */}
          {hasQuery ? (
            isSearching ? (
              <SearchSkeleton />
            ) : predictions.length > 0 ? (
              <div role="group" aria-label="Product suggestions">
                <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Products
                </p>
                {predictions.map((product, idx) => (
                  <div key={product.id} id={`search-result-${idx}`}>
                    <ProductResult
                      product={product}
                      isActive={idx === activeIndex}
                      onClick={() => handleProductClick(product)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state for no matches */
              <div className="py-10 text-center">
                <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different keyword or remove filters
                </p>
              </div>
            )
          ) : (
            /* Zero-state: trending + recent */
            <div>
              {/* Recent searches */}
              <div className="border-b border-gray-100">
                <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </p>
                {recentSearches.map(term => (
                  <button
                    key={term}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                    onClick={() => {
                      setQuery(term);
                      applySearch(term, selectedCategory);
                    }}
                  >
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>

              {/* Trending products */}
              <div>
                <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" />
                  Trending Now
                </p>
                {trendingProducts.map(product => (
                  <ProductResult
                    key={product.id}
                    product={product}
                    isActive={false}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
