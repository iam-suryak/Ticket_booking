import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Heart,
  Users,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { RatingStars } from './RatingStars';
import { useBooking } from '../context/BookingContext';
import { formatPrice } from '../utils/formatters';

export const PackageCard = ({ pkg, layout = 'grid' }) => {
  const { isWishlisted, toggleWishlist, currency } = useBooking();
  const wishlisted = isWishlisted(pkg.id);

  const badgeColorMap = {
    'Best Seller': 'bg-amber-500 text-white',
    'Trending': 'bg-sky-500 text-white',
    'Eco Certified': 'bg-emerald-600 text-white',
    'Romantic': 'bg-rose-500 text-white',
    'Flash Deal': 'bg-purple-600 text-white',
    'Popular': 'bg-indigo-600 text-white'
  };

  const badgeStyle = badgeColorMap[pkg.badge] || 'bg-slate-800 text-white';

  if (layout === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Thumbnail & Badges */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
          <img
            src={pkg.images[0]}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {pkg.badge && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${badgeStyle}`}>
                {pkg.badge}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(pkg.id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Duration Pill */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-sky-600 font-semibold text-xs tracking-wider uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{pkg.destination}, {pkg.country}</span>
              </div>
              <RatingStars rating={pkg.rating} count={pkg.reviewsCount} />
            </div>

            <Link
              to={`/package/${pkg.id}`}
              className="block group-hover:text-sky-600 transition-colors"
            >
              <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
                {pkg.title}
              </h3>
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
              {pkg.overview}
            </p>

            {/* Feature Pills */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                {pkg.groupSize}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {pkg.activityLevel} Activity
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-medium">
                {pkg.category}
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 block">From per person</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(pkg.price, currency)}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-slate-600 line-through">
                    {formatPrice(pkg.originalPrice, currency)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/package/${pkg.id}`}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors"
              >
                Details
              </Link>
              <Link
                to={`/book/${pkg.id}`}
                className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {pkg.badge && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${badgeStyle}`}>
              {pkg.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(pkg.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Duration & Category Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
          </div>

          <span className="bg-sky-500/90 backdrop-blur-md px-2 py-0.5 rounded-md font-medium text-[11px]">
            {pkg.category.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-sky-600 font-semibold text-xs tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{pkg.destination}, {pkg.country}</span>
            </div>
            <RatingStars rating={pkg.rating} count={pkg.reviewsCount} />
          </div>

          <Link
            to={`/package/${pkg.id}`}
            className="block group-hover:text-sky-600 transition-colors"
          >
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 min-h-[2.75rem]">
              {pkg.title}
            </h3>
          </Link>

          <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
            {pkg.overview}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 block">From per person</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(pkg.price, currency)}
              </span>
              {pkg.originalPrice && (
                <span className="text-xs text-slate-600 line-through">
                  {formatPrice(pkg.originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/package/${pkg.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors"
            >
              Details
            </Link>
            <Link
              to={`/book/${pkg.id}`}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
