'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Watch, Gem, ShoppingBag, User, LogOut } from 'lucide-react';
import BikeLogo from '@/components/BikeLogo';
import FullscreenToggle from '@/components/FullscreenToggle';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDF0F3] text-[#2D1823] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#581C38] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Monogram Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#8C254F] border border-white/20 flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <BikeLogo size={36} />
            </div>
            <div className="flex items-center tracking-tight">
              <span className="text-xl font-black text-white italic tracking-wider">REAL</span>
              <span className="text-xl font-light text-white/90 ml-1">ACCESSORIES</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <a href="#collections" className="hover:text-white transition-colors">
              Collections
            </a>
            <a href="#watches" className="hover:text-white transition-colors">
              Luxury Watches
            </a>
            <a href="#jewelry" className="hover:text-white transition-colors">
              Fine Jewelry
            </a>
            <a href="#crafts" className="hover:text-white transition-colors">
              Leather Craft
            </a>
          </nav>

          {/* User Auth Controls & Fullscreen */}
          <div className="flex items-center gap-3">
            <FullscreenToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  <User className="w-4 h-4 text-[#8C254F]" />
                  <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white hover:text-white/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#8C254F] hover:bg-[#751E41] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#581C38] via-[#43142A] to-[#FDF0F3] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8C254F]" />
              <span>Unmatched Artisanship & Perfection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Timeless Elegance for the <span className="text-[#8C254F] italic">Modern Connoisseur</span>
            </h1>

            <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover our exclusive collection of hand-crafted luxury timepieces, fine jewelry monograms, and signature fashion accessories.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={isAuthenticated ? '/dashboard' : '/login'}
                className="px-7 py-3.5 rounded-xl bg-[#8C254F] hover:bg-[#751E41] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#8C254F]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Explore & Sign In'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#collections"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-all"
              >
                View Collections
              </a>
            </div>
          </div>
        </section>

        {/* Featured Categories Grid */}
        <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#581C38]">Curated Collections</h2>
            <p className="text-xs sm:text-sm text-[#6E5360] mt-2">
              Designed with precision, crafted with passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0D0D9] shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDF0F3] text-[#581C38] flex items-center justify-center mb-4">
                  <Watch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#581C38]">Precision Timepieces</h3>
                <p className="text-xs text-[#6E5360] mt-2 leading-relaxed">
                  Swiss-engineered precision chronographs and luxury automatic watches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0D0D9] flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C254F]">Explore Line</span>
                <ArrowRight className="w-4 h-4 text-[#8C254F]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0D0D9] shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDF0F3] text-[#581C38] flex items-center justify-center mb-4">
                  <Gem className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#581C38]">Fine Jewelry</h3>
                <p className="text-xs text-[#6E5360] mt-2 leading-relaxed">
                  Hand-finished signet rings, pendants, and signature cherry accents.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0D0D9] flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C254F]">Explore Line</span>
                <ArrowRight className="w-4 h-4 text-[#8C254F]" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0D0D9] shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDF0F3] text-[#581C38] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#581C38]">Leather Crafts</h3>
                <p className="text-xs text-[#6E5360] mt-2 leading-relaxed">
                  Full-grain leather watch rolls, wallets, and travel cases.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0D0D9] flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C254F]">Explore Line</span>
                <ArrowRight className="w-4 h-4 text-[#8C254F]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#581C38] text-white py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8C254F]" />
            <span className="text-xs font-semibold tracking-wider text-white/90">
              100% Authentic Guaranteed • Express Worldwide Shipping
            </span>
          </div>
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Real Accessories. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
