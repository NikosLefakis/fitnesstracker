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
    <div className="flex items-center">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#020617] p-6 flex flex-col h-full animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-10">
              <span className="text-xl font-black text-white">Μενού</span>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="w-8 h-8 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-lg font-semibold text-slate-200"
                >
                  <route.icon className="w-6 h-6 text-blue-500" />
                  {route.label}
                </Link>
              ))}

              {isPremium && (
                <Link
                  href="/dashboard/ai-coach"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 text-lg font-black text-blue-400"
                >
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  AI Coach
                </Link>
              )}
            </div>
        </div>
      )}
    </div>
  );
}