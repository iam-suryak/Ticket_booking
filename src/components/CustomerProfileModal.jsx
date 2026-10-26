import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  CalendarCheck,
  ShieldCheck,
  LogOut,
  Edit2,
  Check,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

export const CustomerProfileModal = () => {
  const { user, isProfileModalOpen, closeProfileModal, logout, updateCustomerDetails } = useAuth();
  const { bookings } = useBooking();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || ''
  });

  if (!isProfileModalOpen || !user) return null;

  const userBookings = bookings.filter(
    (b) => b.customerEmail?.toLowerCase() === user.email?.toLowerCase() || b.customerName?.toLowerCase() === user.name?.toLowerCase()
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateCustomerDetails(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    closeProfileModal();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 p-6 text-white relative shrink-0">
          <button
            onClick={closeProfileModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/50 shadow-md bg-white/10"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-400/30">
                  Verified Traveler
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {user.name}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span>Member since {user.joinedDate || '2024'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-sky-800 font-semibold block">Reservations</span>
                <span className="text-base font-extrabold text-sky-950">{userBookings.length} Trips</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-teal-800 font-semibold block">Account Status</span>
                <span className="text-base font-extrabold text-teal-950">Active</span>
              </div>
            </div>
          </div>

          {/* Profile Details Form / Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Customer Details</h4>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
                      city: user.city || '',
                      country: user.country || ''
                    });
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-sky-600 font-bold hover:text-sky-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-600">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Seattle"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-600">Country</label>
                    <input
                      type="text"
                      placeholder="e.g. United States"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Customer Name:</span>
                  </span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address:</span>
                  </span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Phone:</span>
                  </span>
                  <span className="font-bold text-slate-900">{user.phone || 'Not provided'}</span>
                </div>

                {(user.city || user.country) && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Location:</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {[user.city, user.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick link to My Bookings */}
          <Link
            to="/my-bookings"
            onClick={closeProfileModal}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>Go to My Itineraries & E-Tickets</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
              {userBookings.length}
            </span>
          </Link>

          {/* Logout Action */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Customer Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
