'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Watch, Gem, ShoppingBag, Sparkles } from 'lucide-react';
import BikeLogo from '@/components/BikeLogo';
import FullscreenToggle from '@/components/FullscreenToggle';

interface AuthLayoutProps {
  children: ReactNode;
}

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.75 },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#FDF0F3] text-[#2D1823] font-sans overflow-hidden select-none">
      {/* Background Home Page View (Rendered behind the modal on Mobile & Desktop) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none overflow-hidden">
        {/* Background Header Bar */}
        <div className="bg-[#581C38] h-16 w-full flex items-center justify-between px-4 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8C254F] flex items-center justify-center p-0.5">
              <BikeLogo size={24} />
            </div>
            <span className="font-bold text-sm">REAL ACCESSORIES</span>
          </div>
        </div>

        {/* Background Hero Content */}
        <div className="p-8 text-center max-w-md mx-auto space-y-4 pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#581C38]/10 text-xs font-semibold text-[#581C38]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Luxury Collection</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#581C38]">Timeless Luxury Watches & Accessories</h2>
          <div className="grid grid-cols-3 gap-3 pt-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F0D0D9] flex flex-col items-center">
              <Watch className="w-6 h-6 text-[#581C38]" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F0D0D9] flex flex-col items-center">
              <Gem className="w-6 h-6 text-[#581C38]" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F0D0D9] flex flex-col items-center">
              <ShoppingBag className="w-6 h-6 text-[#581C38]" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* SSR-Safe Framer Motion Dark Translucent Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* SSR-Safe Framer Motion Interactive Touch & Scroll Sheet Modal */}
            <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
              <motion.div
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.02, bottom: 0.7 }}
                onDragEnd={(_, info) => {
                  // Dismiss if dragged down > 80px OR flicked downward fast (> 200px/s)
                  if (info.offset.y > 80 || info.velocity.y > 200) {
                    handleClose();
                  }
                }}
                className="pointer-events-auto relative z-50 w-full max-w-md mx-auto bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-t border-white/40 touch-none"
              >
                {/* Header & Drag Handle Bar */}
                <div className="w-full bg-[#581C38] text-white px-4 pt-3 pb-4 cursor-grab active:cursor-grabbing flex flex-col items-center border-b border-[#8C254F]/30 shrink-0 touch-none select-none">
                  {/* Drag Pill Indicator */}
                  <div className="w-12 h-1.5 bg-white/40 hover:bg-white/60 rounded-full mb-3 transition-colors pointer-events-none" />

                  {/* Header Controls */}
                  <div className="w-full flex items-center justify-between">
                    {/* Close Button (X) */}
                    <Link
                      href="/"
                      onClick={handleClose}
                      aria-label="Close"
                      className="p-2 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer pointer-events-auto z-50"
                    >
                      <X className="w-5 h-5" />
                    </Link>

                    {/* Brand Logo */}
                    <Link href="/" className="inline-flex items-center gap-2 group pointer-events-auto">
                      <div className="w-8 h-8 rounded-xl bg-[#8C254F] border border-white/20 flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
                        <BikeLogo size={28} />
                      </div>
                      <div className="flex items-center tracking-tight">
                        <span className="text-base font-black text-white italic tracking-wider">REAL</span>
                        <span className="text-base font-light text-white/90 ml-1">ACCESSORIES</span>
                      </div>
                    </Link>

                    {/* Fullscreen Toggle */}
                    <div className="pointer-events-auto">
                      <FullscreenToggle />
                    </div>
                  </div>
                </div>

                {/* Scrollable Form Content Area */}
                <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-white touch-pan-y">
                  {children}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
