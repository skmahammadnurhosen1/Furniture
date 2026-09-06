import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign in popup was closed. Please try again.');
      } else {
        setError(err?.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in.');
      } else if (err?.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError(
          'Email/Password provider is not enabled in Firebase Console yet. Please use Google Sign-In or enable Email/Password in Firebase Console.'
        );
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setResetSuccess(
        `A password reset link has been sent to ${email.trim()}. Please check your email inbox and spam folder to reset your password.`
      );
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err?.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#FAF9F6] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* FORGOT PASSWORD VIEW */}
        {mode === 'forgot' ? (
          <div>
            <div className="pt-8 px-8 pb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl border border-amber-200 bg-amber-50 flex items-center justify-center text-[#C08251] shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-stone-900 font-semibold tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Enter your registered account email and we will send you secure password reset instructions.
              </p>
            </div>

            <div className="p-8 pt-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {resetSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold text-emerald-900 mb-0.5">
                        Instructions Sent
                      </strong>
                      <span>{resetSuccess}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                      setResetSuccess(null);
                    }}
                    className="w-full bg-stone-900 hover:bg-[#C08251] text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        id="forgot-email-input"
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 hover:bg-[#C08251] text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setError(null);
                        setResetSuccess(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* SIGN IN & SIGN UP VIEWS */
          <div>
            {/* Header */}
            <div className="pt-8 px-8 pb-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl border border-stone-300 bg-stone-100 flex items-center justify-center text-[#C08251]">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-stone-900 font-semibold tracking-tight">
                {mode === 'signin' ? 'Welcome Back to Furni' : 'Create an Account'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {mode === 'signin'
                  ? 'Sign in to access your saved pieces and orders'
                  : 'Join to track orders and personalize your shopping'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-stone-200 mx-8">
              <button
                id="tab-signin-btn"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'border-[#C08251] text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-signup-btn"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'border-[#C08251] text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 pt-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1-Click Google Login Button */}
              <button
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-800 text-sm font-medium py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                  or with email
                </span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        id="signup-name-input"
                        type="text"
                        required
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                          setResetSuccess(null);
                        }}
                        className="text-[11px] font-medium text-[#C08251] hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C08251] focus:border-[#C08251]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 hover:bg-[#C08251] text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2 disabled:opacity-60"
                >
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-[11px] text-stone-400 pt-2">
                By continuing, you agree to Furni's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

