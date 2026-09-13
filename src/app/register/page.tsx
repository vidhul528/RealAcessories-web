'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Loader2, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/Api/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      setError('Please fill in your name, mobile number, and email address.');
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please confirm you agree to the Terms & Privacy Policy.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: cleanPhone,
        mobileNumber: cleanPhone,
        mobileCode: '+91',
      });

      if (response.success) {
        setSuccess('Account created! Redirecting to OTP verification...');
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
        }, 1200);
      } else {
        setError(response.message || 'Registration failed. Email or mobile number may already be registered.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between flex-1 space-y-5">
        <div>
          {/* Header Title (Flipkart Style) */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Sign up for exclusive access
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-5">
            Create an account to explore luxury watches & accessories
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="p-3 rounded-xl bg-[#F6EDF2] border border-[#8C254F]/30 text-[#581C38] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C254F] shrink-0 mt-0.5" />
                <div>{success}</div>
              </div>
            )}

            {/* Full Name Input */}
            <div className="relative pt-1">
              <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all z-10">
                Full Name <span className="text-[#8C254F]">*</span>
              </label>

              <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
                <User className="w-5 h-5 text-[#581C38]/60 mr-2.5 shrink-0" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alexander Wright"
                  required
                  className="w-full text-base sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="relative pt-1">
              <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all z-10">
                10-Digit Mobile Number <span className="text-[#8C254F]">*</span>
              </label>

              <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
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
              </div>
            </div>

            {/* Email Address Input */}
            <div className="relative pt-1">
              <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all z-10">
                Email Address <span className="text-[#8C254F]">*</span>
              </label>

              <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
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
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#581C38] focus:ring-[#8C254F]"
                />
                <span>
                  By continuing, I confirm I am 18+ and agree to the{' '}
                  <a href="#" className="text-[#8C254F] font-bold hover:underline">
                    Terms of Use
                  </a>{' '}
                  &{' '}
                  <a href="#" className="text-[#8C254F] font-bold hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-md shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="pt-4 border-t border-gray-100 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#8C254F] hover:text-[#581C38] transition-colors underline-offset-2 hover:underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
