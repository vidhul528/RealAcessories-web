'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/Api/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  // Mode: 'phone' | 'email'
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('email');

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const toggleMode = () => {
    setLoginMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const identifier = loginMode === 'phone' ? formData.phone.trim() : formData.email.trim();

    if (!identifier) {
      const msg = loginMode === 'phone' ? 'Please enter your 10-digit mobile number.' : 'Please enter your email address.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (loginMode === 'phone') {
      const cleanPhone = identifier.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        const msg = 'Please enter a valid 10-digit mobile number.';
        setError(msg);
        showToast(msg, 'error');
        return;
      }
    }

    if (!formData.password) {
      const msg = 'Please enter your password.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({
        email: loginMode === 'email' ? identifier : undefined,
        phone: loginMode === 'phone' ? identifier : undefined,
        password: formData.password,
      });

      if (response.success && response.data) {
        const { token, user, message } = response.data;
        login(token || response.data.accessToken || 'mock_token', user || { name: 'User', email: identifier });
        showToast(message || 'Login successful! Welcome back.', 'success');
        router.push('/');
      } else {
        const errMsg = response.message || 'Invalid credentials. Please check your information and try again.';
        setError(errMsg);
        showToast(errMsg, 'error');
      }
    } catch (err: any) {
      const errMsg = 'An unexpected error occurred. Please try again.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between flex-1 space-y-6">
        <div>
          {/* Header Title (Flipkart Style) */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Log in for the best experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Enter your {loginMode === 'phone' ? 'phone number' : 'email address'} to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Outlined Input Box (Flipkart Style with Legend Notch) */}
            <div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all">
                  {loginMode === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>

                <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm">
                  {loginMode === 'phone' ? (
                    <>
                      <div className="flex items-center gap-1 text-[#581C38] font-bold text-sm sm:text-base border-r border-gray-300 pr-2.5 mr-2.5 shrink-0 select-none">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        className="w-full text-base sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent tracking-wide"
                      />
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 text-[#581C38]/60 mr-2.5 shrink-0" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                        className="w-full text-base sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Highlighted Mode Toggle Button */}
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[11px] font-bold text-[#8C254F] bg-[#FCEEF3] hover:bg-[#F8E3E8] transition-all cursor-pointer py-1 px-2.5 rounded-full active:scale-95 touch-manipulation pointer-events-auto z-20 flex items-center gap-1"
                >
                  {loginMode === 'phone' ? (
                    <>
                      <Mail className="w-3 h-3 text-[#8C254F]" />
                      <span>Use Email-ID</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3 h-3 text-[#8C254F]" />
                      <span>Use Phone Number</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Password Outlined Input */}
            <div className="relative pt-1">
              <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all">
                Password
              </label>

              <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
                <Lock className="w-5 h-5 text-[#581C38]/60 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full text-base sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#581C38]/60 hover:text-[#581C38] ml-2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-500 hover:text-[#581C38] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Terms Disclaimer Text (Flipkart Style) */}
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed pt-2">
              By continuing, you confirm that you are above 18 years of age, and you agree to Real Accessories&apos;s{' '}
              <a href="#" className="text-[#8C254F] font-bold hover:underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#8C254F] font-bold hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            {/* Sticky/Bottom Continue Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-md shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Switch to Register Page */}
        <div className="pt-4 border-t border-gray-100 text-center text-xs sm:text-sm text-gray-600">
          New to Real Accessories?{' '}
          <Link
            href="/register"
            className="font-bold text-[#8C254F] hover:text-[#581C38] transition-colors underline-offset-2 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
