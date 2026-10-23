# ✈️ Wanderlust - Modern React Travel Booking Application

A high-performance, modern Travel Booking web portal built with **React JS**, **React Router DOM**, and **Tailwind CSS**. Features interactive destination discovery, package details with day-by-day itineraries, dynamic price calculations with validation, localStorage persistence for reservations, and full responsiveness across all screen sizes.

---

## 🌟 Key Features

### 1. 🏠 Home Page
- **Hero Exploration Header**: Inspiring visual banner with quick travel search widget (Destination, Trip Type, Travelers).
- **Travel Category Pills**: One-click browsing for Beach & Relaxation, Mountain Adventure, Cultural Heritage, Luxury Romantic, Wildlife & Safari, and City & Culture.
- **Popular Destinations Showcase**: Interactive destination cards showing traveler ratings, package counts, country tags, and direct filter links.
- **Featured Travel Packages Grid**: Top-rated vacation packages with pricing, duration, review scores, and direct booking links.
- **Promotional Discounts**: Seasonal discount callout highlighting coupon code `WANDER10`.
- **Trust & Value Cards**: Highlighted security guarantees (Verified Stays, Best Price Guarantee, Small Group departures).

### 2. 🗺️ Destinations & Package Directory with Real-time Filters
- **Instant Search**: Live search across package titles, destination names, countries, categories, and keywords.
- **Multi-faceted Filtering**:
  - **Category**: Filter by Beach, Mountain, Heritage, Romance, Safari, or City.
  - **Continent / Region**: Asia, Europe, Americas, Africa.
  - **Max Budget Range**: Interactive price range slider with dynamic currency conversion.
  - **Duration**: Filter by short trips (1-5 days), standard weeks (6-7 days), or extended tours (8+ days).
  - **Rating**: Filter by minimum 4.8★ or 4.9★ traveler reviews.
  - **Wishlist Filter**: Quick view of saved favorite trips.
- **Sorting Options**: Recommended, Price (Low to High / High to Low), Duration, and Highest Rated.
- **View Toggle**: Switch seamlessly between Grid View and List View.
- **Active Filter Pills & Reset**: Single-click clear for individual filter tags or complete reset.

### 3. 📖 Travel Package Details Page (`/package/:id`)
- **Interactive Photo Gallery**: High-resolution gallery with thumbnail switcher.
- **Trip Specs Ribbon**: Duration, group size limit, guide language, and activity level.
- **Trip Highlights Checklist**: Curated list of unique experiences included in the journey.
- **Expandable Day-by-Day Itinerary**: Daily schedule breakdown detailing activities, included meals, and accommodation stays.
- **Included vs. Excluded Breakdown**: Clear side-by-side comparison with checkmarks and icons.
- **Verified Traveler Reviews**: Review scores, comments, reviewer avatars, and dates.
- **FAQ Accordion**: Common questions and answers regarding visas, cancellations, and transfers.
- **Sticky Booking CTA Bar**: Price per person, key perks, and direct link to the booking checkout.

### 4. 📝 Booking Form with Validation & Dynamic Price Calculation (`/book/:id`)
- **Package Preview**: Thumbnail, location, and base price summary.
- **Trip Configuration**:
  - Departure Date picker (validated to disallow past dates).
  - Adults selector (minimum 1 required).
  - Children selector (discounted at 50% base fare).
  - Accommodation Tier selector (Standard Room included, Deluxe +$50/night, Presidential Suite +$120/night).
- **Optional Add-ons with Dynamic Pricing**:
  - VIP Airport Chauffeur Transfer (+$45)
  - Comprehensive Travel & Medical Insurance (+$35/person)
  - VIP Guided Excursions Pass (+$65/person)
  - Full Gourmet Meal Plan (+$110/person)
- **Lead Traveler Contact Info with Validation**:
  - Full Name (required, min 3 chars).
  - Email Address (validated with standard regex pattern).
  - Phone Number (validated phone format).
  - Special Requests / Dietary Requirements.
- **Real-Time Price Calculation Engine**:
  - Base fares + room tier surcharge + add-ons total + 5% taxes & fees.
  - Interactive Promo Codes (`WANDER10` for 10% off, `SUMMER50` for $50 off, `WELCOME100` for $100 off).
  - Live Grand Total updates immediately upon any change.
- **Booking Confirmation**:
  - Generates unique reference code (`WL-XXXXXX`).
  - Confetti celebration animation.
  - Saves reservation directly into `localStorage`.
  - Instant receipt with options to view in My Bookings or print confirmation.

### 5. 🧳 My Bookings Page (`/my-bookings`)
- **LocalStorage Data Persistence**: Bookings persist across browser sessions.
- **Search within Bookings**: Find reservations by reference ID, destination, or traveler name.
- **Status Filter**: View All, Confirmed, or Cancelled bookings.
- **E-Ticket / Travel Voucher Modal**: Detailed printable e-ticket view with itinerary, pricing breakdown, and print action.
- **Cancel Booking Flow**: Cancel reservations with confirmation safety modal.
- **Delete Record**: Completely remove unwanted reservations.

### 6. 📱 Responsive Design & Global Enhancements
- Mobile drawer navigation with hamburger menu.
- **Multi-Currency Support**: Switch between USD ($), EUR (€), GBP (£), and INR (₹) with real-time rate conversion.
- **Travel Wishlist**: Save favorite packages to localStorage.
- **Toast Notifications**: Clean feedback toasts for all user actions.

---

## 🛠️ Tech Stack

- **React 19** (Functional Components, React Hooks)
- **Vite 8** (Lightning fast bundling and Hot Module Replacement)
- **React Router DOM v7** (Client-side routing)
- **Tailwind CSS v4** (Modern utility-first styling)
- **Lucide React** (Clean SVG icons)
- **Canvas Confetti** (Delightful celebration animation)
- **LocalStorage API** (Client-side data persistence)

---

## 🚀 Running the Project Locally

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to the local URL displayed in the terminal (typically `http://localhost:5173`).

4. **Build for production**:
   ```bash
   npm run build
   ```
