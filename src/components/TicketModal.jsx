import React from 'react';
import {
  X,
  Printer,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Luggage,
  Sparkles,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { formatDate, formatPrice } from '../utils/formatters';

export const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-sky-100">
                Official E-Ticket & Itinerary
              </span>
              <h3 className="text-xl font-bold">Wanderlust Travel Pass</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Ticket Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Status & Code Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Booking Reference ID
              </span>
              <span className="text-xl font-mono font-bold tracking-wider text-slate-900">
                {booking.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 block">Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {booking.status}
              </span>
            </div>
          </div>

          {/* Package details */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={booking.image}
              alt={booking.packageTitle}
              className="w-full sm:w-44 h-32 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-sm"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-sky-600 font-bold uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{booking.destination}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">
                {booking.packageTitle}
              </h4>
              <p className="text-xs text-slate-500">
                Booked on: {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Passenger & Trip Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-100 py-5">
            <div>
              <span className="text-xs text-slate-500 block">Primary Traveler</span>
              <span className="font-bold text-slate-900 text-sm">{booking.customerName}</span>
              <span className="text-xs text-slate-600 block">{booking.customerEmail}</span>
              <span className="text-xs text-slate-600 block">{booking.customerPhone}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Departure Date</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span className="font-bold text-slate-900 text-sm">
                  {formatDate(booking.travelDate)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Guests</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-900 text-sm">
                  {booking.adults} {booking.adults === 1 ? 'Adult' : 'Adults'}
                  {booking.children > 0 && `, ${booking.children} ${booking.children === 1 ? 'Child' : 'Children'}`}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Accommodation Tier</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Luggage className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-900 text-sm capitalize">
                  {booking.roomTypeName || booking.roomType}
                </span>
              </div>
            </div>
          </div>

          {/* Add-ons list if any */}
          {booking.addons && booking.addons.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Selected Package Add-ons
              </h5>
              <div className="flex flex-wrap gap-2">
                {booking.addons.map((add, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {add.name} (+${add.price})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
              <span className="font-bold block mb-0.5">Special Requests & Notes:</span>
              <span>{booking.specialRequests}</span>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Fare ({booking.adults} Adults × ${booking.basePricePerPerson})</span>
              <span>${booking.subtotal?.toLocaleString()}</span>
            </div>
            {booking.roomUpgradeTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Room Upgrade Tier</span>
                <span>+${booking.roomUpgradeTotal}</span>
              </div>
            )}
            {booking.addonsTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Services & Add-ons</span>
                <span>+${booking.addonsTotal}</span>
              </div>
            )}
            {booking.taxAndFees > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Tourism Fees</span>
                <span>+${booking.taxAndFees}</span>
              </div>
            )}
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount ({booking.promoCode})</span>
                <span>-${booking.discountAmount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
              <span>Grand Total Amount</span>
              <span className="text-xl text-sky-600 font-extrabold">
                {formatPrice(booking.totalPrice, booking.currency || 'USD')}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
