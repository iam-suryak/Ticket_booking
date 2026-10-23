export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
};

export const formatPrice = (amountInUSD, currency = 'USD') => {
  const curr = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = Math.round(amountInUSD * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const generateBookingId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `WL-${randomNum}`;
};
