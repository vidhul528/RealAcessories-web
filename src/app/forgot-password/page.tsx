'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/Api/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Step 1: Send Reset Request
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgetPassword({ email: email.trim() });
      if (response.success) {
        setSuccess('Password reset code sent to your email!');
        setTimeout(() => {
          setStep('verify');
          setSuccess(null);
        }, 1200);
      } else {
        setError(response.message || 'Email not found or error sending reset code.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Reset OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyResetOtp({ email: email.trim(), otp: otp.trim() });
      if (response.success) {
        setSuccess('OTP verified successfully!');
        setTimeout(() => {
          setStep('reset');
          setSuccess(null);
        }, 1200);
      } else {
        setError(response.message || 'Invalid reset code. Please try again.');
      }
    } catch (err: any) {
      setError('An error occurred verifying reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.resetPassword({
        email: email.trim(),
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-xl bg-[#F6EDF2] border border-[#8C254F]/30 text-[#581C38] text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#8C254F] shrink-0 mt-0.5" />
          <div>{success}</div>
        </div>
      )}

      {/* Step 1 Form */}
      {step === 'request' && (
        <form onSubmit={handleRequestReset} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#581C38] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#581C38]/60">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                required
                className="theme-input w-full pl-11 pr-4 py-3 rounded-xl text-base sm:text-sm focus:outline-none placeholder:text-xs placeholder:text-[#A08894]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Reset Code</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2 Form */}
      {step === 'verify' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#581C38] uppercase tracking-wider mb-2">
              Reset Code (OTP)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#581C38]/60">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter 6-digit code"
                required
                className="theme-input w-full pl-11 pr-4 py-3 rounded-xl text-base sm:text-sm focus:outline-none placeholder:text-xs placeholder:text-[#A08894] tracking-widest text-[#581C38] font-mono font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 3 Form */}
      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#581C38] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#581C38]/60">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="theme-input w-full pl-11 pr-11 py-3 rounded-xl text-base sm:text-sm focus:outline-none placeholder:text-xs placeholder:text-[#A08894]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#581C38]/60 hover:text-[#581C38]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#581C38] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#581C38]/60">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="theme-input w-full pl-11 pr-4 py-3 rounded-xl text-base sm:text-sm focus:outline-none placeholder:text-xs placeholder:text-[#A08894]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7B2A51] via-[#581C38] to-[#401227] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#581C38]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-[#F0D0D9] text-center text-sm text-[#6E5360]">
        Remembered your password?{' '}
        <Link href="/login" className="font-bold text-[#8C254F] hover:text-[#581C38]">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
