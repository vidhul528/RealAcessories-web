'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Check,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/Api/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Wizard Step State (1: Details, 2: OTP Verification, 3: Set Password)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreeTerms: false,
  });

  // OTP State for Step 2
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Password State for Step 3
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // OTP Timer Logic
  useEffect(() => {
    if (currentStep === 2 && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [currentStep, resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  // STEP 1: Submit Details & Request OTP
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      setError('Please fill in your full name, mobile number, and email address.');
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please confirm you agree to the Terms of Use & Privacy Policy.');
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
        setCurrentStep(2);
        setSuccess(`OTP sent to ${formData.email.trim()}! Please check your inbox.`);
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(response.message || 'Registration failed. Email or mobile number may already be registered.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyOtp({
        email: formData.email.trim(),
        otp: code,
      });

      if (response.success) {
        setCurrentStep(3);
        setSuccess('OTP verified successfully! Please set your password to activate your account.');
      } else {
        setError(response.message || 'Invalid or expired OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred during OTP verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Confirm Password & Activate Account
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.confirmPassword({
        email: formData.email.trim(),
        password,
        confirmPassword,
      });

      if (response.success) {
        setSuccess('Account created and activated successfully! Redirecting...');

        // Auto login if token returned
        const token = response.data?.token || response.data?.data?.token;
        const name = response.data?.name || formData.name;
        if (token) {
          login(token, { name, email: formData.email.trim() });
        }

        setTimeout(() => {
          router.push(token ? '/' : '/login');
        }, 1500);
      } else {
        setError(response.message || 'Failed to activate account. Please try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred while setting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim().replace(/\D/g, ''),
        mobileNumber: formData.phone.trim().replace(/\D/g, ''),
        mobileCode: '+91',
      });
      if (response.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccess('A new 6-digit OTP has been sent to your email address.');
      } else {
        setError(response.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-between flex-1 space-y-4">
        <div>
          {/* Header Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-1">
            {currentStep === 1 && 'Sign up for exclusive access'}
            {currentStep === 2 && 'Verify Email OTP'}
            {currentStep === 3 && 'Set Account Password'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            {currentStep === 1 && 'Create an account to explore luxury watches & accessories'}
            {currentStep === 2 && `Enter the 6-digit code sent to ${formData.email}`}
            {currentStep === 3 && 'Create a secure password to complete your account setup'}
          </p>

          {/* 3-STEP WIZARD PROGRESS BAR AT THE TOP */}
          <div className="mb-6 py-2.5 px-2 bg-[#FDF0F3] rounded-xl border border-[#F0D0D9]">
            <div className="flex items-center justify-between relative px-4">
              {/* Progress Track Line */}
              <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-300 z-0">
                <div
                  className="h-full bg-[#8C254F] transition-all duration-500 ease-in-out"
                  style={{
                    width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                  }}
                />
              </div>

              {/* Step 1 Badge */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep > 1
                      ? 'bg-[#8C254F] text-white ring-2 ring-[#8C254F]/30'
                      : currentStep === 1
                      ? 'bg-[#581C38] text-white ring-4 ring-[#581C38]/20 scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 font-semibold ${
                    currentStep >= 1 ? 'text-[#581C38]' : 'text-gray-400'
                  }`}
                >
                  Details
                </span>
              </div>

              {/* Step 2 Badge */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep > 2
                      ? 'bg-[#8C254F] text-white ring-2 ring-[#8C254F]/30'
                      : currentStep === 2
                      ? 'bg-[#581C38] text-white ring-4 ring-[#581C38]/20 scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 font-semibold ${
                    currentStep >= 2 ? 'text-[#581C38]' : 'text-gray-400'
                  }`}
                >
                  Verify OTP
                </span>
              </div>

              {/* Step 3 Badge */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 3
                      ? 'bg-[#581C38] text-white ring-4 ring-[#581C38]/20 scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 font-semibold ${
                    currentStep === 3 ? 'text-[#581C38]' : 'text-gray-400'
                  }`}
                >
                  Password
                </span>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 rounded-xl bg-[#F6EDF2] border border-[#8C254F]/30 text-[#581C38] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C254F] shrink-0 mt-0.5" />
              <div>{success}</div>
            </div>
          )}

          {/* ================= STEP 1: REGISTRATION DETAILS ================= */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4 animate-fadeIn">
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
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Continue to OTP Verification</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2: OTP VERIFICATION ================= */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5 animate-fadeIn">
              {/* 6-Digit OTP Inputs */}
              <div className="flex justify-center items-center gap-1.5 sm:gap-3 my-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-9 h-11 sm:w-13 sm:h-14 text-center text-base sm:text-xl font-bold theme-input rounded-lg sm:rounded-xl focus:border-[#8C254F] focus:ring-2 focus:ring-[#8C254F]/20 text-[#581C38] p-0"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-center text-xs sm:text-sm text-[#6E5360]">
                Didn&apos;t receive code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#8C254F] hover:text-[#581C38] font-bold inline-flex items-center gap-1 ml-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
                  </button>
                ) : (
                  <span className="text-[#A08894] font-medium ml-1">
                    Resend in <span className="text-[#581C38] font-mono font-bold">{resendTimer}s</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-md shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-2 text-xs text-gray-500 hover:text-[#581C38] underline text-center cursor-pointer"
                >
                  ← Edit Account Details
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: CREATE PASSWORD ================= */}
          {currentStep === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4 animate-fadeIn">
              {/* Password Input */}
              <div className="relative pt-1">
                <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all z-10">
                  Create Password <span className="text-[#8C254F]">*</span>
                </label>

                <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
                  <Lock className="w-5 h-5 text-[#581C38]/60 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="At least 6 characters"
                    required
                    className="w-full text-base sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-[#581C38] transition-colors ml-2 cursor-pointer shrink-0 text-xs font-semibold"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="relative pt-1">
                <label className="absolute top-1 left-3 bg-white px-1.5 text-[11px] font-semibold text-[#581C38] transition-all z-10">
                  Confirm Password <span className="text-[#8C254F]">*</span>
                </label>

                <div className="flex items-center border-2 border-[#581C38]/40 focus-within:border-[#8C254F] rounded-xl px-3 py-3 transition-colors bg-white shadow-sm mt-3">
                  <Lock className="w-5 h-5 text-[#581C38]/60 mr-2.5 shrink-0" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Re-enter your password"
                    required
                    className="w-full text-base sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-[#581C38] transition-colors ml-2 cursor-pointer shrink-0 text-xs font-semibold"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Set Password & Activate Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-md shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Activating Account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Set Password & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
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

