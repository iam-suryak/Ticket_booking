import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredBookings,
  saveBookingToStorage,
  updateBookingStatusInStorage,
  deleteBookingFromStorage,
  getStoredWishlist,
  saveWishlistToStorage
} from '../utils/storage';
import { useToast } from './ToastContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Initial fetch from localStorage
    const savedBookings = getStoredBookings();
    setBookings(savedBookings);

    const savedWishlist = getStoredWishlist();
    setWishlist(savedWishlist);

    const savedCurr = localStorage.getItem('wanderlust_currency');
    if (savedCurr) setCurrency(savedCurr);

    setIsLoaded(true);
  }, []);

  const handleSetCurrency = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('wanderlust_currency', newCurr);
    addToast(`Currency switched to ${newCurr}`, 'info');
  };

  const createBooking = (bookingData) => {
    const updated = saveBookingToStorage(bookingData);
    setBookings(updated);
    addToast('Booking confirmed successfully! Your tickets are ready in My Bookings.', 'success', 5000);
    return bookingData;
  };

  const cancelBooking = (bookingId) => {
    const updated = updateBookingStatusInStorage(bookingId, 'Cancelled');
    setBookings(updated);
    addToast('Booking has been cancelled.', 'warning');
  };

  const removeBooking = (bookingId) => {
    const updated = deleteBookingFromStorage(bookingId);
    setBookings(updated);
    addToast('Booking record removed.', 'info');
  };

  const toggleWishlist = (packageId) => {
    setWishlist((prev) => {
      const exists = prev.includes(packageId);
      const updated = exists
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId];
      saveWishlistToStorage(updated);
      if (exists) {
        addToast('Removed from saved wishlist', 'info', 2000);
      } else {
        addToast('Added to your travel wishlist!', 'success', 2500);
      }
      return updated;
    });
  };

  const isWishlisted = (packageId) => wishlist.includes(packageId);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoaded,
        createBooking,
        cancelBooking,
        removeBooking,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currency,
        setCurrency: handleSetCurrency
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
