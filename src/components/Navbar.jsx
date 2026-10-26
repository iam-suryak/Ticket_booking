import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/formatters';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { bookings, wishlist, currency, setCurrency } = useBooking();
  const { user, isAuthenticated, logout, openAuthModal, openProfileModal } = useAuth();
  const location = useLocation();

  // Close mobile and user menus on page transition
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Track scroll state for enhanced navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Right Action Tools: Currency Selector, Wishlist, Auth, CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative flex items-center">
              <label htmlFor="currency-select" className="sr-only">Select Currency</label>
              <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
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
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
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

            {/* Customer Authentication & Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                  aria-expanded={isUserMenuOpen}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-sky-400"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block leading-none flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Logged In
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User summary header */}
                    <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Active Customer
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {user.phone && (
                        <p className="text-[11px] text-slate-500 truncate">{user.phone}</p>
                      )}
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openProfileModal();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-sky-600" />
                        <span>Customer Details & Profile</span>
                      </button>

                      <Link
                        to="/my-bookings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <CalendarCheck className="w-4 h-4 text-teal-600" />
                          <span>My Bookings</span>
                        </span>
                        {bookings.length > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-100 text-teal-700">
                            {bookings.length}
                          </span>
                        )}
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 p-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>Customer Sign In</span>
              </button>
            )}

            {/* Book Trip Quick Button */}
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Tours</span>
            </Link>
          </div>

          {/* Mobile menu button & user avatar */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={openProfileModal}
                className="p-1 rounded-lg border border-slate-200 bg-white"
                title="Customer Profile"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-md object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="p-2 text-sky-600 hover:text-sky-700 text-xs font-bold flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

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
          {/* Customer Profile Banner in Mobile Drawer */}
          {isAuthenticated ? (
            <div className="p-3.5 mb-3 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-xl object-cover border border-sky-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[150px]">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100/60 rounded-lg flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mb-3 p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
              <div className="text-xs text-sky-900">
                <span className="font-bold block">Customer Account</span>
                <span className="text-[11px] text-sky-700">Sign in to book faster</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal('login');
                }}
                className="px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Sign In / Register
              </button>
            </div>
          )}

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

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openProfileModal();
                }}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between text-left"
              >
                <span>Customer Profile Details</span>
                <UserCheck className="w-4 h-4 text-sky-600" />
              </button>
            )}

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
