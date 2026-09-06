import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
} from 'lucide-react';
import {
  submitAdminRequest,
  verifyAdminLogin,
  checkAdminStatus,
} from '../services/adminService';

interface AdminLoginPageProps {
  onBackToStore: () => void;
  onLoginSuccess: (adminEmail: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onBackToStore,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'request'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Request form state
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestPassword, setRequestPassword] = useState('');
  const [showRequestPassword, setShowRequestPassword] = useState(false);
  const [requestPhone, setRequestPhone] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  // Handle Admin Login with Email & Password
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await verifyAdminLogin(loginEmail.trim(), loginPassword.trim());

      if (result.success) {
        onLoginSuccess(loginEmail.trim());
      } else {
        setLoginError(
          result.message ||
            'Invalid administrator credentials. If you do not have an approved admin account, please apply under the Request Access tab.'
        );
      }
    } catch (err: any) {
      console.warn('Admin login error:', err);
      setLoginError(err.message || 'Authentication error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle New Admin Request Submission with Email & Password
  const handleAdminRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');

    if (!requestName.trim()) {
      setRequestError('Please enter your full name.');
      return;
    }
    if (!requestEmail.trim()) {
      setRequestError('Please enter a valid email address.');
      return;
    }
    if (requestPassword.length < 6) {
      setRequestError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmittingRequest(true);

    try {
      // 1. Check if an application already exists
      const existingStatus = await checkAdminStatus(requestEmail.trim());
      if (existingStatus.status === 'pending') {
        setRequestError(
          'An administrator request for this email is already pending review. Duplicate requests are not permitted while pending.'
        );
        setIsSubmittingRequest(false);
        return;
      }
      if (existingStatus.status === 'approved') {
        setRequestError(
          'This email is already approved as an administrator. Please proceed to the Admin Login tab to sign in with your email and password.'
        );
        setIsSubmittingRequest(false);
        return;
      }

      // 2. Submit request with hashed password
      await submitAdminRequest({
        fullName: requestName.trim(),
        email: requestEmail.trim(),
        password: requestPassword.trim(),
        phone: requestPhone.trim(),
        reason: requestReason.trim(),
      });

      setRequestSuccess(
        'Your administrator application has been submitted successfully! An active administrator will review your request. You will be able to log in with this email and password once approved.'
      );

      // Reset form
      setRequestName('');
      setRequestEmail('');
      setRequestPassword('');
      setRequestPhone('');
      setRequestReason('');
    } catch (err: any) {
      console.error('Admin request error:', err);
      setRequestError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between pt-12 pb-10 px-4 sm:px-6">
      {/* Top Bar Navigation */}
      <div className="max-w-md w-full mx-auto mb-4">
        <button
          id="admin-back-to-store-btn"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Storefront</span>
        </button>
      </div>

      {/* Main Admin Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {/* Brand & Security Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-stone-900 text-white flex items-center justify-center mb-3 shadow-xs">
            <Shield className="w-6 h-6 text-[#C08251]" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Dedicated Administrative Environment (Email & Password Only)
          </p>
        </div>

        {/* Tab Toggle: Admin Login vs Request Admin Access */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-semibold">
          <button
            id="tab-admin-login"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRequestError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>

          <button
            id="tab-admin-request"
            onClick={() => {
              setMode('request');
              setLoginError('');
              setRequestError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'request'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Request Access</span>
          </button>
        </div>

        {/* 1. ADMIN LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{loginError}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-admin-login-btn"
                disabled={isLoggingIn}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#C08251]" />
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. REQUEST ADMIN ACCESS FORM */}
        {mode === 'request' && (
          <form onSubmit={handleAdminRequest} className="space-y-3.5">
            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{requestError}</div>
              </div>
            )}

            {requestSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{requestSuccess}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Admin Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type={showRequestPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={requestPassword}
                  onChange={(e) => setRequestPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs pl-9 pr-10 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowRequestPassword(!showRequestPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showRequestPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={requestPhone}
                  onChange={(e) => setRequestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Application Note / Department
              </label>
              <textarea
                rows={2}
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Reason for requesting administrator access (e.g. Catalog manager, Support lead)..."
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-admin-request-btn"
                disabled={isSubmittingRequest}
                className="w-full bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>
                  {isSubmittingRequest ? 'Submitting Application...' : 'Submit Admin Application'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Subtle Footer Note */}
      <div className="max-w-md w-full mx-auto text-center mt-6">
        <p className="text-[11px] text-stone-400">
          Administrator access requires approval • Separate from customer accounts
        </p>
      </div>
    </div>
  );
};
