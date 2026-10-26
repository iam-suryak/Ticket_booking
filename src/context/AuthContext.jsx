import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ACTIVE_CUSTOMER_KEY = 'wanderlust_active_customer_v1';
const REGISTERED_CUSTOMERS_KEY = 'wanderlust_customers_db_v1';

// Initial demo customer database for instant testing
const INITIAL_CUSTOMERS = [
  {
    id: 'cust-alex-morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@wanderlust.travel',
    phone: '+1 (555) 349-8821',
    password: 'password123',
    country: 'United States',
    city: 'San Francisco',
    joinedDate: 'October 2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    passportNumber: 'US98234190'
  },
  {
    id: 'cust-sophia-chen',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    phone: '+1 (555) 892-4410',
    password: 'password123',
    country: 'Canada',
    city: 'Vancouver',
    joinedDate: 'January 2025',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    passportNumber: 'CA44910283'
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load active session and customer database from localStorage
  useEffect(() => {
    try {
      // 1. Load or initialize registered customers
      const storedUsersRaw = localStorage.getItem(REGISTERED_CUSTOMERS_KEY);
      let loadedUsers = INITIAL_CUSTOMERS;
      if (storedUsersRaw) {
        try {
          loadedUsers = JSON.parse(storedUsersRaw);
          if (!Array.isArray(loadedUsers) || loadedUsers.length === 0) {
            loadedUsers = INITIAL_CUSTOMERS;
            localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
          }
        } catch (e) {
          loadedUsers = INITIAL_CUSTOMERS;
          localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
        }
      } else {
        localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      }
      setRegisteredUsers(loadedUsers);

      // 2. Load active logged-in customer session
      const storedActiveUser = localStorage.getItem(ACTIVE_CUSTOMER_KEY);
      if (storedActiveUser) {
        try {
          const parsed = JSON.parse(storedActiveUser);
          setUser(parsed);
        } catch (e) {
          localStorage.removeItem(ACTIVE_CUSTOMER_KEY);
        }
      }
    } catch (err) {
      console.error('Failed to initialize customer auth:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save registered users list to localStorage
  const persistRegisteredUsers = (usersList) => {
    setRegisteredUsers(usersList);
    try {
      localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to persist registered users:', e);
    }
  };

  // Login handler
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!existingUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (existingUser.password !== cleanPass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Success: Set active customer
    const sessionUser = { ...existingUser };
    delete sessionUser.password;

    setUser(sessionUser);
    localStorage.setItem(ACTIVE_CUSTOMER_KEY, JSON.stringify(sessionUser));

    addToast(`Welcome back, ${sessionUser.name}!`, 'success', 3500);

    if (authSuccessCallback) {
      authSuccessCallback(sessionUser);
      setAuthSuccessCallback(null);
    }

    setIsAuthModalOpen(false);
    return { success: true, user: sessionUser };
  };

  // Register / Sign up handler
  const signup = ({ name, email, phone, password }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter a valid full name.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, error: 'Please provide a valid phone number.' };
    }

    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    // Check if email already registered
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return {
        success: false,
        error: 'An account with this email already exists. Please log in.'
      };
    }

    // Generate new customer object
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPass,
      country: 'Global Traveler',
      city: '',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`
    };

    const updatedList = [...registeredUsers, newCustomer];
    persistRegisteredUsers(updatedList);

    const sessionUser = { ...newCustomer };
    delete sessionUser.password;

    setUser(sessionUser);
    localStorage.setItem(ACTIVE_CUSTOMER_KEY, JSON.stringify(sessionUser));

    addToast(`Account created! Welcome to Wanderlust, ${sessionUser.name}.`, 'success', 4000);

    if (authSuccessCallback) {
      authSuccessCallback(sessionUser);
      setAuthSuccessCallback(null);
    }

    setIsAuthModalOpen(false);
    return { success: true, user: sessionUser };
  };

  // Quick 1-click login for demo purposes
  const quickLogin = (emailOrId) => {
    const target = registeredUsers.find(
      (u) => u.email.toLowerCase() === emailOrId.toLowerCase() || u.id === emailOrId
    );

    if (target) {
      const sessionUser = { ...target };
      delete sessionUser.password;
      setUser(sessionUser);
      localStorage.setItem(ACTIVE_CUSTOMER_KEY, JSON.stringify(sessionUser));
      addToast(`Logged in as ${sessionUser.name} (${sessionUser.email})`, 'success', 3500);

      if (authSuccessCallback) {
        authSuccessCallback(sessionUser);
        setAuthSuccessCallback(null);
      }
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  // Logout handler
  const logout = () => {
    const name = user?.name || 'Customer';
    setUser(null);
    localStorage.removeItem(ACTIVE_CUSTOMER_KEY);
    setIsProfileModalOpen(false);
    addToast(`${name} has been logged out successfully.`, 'info', 3000);
  };

  // Update customer profile details
  const updateCustomerDetails = ({ name, phone, email, city, country }) => {
    if (!user) return { success: false, error: 'No active session.' };

    const updatedUser = {
      ...user,
      name: name?.trim() || user.name,
      phone: phone?.trim() || user.phone,
      email: email?.trim() || user.email,
      city: city !== undefined ? city.trim() : user.city,
      country: country !== undefined ? country.trim() : user.country
    };

    setUser(updatedUser);
    localStorage.setItem(ACTIVE_CUSTOMER_KEY, JSON.stringify(updatedUser));

    // Also update in registeredUsers database
    const updatedList = registeredUsers.map((u) =>
      u.id === user.id ? { ...u, ...updatedUser } : u
    );
    persistRegisteredUsers(updatedList);

    addToast('Customer profile details updated!', 'success');
    return { success: true, user: updatedUser };
  };

  // Modal open/close helpers
  const openAuthModal = (tab = 'login', callback = null) => {
    setAuthModalTab(tab);
    setAuthSuccessCallback(() => callback);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        registeredUsers,
        login,
        signup,
        quickLogin,
        logout,
        updateCustomerDetails,
        // Modal state & controls
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        demoCustomers: INITIAL_CUSTOMERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
