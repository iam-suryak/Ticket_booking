import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  MapPin,
  Calendar,
  Users,
  Eye,
  XCircle,
  Trash2,
  Sparkles,
  ArrowRight,
  Luggage,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  LogOut,
  UserCheck,
  Lock
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';
import { formatDate, formatPrice } from '../utils/formatters';

export const MyBookingsPage = () => {
  const { bookings, cancelBooking, removeBooking, currency } = useBooking();
  const { user, isAuthenticated, logout, openAuthModal, openProfileModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [onlyMyBookings, setOnlyMyBookings] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Filter by customer if toggled
      if (onlyMyBookings && user) {
        const matchesEmail = b.customerEmail?.toLowerCase() === user.email?.toLowerCase();
        const matchesName = b.customerName?.toLowerCase() === user.name?.toLowerCase();
        const matchesId = b.customerId === user.id;
        if (!matchesEmail && !matchesName && !matchesId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'All' && b.status !== statusFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = b.packageTitle?.toLowerCase().includes(q);
        const matchDest = b.destination?.toLowerCase().includes(q);
        const matchCode = b.id?.toLowerCase().includes(q);
        const matchName = b.customerName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDest && !matchCode && !matchName) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, searchQuery, onlyMyBookings, user]);

  const handleConfirmCancel = () => {
    if (cancelModalBooking) {
      cancelBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-200">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Local Storage Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Travel Bookings
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manage your confirmed itineraries, view digital boarding passes, download e-tickets, and track your upcoming adventures.
          </p>
        </div>
      </div>

      {/* Customer Authentication & Profile Bar */}
      {isAuthenticated ? (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-11 h-11 rounded-xl object-cover border border-sky-300 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Logged In Customer
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyMyBookings(!onlyMyBookings)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                onlyMyBookings
                  ? 'bg-sky-50 border-sky-300 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {onlyMyBookings ? '✓ Filtered: My Account Only' : 'Filter by My Account'}
            </button>

            <button
              type="button"
              onClick={openProfileModal}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Customer Profile
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Customer Login Available</h4>
              <p className="text-xs text-slate-600">
                Sign in to view your personalized customer vouchers, or proceed as guest.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Sign In / Register</span>
          </button>
        </div>
      )}

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search inside bookings */}
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="search-bookings" className="sr-only">Search by destination, package, or reference code</label>
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-bookings"
            type="text"
            placeholder="Search booking ID, destination, or traveler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Confirmed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No Bookings Found
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {searchQuery || statusFilter !== 'All' || onlyMyBookings
              ? 'No reservations matched your search query or filter.'
              : "You haven't reserved any vacation packages yet. Discover your next dream getaway now!"}
          </p>

          <div className="pt-2 flex justify-center gap-3">
            {onlyMyBookings && (
              <button
                type="button"
                onClick={() => setOnlyMyBookings(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Show All Bookings
              </button>
            )}
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>Explore Top Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Image & Status Badge */}
              <div className="relative lg:w-72 h-48 lg:h-auto shrink-0 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.packageTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {b.status}
                  </span>
                </div>

                {/* Booking Code */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs">
                  {b.id}
                </div>
              </div>

              {/* Main Content Info */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-sky-600 font-bold uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{b.destination}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {b.packageTitle}
                  </h3>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">Departure</span>
                        <span className="font-bold text-slate-900">{formatDate(b.travelDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">Guests</span>
                        <span className="font-bold text-slate-900">
                          {b.adults} Adults {b.children > 0 && `, ${b.children} Kids`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">Room Plan</span>
                        <span className="font-bold text-slate-900 capitalize truncate">
                          {b.roomTypeName?.split('(')[0] || b.roomType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons & Traveler pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      Customer: <strong>{b.customerName}</strong>
                      {b.customerEmail && <span className="text-slate-400 font-normal"> ({b.customerEmail})</span>}
                    </span>
                    {b.addons?.map((addon, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {addon.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Price & Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Amount</span>
                    <span className="text-xl font-extrabold text-sky-600">
                      {formatPrice(b.totalPrice, b.currency || currency)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View E-Ticket */}
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View E-Ticket</span>
                    </button>

                    {/* Cancel Booking (only if confirmed) */}
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Delete completely */}
                    <button
                      onClick={() => removeBooking(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove record"
                      aria-label="Remove record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Cancel This Reservation?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-slate-800">{cancelModalBooking.id}</strong> for {cancelModalBooking.packageTitle}? Your cancellation policy allows a 100% refund.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
