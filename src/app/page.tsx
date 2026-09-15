'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Watch,
  Gem,
  ShoppingBag,
  User,
  Search,
  X,
  Star,
  Tag,
  ChevronRight,
  Heart,
} from 'lucide-react';
import BikeLogo from '@/components/BikeLogo';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Sample Products Data
  const products = [
    {
      id: '1',
      name: 'Royal Automatic Chronograph',
      category: 'Luxury Watches',
      price: '₹49,999',
      originalPrice: '₹59,999',
      rating: 4.9,
      reviews: 128,
      badge: 'Best Seller',
      icon: Watch,
    },
    {
      id: '2',
      name: 'Signature Monogram Ring',
      category: 'Fine Jewelry',
      price: '₹12,499',
      originalPrice: '₹15,000',
      rating: 4.8,
      reviews: 94,
      badge: 'Exclusive',
      icon: Gem,
    },
    {
      id: '3',
      name: 'Handcrafted Leather Watch Roll',
      category: 'Leather Craft',
      price: '₹8,999',
      originalPrice: '₹11,999',
      rating: 5.0,
      reviews: 62,
      badge: 'Popular',
      icon: ShoppingBag,
    },
    {
      id: '4',
      name: 'Heritage Diamond Watch',
      category: 'Luxury Watches',
      price: '₹89,999',
      originalPrice: '₹99,999',
      rating: 4.9,
      reviews: 45,
      badge: 'Limited Edition',
      icon: Watch,
    },
    {
      id: '5',
      name: 'Cherry Edition Leather Bracelet',
      category: 'Fine Jewelry',
      price: '₹4,499',
      originalPrice: '₹5,999',
      rating: 4.7,
      reviews: 110,
      badge: 'Trending',
      icon: Gem,
    },
    {
      id: '6',
      name: 'Tourbillon Skeleton Watch',
      category: 'Luxury Watches',
      price: '₹1,24,999',
      originalPrice: '₹1,49,999',
      rating: 5.0,
      reviews: 38,
      badge: 'Masterpiece',
      icon: Watch,
    },
  ];

  // Featured Brands Data
  const brands = [
    'Rolex',
    'Omega',
    'Cartier',
    'Patek Philippe',
    'Audemars Piguet',
    'Tag Heuer',
    'Real Accessories Signature',
  ];

  return (
    <div className="min-h-screen bg-[#FDF0F3] text-[#2D1823] font-sans flex flex-col pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#581C38] text-white shadow-lg border-b border-[#8C254F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {showSearch ? (
            /* Full-Width Search Bar */
            <div className="w-full flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 border border-white/20 animate-fadeIn">
              <Search className="w-5 h-5 text-white/70 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, jewelry, accessories..."
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                title="Close Search"
                className="p-1 rounded-lg text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Header with Brand Heading on Left, Search Icon on Right */
            <>
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8C254F] border border-white/20 flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <BikeLogo size={32} />
                </div>
                <div className="flex items-center tracking-tight">
                  <span className="text-base sm:text-xl font-black text-white italic tracking-wider">REAL</span>
                  <span className="text-base sm:text-xl font-light text-white/90 ml-1">ACCESSORIES</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  title="Search"
                  aria-label="Search"
                  className="p-2 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isAuthenticated && (
                  <div
                    title={user?.name || 'Logged in user'}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#8C254F] to-[#a32e5d] text-white border border-white/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-md select-none shrink-0"
                  >
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-12 py-6">
        {/* 1. HERO BANNER WITH 4 BUTTONS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#47122A] via-[#581C38] to-[#2B0818] text-white p-6 sm:p-12 shadow-2xl border border-[#8C254F]/30 text-center">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#8C254F]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#581C38]/40 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-5">
              {/* Message Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C254F]/30 border border-[#8C254F]/40 text-[#F5C2D2] text-xs font-bold uppercase tracking-widest shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#F5C2D2]" />
                <span>✦ Exclusive Luxury Collection 2026 ✦</span>
              </div>

              {/* Main Banner Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Timeless Craftsmanship & <span className="text-[#F5C2D2] italic">Modern Elegance</span>
              </h1>

              {/* Banner Text Description */}
              <p className="text-xs sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed font-light">
                Explore handcrafted luxury timepieces, fine jewelry monograms, and signature leather craft designed for discerning connoisseurs.
              </p>

              {/* 4 Interactive Buttons Inside Hero Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
                {/* Button 1 */}
                <a
                  href="#collections"
                  className="py-3 px-3 rounded-xl bg-[#8C254F] hover:bg-[#751E41] text-white font-bold text-xs shadow-md shadow-[#8C254F]/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Collections</span>
                </a>

                {/* Button 2 */}
                <a
                  href="#watches"
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Watch className="w-3.5 h-3.5" />
                  <span>Watches</span>
                </a>

                {/* Button 3 */}
                <a
                  href="#jewelry"
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Gem className="w-3.5 h-3.5" />
                  <span>Jewelry</span>
                </a>

                {/* Button 4 */}
                <Link
                  href={isAuthenticated ? '/profile' : '/login'}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#8C254F] to-[#581C38] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{isAuthenticated ? 'My Profile' : 'Sign In'}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BRANDS SECTION (Below Banner) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C254F]">
              World-Class Craftsmanship
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#581C38]">Featured Luxury Brands</h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-white border border-[#F0D0D9] shadow-sm hover:shadow-md transition-all text-xs font-bold text-[#581C38] hover:bg-[#FDF0F3] cursor-pointer flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#8C254F]" />
                <span>{brand}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. ADVERTISEMENTS SECTION (Below Brands) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <div className="text-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C254F]">
              Limited Time Deals
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#581C38]">Special Offers & Advertisements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Promo Card 1 */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-r from-[#581C38] to-[#751E41] text-white overflow-hidden shadow-lg border border-[#8C254F]/40 flex flex-col justify-between">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                  <Tag className="w-3 h-3 text-[#F5C2D2]" />
                  <span>Season Special • 20% OFF</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">Limited Edition Chronographs</h3>
                <p className="text-xs text-white/80 font-light">
                  Upgrade your wristwear with precision Swiss movement. Offer ends this Sunday.
                </p>
              </div>

              <div className="pt-4 relative z-10 flex items-center justify-between">
                <span className="text-sm font-bold text-[#F5C2D2]">Code: LUXURY20</span>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-white text-[#581C38] font-bold text-xs shadow-md hover:bg-gray-100 transition-all flex items-center gap-1"
                >
                  <span>Claim Offer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-r from-[#47122A] via-[#8C254F] to-[#581C38] text-white overflow-hidden shadow-lg border border-[#8C254F]/40 flex flex-col justify-between">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#F5C2D2]" />
                  <span>Complimentary Service</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">Custom Monogram Engraving</h3>
                <p className="text-xs text-white/80 font-light">
                  Personalize your signet rings, bracelets, and watch cases at zero extra charge.
                </p>
              </div>

              <div className="pt-4 relative z-10 flex items-center justify-between">
                <span className="text-sm font-bold text-[#F5C2D2]">Free Customization</span>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-white text-[#581C38] font-bold text-xs shadow-md hover:bg-gray-100 transition-all flex items-center gap-1"
                >
                  <span>Customize Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCTS SECTION (Below Advertisements) */}
        <section id="collections" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C254F]">
                Handpicked Masterpieces
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#581C38]">Featured Products</h2>
            </div>
            <Link
              href="/login"
              className="text-xs font-bold text-[#8C254F] hover:text-[#581C38] flex items-center gap-1 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const CategoryIcon = product.icon;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-5 border border-[#F0D0D9] shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image / Icon Container */}
                    <div className="relative w-full h-44 rounded-xl bg-[#FDF0F3] border border-[#F0D0D9] flex items-center justify-center overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
                      <div className="w-16 h-16 rounded-2xl bg-[#581C38] text-white flex items-center justify-center shadow-lg">
                        <CategoryIcon className="w-8 h-8 text-[#F5C2D2]" />
                      </div>

                      {/* Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#8C254F] text-white text-[10px] font-bold tracking-wide uppercase shadow-md">
                        {product.badge}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#581C38] shadow-sm transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category Name & Rating */}
                    <div className="flex items-center justify-between text-xs text-[#6E5360] mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-base font-bold text-[#581C38] group-hover:text-[#8C254F] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing & Add to Cart Button */}
                  <div className="mt-4 pt-3 border-t border-[#F0D0D9] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-[#581C38]">{product.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-2">{product.originalPrice}</span>
                    </div>

                    <Link
                      href="/login"
                      className="px-3.5 py-2 rounded-xl bg-[#581C38] hover:bg-[#8C254F] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#581C38] text-white py-8 border-t border-white/10 mt-12">
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
