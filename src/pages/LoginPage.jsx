import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { user, login, signup, quickLogin, demoCustomers } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirect query or state passed
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(loginForm.email, loginForm.password);
      setLoading(false);
      if (!res.success) {
        setError(res.error);
      } else {
        navigate(redirectTo);
      }
    }, 300);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!registerForm.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!registerForm.email.trim() || !registerForm.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!registerForm.phone.trim() || registerForm.phone.trim().length < 8) {
      setError('Please provide a valid phone number (at least 8 digits).');
      return;
    }
    if (!registerForm.password || registerForm.password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signup(registerForm);
      setLoading(false);
      if (!res.success) {
        setError(res.error);
      } else {
        navigate(redirectTo);
      }
    }, 300);
  };

  const handleQuickDemo = (email) => {
    quickLogin(email);
    navigate(redirectTo);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/20">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Portal
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {activeTab === 'login'
              ? 'Sign in to access your customer details and confirm travel bookings'
              : 'Register your customer profile to book and view trips'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              
               Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Customer Sign Up
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Helper */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Quick 1-Click Demo Login
                </span>
                <span className="text-[11px] text-sky-700 font-medium">Ready-to-use</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demoCustomers.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickDemo(demo.email)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-left text-xs transition-all flex items-center gap-2 group cursor-pointer shadow-sm"
                  >
                    <img
                      src={demo.avatar}
                      alt={demo.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-sky-300"
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-800 block text-xs truncate group-hover:text-sky-700">
                        {demo.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">{demo.email}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="alex.morgan@wanderlust.travel"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-600">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name (as per Passport) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jessica Taylor"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="jessica@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 4 characters"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Wanderlust Home
          </Link>
        </div>
      </div>
    </div>
  );
};
