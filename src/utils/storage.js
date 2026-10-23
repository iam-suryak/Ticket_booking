const BOOKINGS_KEY = 'wanderlust_travel_bookings_v1';
const WISHLIST_KEY = 'wanderlust_wishlist_v1';

// Seed demo booking if user opens for the very first time, so they see how neat it looks!
const initialDemoBooking = [
  {
    id: 'WL-782914',
    packageId: 'pkg-bali-luxury',
    packageTitle: 'Bali Tropical Paradise: Ubud Villas & Nusa Penida Cruise',
    destination: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    travelDate: '2026-11-15',
    adults: 2,
    children: 0,
    roomType: 'deluxe',
    roomTypeName: 'Deluxe Ocean View Villa (+$60/night)',
    addons: [
      { id: 'airport-pickup', name: 'Airport VIP Chauffeur Transfer', price: 45 },
      { id: 'insurance', name: 'Comprehensive Travel Insurance', price: 30 }
    ],
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@wanderlust.travel',
    customerPhone: '+1 (555) 349-8821',
    specialRequests: 'Celebrating wedding anniversary. King size bed requested.',
    basePricePerPerson: 1199,
    subtotal: 2398,
    addonsTotal: 75,
    roomUpgradeTotal: 360,
    taxAndFees: 141.65,
    discountAmount: 100,
    promoCode: 'WELCOME100',
    totalPrice: 2874.65,
    currency: 'USD',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
  }
];

export const getStoredBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(initialDemoBooking));
      return initialDemoBooking;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookings from localStorage:', e);
    return initialDemoBooking;
  }
};

export const saveBookingToStorage = (booking) => {
  try {
    const current = getStoredBookings();
    const updated = [booking, ...current];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save booking to localStorage:', e);
    return [];
  }
};

export const updateBookingStatusInStorage = (bookingId, newStatus) => {
  try {
    const current = getStoredBookings();
    const updated = current.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update booking status:', e);
    return [];
  }
};

export const deleteBookingFromStorage = (bookingId) => {
  try {
    const current = getStoredBookings();
    const updated = current.filter((b) => b.id !== bookingId);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete booking from storage:', e);
    return [];
  }
};

export const getStoredWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : ['pkg-bali-luxury', 'pkg-swiss-alps-express'];
  } catch (e) {
    return [];
  }
};

export const saveWishlistToStorage = (list) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
};
