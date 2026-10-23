import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Check,
  X,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { packagesData } from '../data/packagesData';
import { RatingStars } from '../components/RatingStars';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatters';

export const PackageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist, currency } = useBooking();
  const { addToast } = useToast();

  const pkg = packagesData.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openItineraryDay, setOpenItineraryDay] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Package Not Found</h2>
        <p className="text-sm text-slate-500">
          The travel package you are looking for does not exist or may have been updated.
        </p>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destinations</span>
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(pkg.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        text: pkg.overview,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Trip link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/destinations" className="hover:text-slate-800 transition-colors">Destinations</Link>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-xs">{pkg.destination}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Share package"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleWishlist(pkg.id)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              wishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title & Header Details */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
            {pkg.category}
          </span>
          {pkg.badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {pkg.badge}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>{pkg.destination}, {pkg.country}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {pkg.title}
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <RatingStars rating={pkg.rating} count={pkg.reviewsCount} size="lg" />
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Wanderlust Tour
          </span>
        </div>
      </div>

      {/* Visual Image Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src={pkg.images[activeImageIndex]}
            alt={pkg.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-white text-xs font-medium bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl">
            Photo {activeImageIndex + 1} of {pkg.images.length}
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="grid grid-cols-4 gap-3">
          {pkg.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx
                  ? 'border-sky-600 shadow-md ring-2 ring-sky-200'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Details + Sticky Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Description, Itinerary, Inclusions, FAQs, Reviews */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Duration</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {pkg.durationDays}D / {pkg.durationNights}N
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Group Size</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {pkg.groupSize}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Activity</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {pkg.activityLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Guide</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {pkg.language.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Trip Overview</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {pkg.overview}
            </p>
          </section>

          {/* Trip Highlights */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Key Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Day-by-Day Itinerary Accordion */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Day-by-Day Itinerary</h2>
              <span className="text-xs text-slate-500">{pkg.itinerary.length} Total Days</span>
            </div>

            <div className="space-y-3">
              {pkg.itinerary.map((dayItem) => {
                const isOpen = openItineraryDay === dayItem.day;
                return (
                  <div
                    key={dayItem.day}
                    className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenItineraryDay(isOpen ? null : dayItem.day)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-extrabold shrink-0">
                          Day {dayItem.day}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {dayItem.title}
                        </h4>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-sm text-slate-600 space-y-3">
                        <p className="leading-relaxed text-xs sm:text-sm">
                          {dayItem.description}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-500">
                          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800">
                            🍴 {dayItem.meals}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800">
                            🏨 Stay: {dayItem.stay}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* What's Included vs Excluded */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">What's Included & Excluded</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Included in Package
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-600" />
                  Not Included
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Customer Reviews Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Traveler Reviews</h2>
                <p className="text-xs text-slate-500">Real feedback from verified travelers</p>
              </div>
              <RatingStars rating={pkg.rating} count={pkg.reviewsCount} size="md" />
            </div>

            <div className="space-y-3">
              {pkg.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.user}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{rev.user}</h4>
                        <span className="text-xs text-slate-600">{rev.date}</span>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} showCount={false} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          {pkg.faqs && pkg.faqs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-2.5">
                {pkg.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                          {faq.question}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right Col: Sticky Booking CTA Card */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium">Standard package from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(pkg.price, currency)}
                </span>
                {pkg.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(pkg.originalPrice, currency)}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">/ person</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant Confirmation & E-Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Free cancellation up to 14 days prior</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>All local taxes and hotel fees included</span>
              </div>
            </div>

            {/* Direct Book Now Button */}
            <Link
              to={`/book/${pkg.id}`}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold text-center text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-[11px] text-center text-slate-600">
              ⚡ Only 4 spots left at this exclusive rate for the upcoming season
            </p>
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-xs font-bold text-slate-800">Need personalized customization?</span>
            <p className="text-xs text-slate-500">
              Our travel specialists can tailor private itineraries and group sizes.
            </p>
            <span className="text-xs font-semibold text-sky-600 block pt-1">
              Call concierge: +1 (800) 555-ROAM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
