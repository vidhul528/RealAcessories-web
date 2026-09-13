'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LayoutGrid, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      name: 'Account',
      icon: User,
      href: isAuthenticated ? '/dashboard' : '/login',
      isActive: pathname === '/login' || pathname === '/register' || pathname === '/dashboard',
    },
    {
      name: 'Category',
      icon: LayoutGrid,
      href: '/#collections',
      isActive: false,
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

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#581C38]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full px-3 py-2 flex items-center justify-between text-white select-none transition-all">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer ${
              item.isActive
                ? 'bg-[#8C254F] text-white shadow-md font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight font-medium leading-none">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
