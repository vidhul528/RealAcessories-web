'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Mail, Phone, ShieldCheck, ShoppingBag, Heart, MapPin, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BikeLogo from '@/components/BikeLogo';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FDF0F3] flex items-center justify-center text-[#6E5360]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#8C254F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#581C38]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDF0F3] text-[#2D1823] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="bg-glow-berry top-[-150px] left-1/4" />
      <div className="bg-glow-accent bottom-[-100px] right-10" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-[#F0D0D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#581C38] flex items-center justify-center shadow-md p-1">
              <BikeLogo size={46} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#581C38]">REAL</span>
              <span className="text-xl font-light text-[#2D1823] ml-1">ACCESSORIES</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#581C38]/5 border border-[#581C38]/15 text-xs text-[#581C38] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#8C254F] animate-pulse" />
              <span>Active Session</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-[#F0D0D9] text-[#581C38] font-semibold text-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner (Dark Cherry Container with Large Sharp RA Bike Watermark) */}
        <div className="rounded-3xl p-6 sm:p-10 mb-8 bg-gradient-to-br from-[#47122A] via-[#581C38] to-[#360B1E] text-[#FAF0F3] relative overflow-hidden shadow-xl shadow-[#581C38]/15">
          <div className="absolute top-[-30px] right-[-20px] opacity-15 pointer-events-none">
            <BikeLogo size={320} />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C254F]/30 border border-[#8C254F]/40 text-[#F5C2D2] text-xs font-bold uppercase tracking-wider mb-3">
              VIP Member Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="text-[#F5C2D2]">{user.name}</span>
            </h1>
            <p className="text-[#E5C9D3] text-sm mt-2 max-w-xl font-light">
              Manage your personal details, track luxury orders, address preferences, and account security.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="theme-card p-5 rounded-2xl flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#581C38]/10 border border-[#581C38]/20 flex items-center justify-center text-[#581C38]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6E5360] uppercase font-bold">Total Orders</p>
              <p className="text-xl font-bold text-[#581C38]">0 Active</p>
            </div>
          </div>

          <div className="theme-card p-5 rounded-2xl flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6E5360] uppercase font-bold">Wishlist Items</p>
              <p className="text-xl font-bold text-[#581C38]">0 Saved</p>
            </div>
          </div>

          <div className="theme-card p-5 rounded-2xl flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#8C254F]/10 border border-[#8C254F]/20 flex items-center justify-center text-[#8C254F]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6E5360] uppercase font-bold">Saved Addresses</p>
              <p className="text-xl font-bold text-[#581C38]">{user.addresses?.length || 0} Default</p>
            </div>
          </div>

          <div className="theme-card p-5 rounded-2xl flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#581C38]/10 border border-[#581C38]/20 flex items-center justify-center text-[#8C254F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6E5360] uppercase font-bold">Account Status</p>
              <p className="text-xl font-bold text-[#8C254F]">Verified Member</p>
            </div>
          </div>
        </div>

        {/* Profile Details & Session Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Account Details */}
          <div className="lg:col-span-2 theme-card rounded-3xl p-6 sm:p-8 bg-white">
            <h2 className="text-xl font-bold text-[#581C38] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#8C254F]" /> Personal Details
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9]">
                <span className="text-xs uppercase font-bold text-[#6E5360] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#581C38]" /> Full Name
                </span>
                <span className="text-sm font-bold text-[#2D1823] mt-1 sm:mt-0">{user.name}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9]">
                <span className="text-xs uppercase font-bold text-[#6E5360] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#581C38]" /> Email Address
                </span>
                <span className="text-sm font-bold text-[#581C38] mt-1 sm:mt-0">{user.email}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9]">
                <span className="text-xs uppercase font-bold text-[#6E5360] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#581C38]" /> Phone Number
                </span>
                <span className="text-sm font-bold text-[#2D1823] mt-1 sm:mt-0">
                  {user.phone || 'Not Provided'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9]">
                <span className="text-xs uppercase font-bold text-[#6E5360] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#581C38]" /> Role
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#581C38]/10 text-[#581C38] border border-[#581C38]/20">
                  {user.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info & Security */}
          <div className="theme-card rounded-3xl p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#581C38] mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#8C254F]" /> Security Token
              </h2>

              <p className="text-xs text-[#6E5360] mb-3">
                Your authenticated JWT token stored for backend API calls:
              </p>

              <div className="p-3.5 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9] text-[11px] font-mono text-[#581C38] break-all max-h-36 overflow-y-auto select-all font-semibold">
                {token || 'No active token found'}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F0D0D9]">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> End Session & Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
