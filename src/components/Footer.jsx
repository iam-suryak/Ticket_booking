import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Mail,
  ShieldCheck,
  Headphones,
  Award,
  RefreshCw,
  Send,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thank you for subscribing! Check your inbox for exclusive travel deals.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Verified Escapes</h4>
              <p className="text-xs text-slate-400">100% vetted hotels & guides</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Best Price Guarantee</h4>
              <p className="text-xs text-slate-400">Direct rates without hidden fees</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Flexible Cancellations</h4>
              <p className="text-xs text-slate-400">Plans change, stress-free refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">24/7 Global Support</h4>
              <p className="text-xs text-slate-400">Dedicated local trip experts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Wanderlust
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover and book world-class travel adventures, curated luxury escapes, and unforgettable cultural journeys designed by local specialists.
            </p>
            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter email for secret deals"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-sky-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Beach+%26+Relaxation" className="hover:text-sky-400 transition-colors">
                  Beach Vacations
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Mountain+Adventure" className="hover:text-sky-400 transition-colors">
                  Mountain Expeditions
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Cultural+Heritage" className="hover:text-sky-400 transition-colors">
                  Cultural Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Spots */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Popular Spots
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations?search=Kashmir" className="hover:text-sky-400 transition-colors font-medium text-amber-300">
                  🏔️ Kashmir, India
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Bali" className="hover:text-sky-400 transition-colors">
                  Bali, Indonesia
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Swiss" className="hover:text-sky-400 transition-colors">
                  Swiss Alps
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Kyoto" className="hover:text-sky-400 transition-colors">
                  Kyoto, Japan
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Santorini" className="hover:text-sky-400 transition-colors">
                  Santorini, Greece
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Amalfi" className="hover:text-sky-400 transition-colors">
                  Amalfi Coast
                </Link>
              </li>
            </ul>
          </div>

          {/* Manage & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Bookings & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/my-bookings" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  <span>My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <span className="text-slate-500">24/7 Helpline: +1 (800) 555-ROAM</span>
              </li>
              <li>
                <span className="text-slate-500">concierge@wanderlust.travel</span>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Data saved securely in your browser's LocalStorage.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Wanderlust Travel Inc. All rights reserved.</p>
        <p className="flex items-center gap-1 justify-center">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for globetrotters worldwide
        </p>
      </div>
    </footer>
  );
};
