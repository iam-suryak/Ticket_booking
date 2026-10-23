import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  RotateCcw,
  LayoutGrid,
  List,
  Filter,
  DollarSign,
  Clock,
  Star,
  Globe,
  Compass,
  Heart
} from 'lucide-react';
import { packagesData } from '../data/packagesData';
import { destinationsData } from '../data/destinationsData';
import { PackageCard } from '../components/PackageCard';
import { DestinationCard } from '../components/DestinationCard';
import { useBooking } from '../context/BookingContext';
import { formatPrice } from '../utils/formatters';

export const DestinationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist, currency } = useBooking();

  // Search & Filter state initialized from URL params if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [showSavedOnly, setShowSavedOnly] = useState(searchParams.get('saved') === 'true');
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'destinations'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL search query changes
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearchQuery(s);
    const c = searchParams.get('category');
    if (c !== null) setSelectedCategory(c);
    if (searchParams.get('saved') === 'true') setShowSavedOnly(true);
  }, [searchParams]);

  // Extract distinct filter options
  const categories = useMemo(() => {
    const set = new Set(packagesData.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const continents = ['All', 'Asia', 'Europe', 'Americas', 'Africa'];

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packagesData
      .filter((pkg) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = pkg.title.toLowerCase().includes(q);
          const matchDest = pkg.destination.toLowerCase().includes(q);
          const matchCountry = pkg.country.toLowerCase().includes(q);
          const matchDesc = pkg.overview.toLowerCase().includes(q);
          const matchCategory = pkg.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDest && !matchCountry && !matchDesc && !matchCategory) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All' && pkg.category !== selectedCategory) {
          return false;
        }

        // Continent
        if (selectedContinent !== 'All' && pkg.continent !== selectedContinent) {
          return false;
        }

        // Price
        if (pkg.price > maxPrice) {
          return false;
        }

        // Duration
        if (selectedDuration === 'short' && pkg.durationDays > 5) return false;
        if (selectedDuration === 'medium' && (pkg.durationDays < 6 || pkg.durationDays > 7)) return false;
        if (selectedDuration === 'long' && pkg.durationDays < 8) return false;

        // Rating
        if (minRating > 0 && pkg.rating < minRating) return false;

        // Saved wishlist filter
        if (showSavedOnly && !wishlist.includes(pkg.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'duration-short') return a.durationDays - b.durationDays;
        if (sortBy === 'duration-long') return b.durationDays - a.durationDays;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: recommended / featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    searchQuery,
    selectedCategory,
    selectedContinent,
    maxPrice,
    selectedDuration,
    minRating,
    showSavedOnly,
    wishlist,
    sortBy
  ]);

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return destinationsData.filter((dest) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          dest.name.toLowerCase().includes(q) ||
          dest.country.toLowerCase().includes(q) ||
          dest.popularTags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (selectedContinent !== 'All' && dest.continent !== selectedContinent) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedContinent]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedContinent('All');
    setSelectedDuration('All');
    setMinRating(0);
    setMaxPrice(2500);
    setShowSavedOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedContinent !== 'All' ||
    selectedDuration !== 'All' ||
    minRating > 0 ||
    maxPrice < 2500 ||
    showSavedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Search & Filter Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Destinations & Packages
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Filter through premium guided itineraries, luxury beach getaways, alpine wonders, and historic cities tailored to your travel style.
          </p>
        </div>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar Input */}
        <div className="relative w-full md:max-w-md">
          <label htmlFor="search-destinations" className="sr-only">Search destinations, packages, country or keywords</label>
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-destinations"
            type="text"
            placeholder="Search destination, country, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode toggle & Mobile Filter button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Wishlist quick toggle */}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showSavedOnly
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <label htmlFor="sort-packages" className="sr-only">Sort packages</label>
            <select
              id="sort-packages"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration-short">Duration: Shortest</option>
              <option value="duration-long">Duration: Longest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid / List switch */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                <X className="w-3 h-3 hover:text-sky-950" />
              </button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} aria-label="Remove category filter">
                <X className="w-3 h-3 hover:text-sky-950" />
              </button>
            </span>
          )}
          {selectedContinent !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              Region: {selectedContinent}
              <button onClick={() => setSelectedContinent('All')} aria-label="Remove region filter">
                <X className="w-3 h-3 hover:text-sky-950" />
              </button>
            </span>
          )}
          {selectedDuration !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              Duration: {selectedDuration}
              <button onClick={() => setSelectedDuration('All')} aria-label="Remove duration filter">
                <X className="w-3 h-3 hover:text-sky-950" />
              </button>
            </span>
          )}
          {maxPrice < 2500 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-100 text-sky-800 font-semibold">
              Up to {formatPrice(maxPrice, currency)}
              <button onClick={() => setMaxPrice(2500)} aria-label="Remove max price filter">
                <X className="w-3 h-3 hover:text-sky-950" />
              </button>
            </span>
          )}
          {showSavedOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-rose-100 text-rose-800 font-semibold">
              Wishlist Only
              <button onClick={() => setShowSavedOnly(false)} aria-label="Remove wishlist filter">
                <X className="w-3 h-3 hover:text-rose-950" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-2 underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block md:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">Filter Packages</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Travel Category
            </span>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-sky-50 text-sky-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Region / Continent Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Continent
            </span>
            <div className="flex flex-wrap gap-1.5">
              {continents.map((cont) => (
                <button
                  key={cont}
                  onClick={() => setSelectedContinent(cont)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedContinent === cont
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cont}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Max Budget
              </span>
              <span className="text-xs font-extrabold text-sky-600">
                {formatPrice(maxPrice, currency)}
              </span>
            </div>
            <label htmlFor="price-range" className="sr-only">Maximum budget slider</label>
            <input
              id="price-range"
              type="range"
              min="1000"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>{formatPrice(1000, currency)}</span>
              <span>{formatPrice(2500, currency)}</span>
            </div>
          </div>

          {/* Trip Duration Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Trip Duration
            </span>
            <div className="space-y-1.5">
              {[
                { label: 'All Durations', val: 'All' },
                { label: '1 - 5 Days (Short Break)', val: 'short' },
                { label: '6 - 7 Days (Standard Week)', val: 'medium' },
                { label: '8+ Days (Extended Tour)', val: 'long' }
              ].map((d) => (
                <label key={d.val} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900">
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDuration === d.val}
                    onChange={() => setSelectedDuration(d.val)}
                    className="accent-sky-600"
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Minimum Rating
            </span>
            <div className="space-y-1.5">
              {[
                { label: 'Any Rating', val: 0 },
                { label: '4.9 & Above', val: 4.9 },
                { label: '4.8 & Above', val: 4.8 }
              ].map((r) => (
                <label key={r.val} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r.val}
                    onChange={() => setMinRating(r.val)}
                    className="accent-sky-600"
                  />
                  <span className="flex items-center gap-1">
                    {r.label}
                    {r.val > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="md:col-span-3 space-y-6">
          {/* Navigation View Tabs (Packages vs Destinations) */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('packages')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
                  activeTab === 'packages'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Travel Packages ({filteredPackages.length})
              </button>

              <button
                onClick={() => setActiveTab('destinations')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
                  activeTab === 'destinations'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Destinations Directory ({filteredDestinations.length})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              {activeTab === 'packages' ? `${filteredPackages.length} packages found` : `${filteredDestinations.length} destinations`}
            </span>
          </div>

          {/* TAB 1: Packages List / Grid */}
          {activeTab === 'packages' && (
            <>
              {filteredPackages.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
                  <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    No matching travel packages found
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    We couldn't find any packages matching your specific search or filter criteria. Try adjusting your budget or clearing filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} layout="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} layout="list" />
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 2: Destinations Directory */}
          {activeTab === 'destinations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
