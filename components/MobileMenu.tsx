"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, LayoutDashboard, Utensils, Home } from "lucide-react";

interface MobileMenuProps {
  isPremium: boolean;
}

export default function MobileMenu({ isPremium }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { href: "/", label: "Αρχική", icon: Home },
    { href: "/dashboard", label: "Προπονήσεις", icon: LayoutDashboard },
    { href: "/dashboard/nutrition", label: "Διατροφή", icon: Utensils },
  ];

  return (
    <>
      {/* ΑΥΤΟ ΤΟ STYLE TAG ΕΙΝΑΙ Η ΛΥΣΗ:
         Επιβάλλει στο "mobile-trigger" να είναι ΑΟΡΑΤΟ σε οθόνες πάνω από 1024px.
      */}
      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-trigger {
            display: none !important;
          }
        }
      `}</style>

      <div className="mobile-trigger flex items-center lg:hidden">
        {/* Hamburger Button */}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Overlay & Menu */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] animate-in fade-in duration-200">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                     <Home className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-black text-white">Menu</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-8 h-8 text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-lg font-semibold text-slate-200 hover:bg-white/10 transition-all active:scale-95"
                  >
                    <route.icon className="w-6 h-6 text-blue-500" />
                    {route.label}
                  </Link>
                ))}

                {isPremium && (
                  <Link
                    href="/dashboard/ai-coach"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 text-lg font-black text-blue-400 shadow-lg shadow-blue-500/5 transition-all active:scale-95"
                  >
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    AI Coach
                  </Link>
                )}
              </div>
              
              <div className="mt-auto pb-10 text-center">
                 <p className="text-slate-500 text-sm italic tracking-widest uppercase">FitnessApp</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}