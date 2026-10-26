import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Palmtree,
  Mountain,
  Landmark,
  Heart,
  Binoculars,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { destinationsData } from '../data/destinationsData';
import { packagesData } from '../data/packagesData';
import { DestinationCard } from '../components/DestinationCard';
import { PackageCard } from '../components/PackageCard';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGuests, setSelectedGuests] = useState('2');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/destinations?${params.toString()}`);
  };

  const categories = [
    { name: 'Beach & Relaxation', icon: Palmtree, color: 'text-amber-500 bg-amber-50' },
    { name: 'Mountain Adventure', icon: Mountain, color: 'text-emerald-500 bg-emerald-50' },
    { name: 'Cultural Heritage', icon: Landmark, color: 'text-indigo-500 bg-indigo-50' },
    { name: 'Luxury Romantic', icon: Heart, color: 'text-rose-500 bg-rose-50' },
    { name: 'Wildlife & Safari', icon: Binoculars, color: 'text-teal-500 bg-teal-50' },
    { name: 'City & Culture', icon: Building2, color: 'text-sky-500 bg-sky-50' }
  ];

  const popularDestinations = destinationsData.filter((d) => d.featured).slice(0, 4);
  const featuredPackages = packagesData.filter((p) => p.featured);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic mountain landscape"
            className="w-full h-full object-cover opacity-45 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-sky-200 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Discover over 120+ handpicked worldwide itineraries</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none max-w-4xl mx-auto drop-shadow-sm">
            Escape the Ordinary. <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Explore Extraordinary Destinations.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Curated travel packages, verified luxury stays, and seamless bookings with instant confirmation.
          </p>

          {/* Quick Search Floating Box */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 text-slate-800 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center"
            >
              {/* Where to */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label htmlFor="search-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Destination
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Where to? (e.g. Manali, Kashmir, Bali)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-semibold bg-transparent text-slate-900 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                <Compass className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label htmlFor="category-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Trip Type
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-sm font-semibold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label htmlFor="guests-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Travelers
                  </label>
                  <select
                    id="guests-select"
                    value={selectedGuests}
                    onChange={(e) => setSelectedGuests(e.target.value)}
                    className="w-full text-sm font-semibold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="1">1 Solo Traveler</option>
                    <option value="2">2 Travelers (Couple)</option>
                    <option value="3">3 - 4 Travelers (Family)</option>
                    <option value="5">5+ Group</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips</span>
              </button>
            </form>
          </div>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Booking Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>24/7 On-Tour Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Find Your Style
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Browse by Travel Category
            </h2>
          </div>
          <Link
            to="/destinations"
            className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/destinations?category=${encodeURIComponent(cat.name)}`)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all text-center flex flex-col items-center justify-center gap-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              World's Best Locations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked iconic paradises loved by thousands of travelers
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors self-start sm:self-auto"
          >
            <span>Explore All 10+ Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Featured Travel Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Curated Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Travel Packages
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top rated itineraries with certified guides, accommodations, and activities included
            </p>
          </div>

          <Link
            to="/destinations"
            className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>See All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* Promotional Discount Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-sky-800/40">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 hidden lg:block pointer-events-none">
            <Compass className="w-full h-full text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Time Offer</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Get Up to 15% Off Your Next Dream Getaway
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Use promo code <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">WANDER10</span> at checkout for instant savings across any luxury package!
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/destinations"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Claim Discount & Book
              </Link>
              <Link
                to="/destinations?category=Luxury+Romantic"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors"
              >
                Browse Honeymoon & Luxury
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Wanderlust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
            Peace of Mind
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Travelers Choose Wanderlust
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            We take the stress out of vacation planning with unmatched reliability and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              100% Certified Stays & Guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every hotel, villa, and tour specialist in our catalog is rigorously verified for safety, hospitality, and comfort.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Best Rate Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We negotiate directly with local operators to offer you unbeatable pricing without surprise service charges.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Small Group Magic
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Travel with like-minded explorers in intimate small groups (max 8-12 people) or opt for fully private departures.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
