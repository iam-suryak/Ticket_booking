import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Luggage,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  Check,
  ArrowRight,
  Clock,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { packagesData } from '../data/packagesData';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, generateBookingId } from '../utils/formatters';

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createBooking, currency } = useBooking();
  const { addToast } = useToast();

  const pkg = packagesData.find((p) => p.id === id) || packagesData[0];

  // Minimum date: tomorrow
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    adults: 2,
    children: 0,
    roomType: 'deluxe',
    specialRequests: '',
    promoCodeInput: ''
  });

  // Selected add-ons
  const [selectedAddons, setSelectedAddons] = useState(['airport-transfer']);

  // Applied discount
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'WANDER10', type: 'percent', value: 10 }

  // Form errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Available room types
  const roomTypes = [
    { id: 'standard', name: 'Standard Deluxe Room', extraPerNight: 0, desc: 'Comfortable king bed with city or courtyard view' },
    { id: 'deluxe', name: 'Deluxe Ocean / Alpine Panorama', extraPerNight: 50, desc: 'Higher floor with scenic private balcony' },
    { id: 'presidential', name: 'Presidential Luxury Suite', extraPerNight: 120, desc: 'Expansive private terrace, jacuzzi, and complimentary minibar' }
  ];

  // Available add-ons
  const availableAddons = [
    { id: 'airport-transfer', name: 'VIP Airport Chauffeur Transfer', price: 45, perPerson: false, desc: 'Round-trip private luxury sedan directly to hotel' },
    { id: 'insurance', name: 'Comprehensive Travel & Medical Cover', price: 35, perPerson: true, desc: 'Medical emergencies, trip cancellation, and lost luggage cover' },
    { id: 'excursions', name: 'VIP Guided Excursions Pass', price: 65, perPerson: true, desc: 'Priority skip-the-line entrance tickets with expert local guide' },
    { id: 'meal-plan', name: 'Full Gourmet Meal Plan', price: 110, perPerson: true, desc: 'All daily 3-course dinners and lunches at top-rated restaurants' }
  ];

  // Toggle add-on
  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((i) => i !== addonId) : [...prev, addonId]
    );
  };

  // Promo Code Validation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = formData.promoCodeInput.trim().toUpperCase();
    if (!code) {
      addToast('Please enter a promo code.', 'warning');
      return;
    }

    if (code === 'WANDER10') {
      setAppliedPromo({ code: 'WANDER10', type: 'percent', value: 10 });
      addToast('Promo code applied: 10% discount!', 'success');
    } else if (code === 'SUMMER50') {
      setAppliedPromo({ code: 'SUMMER50', type: 'fixed', value: 50 });
      addToast('Promo code applied: $50 discount!', 'success');
    } else if (code === 'WELCOME100') {
      setAppliedPromo({ code: 'WELCOME100', type: 'fixed', value: 100 });
      addToast('Promo code applied: $100 welcome bonus!', 'success');
    } else {
      addToast('Invalid promo code. Try "WANDER10" or "WELCOME100"', 'error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setFormData((prev) => ({ ...prev, promoCodeInput: '' }));
    addToast('Promo code removed', 'info');
  };

  // Calculations
  const calculations = useMemo(() => {
    const basePerAdult = pkg.price;
    const basePerChild = Math.round(pkg.price * 0.5); // 50% child fare

    const adultsTotal = formData.adults * basePerAdult;
    const childrenTotal = formData.children * basePerChild;
    const baseFareTotal = adultsTotal + childrenTotal;

    // Room tier surcharge (multiplied by package nights)
    const selectedRoom = roomTypes.find((r) => r.id === formData.roomType) || roomTypes[0];
    const roomUpgradeTotal = selectedRoom.extraPerNight * pkg.durationNights;

    // Addons calculation
    const totalTravelers = formData.adults + formData.children;
    let addonsTotal = 0;
    const activeAddonsList = [];

    availableAddons.forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        const cost = addon.perPerson ? addon.price * totalTravelers : addon.price;
        addonsTotal += cost;
        activeAddonsList.push({
          id: addon.id,
          name: addon.name,
          price: cost
        });
      }
    });

    const subtotal = baseFareTotal + roomUpgradeTotal + addonsTotal;
    const taxAndFees = Math.round(subtotal * 0.05); // 5% government tourism fee and local tax

    // Discount
    let discountAmount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
      } else if (appliedPromo.type === 'fixed') {
        discountAmount = appliedPromo.value;
      }
    }

    const grandTotal = Math.max(0, subtotal + taxAndFees - discountAmount);

    return {
      adultsTotal,
      childrenTotal,
      baseFareTotal,
      selectedRoom,
      roomUpgradeTotal,
      activeAddonsList,
      addonsTotal,
      subtotal,
      taxAndFees,
      discountAmount,
      grandTotal
    };
  }, [pkg, formData, selectedAddons, appliedPromo]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[+0-9\s()-]{8,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number (min 8 digits).';
    }

    if (!formData.travelDate) {
      newErrors.travelDate = 'Please select a departure travel date.';
    } else {
      const selected = new Date(formData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        newErrors.travelDate = 'Departure date must be in the future.';
      }
    }

    if (formData.adults < 1) {
      newErrors.adults = 'At least 1 adult traveler is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please correct the highlighted errors in the form.', 'error');
      // Scroll to the first error
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const bookingRecord = {
        id: generateBookingId(),
        packageId: pkg.id,
        packageTitle: pkg.title,
        destination: `${pkg.destination}, ${pkg.country}`,
        image: pkg.images[0],
        travelDate: formData.travelDate,
        adults: formData.adults,
        children: formData.children,
        roomType: formData.roomType,
        roomTypeName: calculations.selectedRoom.name,
        addons: calculations.activeAddonsList,
        customerName: formData.fullName.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        specialRequests: formData.specialRequests.trim(),
        basePricePerPerson: pkg.price,
        subtotal: calculations.subtotal,
        addonsTotal: calculations.addonsTotal,
        roomUpgradeTotal: calculations.roomUpgradeTotal,
        taxAndFees: calculations.taxAndFees,
        discountAmount: calculations.discountAmount,
        promoCode: appliedPromo ? appliedPromo.code : null,
        totalPrice: calculations.grandTotal,
        currency: currency,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      createBooking(bookingRecord);
      setConfirmedBooking(bookingRecord);
      setIsSubmitting(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }, 600);
  };

  // If booking is already confirmed, show confirmation view
  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Booking Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              You're Ready for Adventure!
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your vacation voucher has been created and saved in your browser's LocalStorage.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-500 block">Booking Reference</span>
                <span className="text-lg font-mono font-bold text-slate-900">
                  {confirmedBooking.id}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                {confirmedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Package:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.packageTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Departure Date:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.travelDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Traveler:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Paid:</span>
                <span className="font-extrabold text-sky-600 text-sm">
                  {formatPrice(confirmedBooking.totalPrice, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/my-bookings"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>View in My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Confirmation</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header and Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/package/${pkg.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Package Details</span>
        </Link>
        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Secure Checkout</span>
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Travel Reservation
        </h1>
        <p className="text-sm text-slate-500">
          Customize your package options and enter guest information for instant confirmation.
        </p>
      </div>

      {/* Main Grid: Form + Summary Sidebar */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Package preview card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={pkg.images[0]}
              alt={pkg.title}
              className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0 border border-slate-200"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-sky-600 font-bold uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{pkg.destination}, {pkg.country}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {pkg.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(pkg.price, currency)} / person
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Trip Configuration (Dates, Guests, Room) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Trip Dates & Travelers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Departure Date */}
              <div className="space-y-1.5">
                <label htmlFor="travelDate" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Departure Date *
                </label>
                <div className="relative">
                  <input
                    id="travelDate"
                    type="date"
                    min={minDate}
                    value={formData.travelDate}
                    onChange={(e) => {
                      setFormData({ ...formData, travelDate: e.target.value });
                      if (errors.travelDate) setErrors({ ...errors, travelDate: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.travelDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                    }`}
                  />
                </div>
                {errors.travelDate && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.travelDate}
                  </p>
                )}
              </div>

              {/* Adults */}
              <div className="space-y-1.5">
                <label htmlFor="adults" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Adults (12+ yrs) *
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-l-xl text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    id="adults"
                    type="number"
                    min="1"
                    max="15"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full text-center py-2.5 border-y border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-r-xl text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="space-y-1.5">
                <label htmlFor="children" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Children (2-11 yrs) - 50% Off
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-l-xl text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    id="children"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full text-center py-2.5 border-y border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-r-xl text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Room Tier Selection */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Accommodation Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roomTypes.map((tier) => {
                  const isSelected = formData.roomType === tier.id;
                  return (
                    <label
                      key={tier.id}
                      className={`relative p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="roomType"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, roomType: tier.id })}
                        className="sr-only"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {tier.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {tier.desc}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-extrabold text-sky-700">
                        {tier.extraPerNight === 0
                          ? 'Included'
                          : `+${formatPrice(tier.extraPerNight, currency)} / night`}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Optional Experience Add-ons */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Enhance Your Experience (Optional Add-ons)</span>
            </h3>

            <div className="space-y-2.5">
              {availableAddons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start justify-between gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          {addon.name}
                        </span>
                        <p className="text-[11px] text-slate-500">{addon.desc}</p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-teal-700 shrink-0">
                      +{formatPrice(addon.price, currency)}
                      {addon.perPerson && ' / person'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 4: Lead Traveler Contact Details with Live Validation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Lead Traveler Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name (as per Passport/ID) *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="alex.morgan@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone / Mobile Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="specialRequests" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Special Requests / Dietary Requirements (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  rows="3"
                  placeholder="e.g., Honeymoon bed decoration, vegetarian meals, airport wheelchair assistance..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real-Time Total Price Breakdown & Checkout */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Price Summary
            </h3>

            {/* Price items */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Adults Base ({formData.adults} × {formatPrice(pkg.price, currency)})</span>
                <span className="font-semibold text-slate-900">{formatPrice(calculations.adultsTotal, currency)}</span>
              </div>

              {formData.children > 0 && (
                <div className="flex justify-between">
                  <span>Children ({formData.children} × {formatPrice(Math.round(pkg.price * 0.5), currency)})</span>
                  <span className="font-semibold text-slate-900">{formatPrice(calculations.childrenTotal, currency)}</span>
                </div>
              )}

              {calculations.roomUpgradeTotal > 0 && (
                <div className="flex justify-between">
                  <span>Room Upgrade ({pkg.durationNights} nights)</span>
                  <span className="font-semibold text-slate-900">+{formatPrice(calculations.roomUpgradeTotal, currency)}</span>
                </div>
              )}

              {calculations.addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-ons ({calculations.activeAddonsList.length} selected)</span>
                  <span className="font-semibold text-slate-900">+{formatPrice(calculations.addonsTotal, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxes & Service Fees (5%)</span>
                <span className="font-semibold text-slate-900">+{formatPrice(calculations.taxAndFees, currency)}</span>
              </div>

              {calculations.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-{formatPrice(calculations.discountAmount, currency)}</span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-slate-100">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon "{appliedPromo.code}" Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <label htmlFor="promo-code" className="sr-only">Promo Code</label>
                    <input
                      id="promo-code"
                      type="text"
                      placeholder="Promo Code (e.g. WANDER10)"
                      value={formData.promoCodeInput}
                      onChange={(e) => setFormData({ ...formData, promoCodeInput: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-semibold uppercase rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              <span className="text-[11px] text-slate-600 block mt-1.5">
                💡 Tip: Use <strong className="text-sky-600">WANDER10</strong> for 10% off
              </span>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold block uppercase">Total Amount</span>
                <span className="text-[11px] text-slate-600">All fees & taxes included</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-600">
                {formatPrice(calculations.grandTotal, currency)}
              </span>
            </div>

            {/* Confirm & Book Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold text-center text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Confirm & Save Booking</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-600 text-center space-y-1">
              <p>🔒 No advance card charge required for demo testing.</p>
              <p>Your itinerary will be immediately registered in My Bookings.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
