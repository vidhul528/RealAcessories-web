'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  LayoutGrid,
  Heart,
  ShoppingBag,
  ChevronUp,
  GripHorizontal,
  Watch,
  Gem,
  Briefcase,
  Sparkles,
  Flame,
  Headphones,
  Package,
  Gift
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const mainNavItems = [
    {
      name: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      name: 'Account',
      icon: User,
      href: isAuthenticated ? '/profile' : '/login',
      isActive: pathname === '/profile' || pathname === '/login' || pathname === '/register',
    },
    {
      name: 'Category',
      icon: LayoutGrid,
      href: '#categories',
      onClick: () => setIsExpanded((prev) => !prev),
      isActive: isExpanded,
    },
    {
      name: 'Wishlist',
      icon: Heart,
      href: '/#wishlist',
      isActive: false,
    },
    {
      name: 'Cart',
      icon: ShoppingBag,
      href: '/#cart',
      isActive: false,
    },
  ];

  const nestedCategories = [
    { name: 'Luxury Watches', icon: Watch, count: '120+ Items', href: '/#collections' },
    { name: 'Fine Jewelry', icon: Gem, count: '85+ Items', href: '/#collections' },
    { name: 'Leather Crafts', icon: Briefcase, count: '60+ Items', href: '/#collections' },
    { name: 'Custom Monograms', icon: Sparkles, count: 'Limited', href: '/#collections' },
  ];

  const quickLinks = [
    { name: 'New Arrivals', icon: Flame, href: '/#collections' },
    { name: 'Gift Guide', icon: Gift, href: '/#collections' },
    { name: 'Track Order', icon: Package, href: '/#orders' },
    { name: '24/7 Support', icon: Headphones, href: '/#support' },
  ];

  return (
    <motion.nav
      drag="y"
      dragConstraints={{ top: -300, bottom: 0 }}
      dragElastic={0.1}
      dragSnapToOrigin={true}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -35 || info.velocity.y < -250) {
          setIsExpanded(true);
        } else if (info.offset.y > 35 || info.velocity.y > 250) {
          setIsExpanded(false);
        }
      }}
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#581C38] border-t border-[#8C254F]/50 shadow-[0_-8px_25px_rgba(0,0,0,0.35)] text-white select-none pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {/* Attached Top-Left Drag Tab: [ :::  ^ ] */}
      <button
        onClick={toggleExpand}
        className="absolute -top-6 left-3 px-3 py-1 bg-[#581C38] hover:bg-[#6c2345] text-[#FDF0F3] transition-colors cursor-pointer rounded-t-xl border-t border-x border-[#8C254F]/60 shadow-md flex items-center gap-1.5 group z-50"
        aria-label="Toggle nested menu"
      >
        <GripHorizontal className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronUp className="w-3.5 h-3.5 text-white font-bold group-hover:scale-110 transition-transform" />
        </motion.div>
      </button>

      {/* Expanded Nested Sub-Navbar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-[#8C254F]/40 bg-[#4a162e]/95 backdrop-blur-md px-4 pt-4 pb-3"
          >
            {/* Nested Sub Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C254F]" />
                Explore Luxury Categories
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[11px] text-white/60 hover:text-white underline cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Sub Categories Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {nestedCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all group"
                  >
                    <div className="p-1.5 rounded-lg bg-[#8C254F]/60 text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-medium text-white group-hover:text-[#FDF0F3] leading-tight">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-white/50">{cat.count}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Links Row */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10 overflow-x-auto pb-1 scrollbar-none">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#8C254F]/40 text-[11px] text-white/80 hover:text-white transition-all whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#8C254F]" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 5 Navigation Items */}
      <div className="px-2 py-1.5 flex items-center justify-around">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isButton = !!item.onClick;

          const content = (
            <>
              <Icon className="w-5 h-5" />
              <span className="text-[11px] tracking-tight font-medium leading-none">{item.name}</span>
            </>
          );

          const className = `flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            item.isActive
              ? 'bg-[#8C254F] text-white shadow-md font-bold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`;

          if (isButton) {
            return (
              <button key={item.name} onClick={item.onClick} className={className}>
                {content}
              </button>
            );
          }

          return (
            <Link key={item.name} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

