import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  CalendarCheck,
  Heart,
  Globe,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { CURRENCIES } from '../utils/formatters';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { bookings, wishlist, currency, setCurrency } = useBooking();
  const location = useLocation();

  // Close mobile menu on page transition
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Track scroll state for enhanced navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Wanderlust
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              </span>
              <p className="text-[11px] font-medium tracking-wider text-slate-600 uppercase">
                Travel & Expeditions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-sky-600 bg-sky-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/destinations"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-sky-600 bg-sky-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <MapPin className="w-4 h-4 text-sky-500" />
              Destinations & Packages
            </NavLink>

            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-sky-600 bg-sky-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>My Bookings</span>
              {bookings.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-teal-100 text-teal-700">
                  {bookings.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right Action Tools: Currency Selector, Wishlist, CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative flex items-center">
              <label htmlFor="currency-select" className="sr-only">Select Currency</label>
              <Globe className="w-4 h-4 text-slate-600 absolute left-2.5 pointer-events-none" />
              <select
                id="currency-select"
                aria-label="Select Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer transition-colors"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 pointer-events-none" />
            </div>

            {/* Wishlist Link */}
            <Link
              to="/destinations?saved=true"
              className="relative p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Book Trip Quick Button */}
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Tours</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/my-bookings"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              title="My Bookings"
            >
              <CalendarCheck className="w-5 h-5" />
              {bookings.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                location.pathname === '/'
                  ? 'bg-sky-50 text-sky-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/destinations"
              className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                location.pathname === '/destinations'
                  ? 'bg-sky-50 text-sky-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Destinations & Packages</span>
              <MapPin className="w-4 h-4 text-sky-500" />
            </Link>

            <Link
              to="/my-bookings"
              className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                location.pathname === '/my-bookings'
                  ? 'bg-teal-50 text-teal-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>My Bookings</span>
              {bookings.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-100 text-teal-700">
                  {bookings.length}
                </span>
              )}
            </Link>

            <Link
              to="/destinations?saved=true"
              className="px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between text-slate-700 hover:bg-slate-50"
            >
              <span>Saved Wishlist</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-600">
                {wishlist.length} saved
              </span>
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Currency</span>
            <div className="flex gap-1">
              {Object.values(CURRENCIES).map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                    currency === c.code
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
