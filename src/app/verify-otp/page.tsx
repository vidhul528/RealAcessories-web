'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/Api/api';

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError(null);

    // Auto-focus next field
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authAPI.verifyOtp({
        email: email.trim(),
        otp: code,
      });

      if (response.success) {
        setSuccess('OTP verified successfully! Account is now active.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(response.message || 'Invalid or expired OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    setCanResend(false);
    setSuccess('A new OTP has been sent to your email.');
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#F6EDF2] border border-[#8C254F]/30 text-[#581C38] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C254F] shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        {!initialEmail && (
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-[#581C38] uppercase tracking-wider mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="theme-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-sm focus:outline-none placeholder:text-xs placeholder:text-[#A08894]"
            />
          </div>
        )}

        {/* 6-Digit OTP Inputs (Fitted for 320px screens) */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-3 my-3 sm:my-4">
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
              onClick={handleResend}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3.5 px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Verify & Activate</span>
            </>
          )}
        </button>

        <div className="pt-3 sm:pt-4 border-t border-[#F0D0D9] text-center text-xs sm:text-sm text-[#6E5360]">
          Need to change email or login?{' '}
          <Link href="/login" className="font-bold text-[#8C254F] hover:text-[#581C38]">
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-xs text-[#6E5360]">Loading OTP verification...</div>}>
      <OTPForm />
    </Suspense>
  );
}
