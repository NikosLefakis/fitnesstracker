import { ClerkProvider, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Activity, Settings, Zap, Sparkles } from "lucide-react";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';
import NotificationsDropdown from "@/components/NotificationsDropdown";
import prisma from "@/lib/prisma";
import MobileMenu from "@/components/MobileMenu"; 

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FitnessApp | Το προσωπικό σου γυμναστήριο",
  description: "Η απόλυτη εφαρμογή για να καταγράφεις τις προπονήσεις σου.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  let isPremium = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true }
    });
    isPremium = user?.isPremium || false;
  }

  return (
    <ClerkProvider>
      <html lang="el" className={`${inter.variable} antialiased`}>
        <body className="bg-[#020617] text-white relative min-h-screen flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
          
          <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#020617] bg-[radial-gradient(ellipse_at_top,_#070e27_0%,_#020617_100%)]"></div>
          
          {/* NAVBAR */}
          <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
              
              {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: Mobile Menu + Logo */}
              <div className="flex items-center gap-2">
                {/* Το μενού εμφανίζεται ΜΟΝΟ σε κινητά, ΤΕΡΜΑ ΑΡΙΣΤΕΡΑ */}
                <div className="md:hidden">
                  <MobileMenu isPremium={isPremium} />
                </div>

                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  {/* Κρύβουμε το κείμενο στα κινητά για να έχουμε χώρο */}
                  <span className="text-xl font-extrabold text-white tracking-tight hidden md:block">
                    Fitness<span className="text-blue-500">App</span>
                  </span>
                </Link>
              </div>

              {/* ΔΕΞΙ ΜΕΡΟΣ: Links & Icons */}
              <div className="flex items-center gap-2 sm:gap-4">
                {!userId ? (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors">Είσοδος</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="text-xs sm:text-sm font-black bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all active:scale-95">Ξεκίνα</button>
                    </SignUpButton>
                  </div>
                ) : (
                  <>
                    {/* DESKTOP LINKS - Κρύβονται σε κινητά */}
                    <div className="hidden md:flex items-center gap-6">
                      <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Αρχική</Link>
                      <Link href="/dashboard" className="text-sm font-bold text-white transition-colors">Προπονήσεις</Link>
                      <Link href="/dashboard/nutrition" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Διατροφή</Link>

                      {isPremium && (
                        <Link href="/dashboard/ai-coach" className="flex items-center gap-1.5 text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-300 hover:to-indigo-300 transition-all">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          AI Coach
                        </Link>
                      )}
                    </div>

                    <div className="h-5 w-px bg-slate-800 hidden md:block"></div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link href="/dashboard/profile" className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800/50">
                        <Settings className="w-5 h-5" />
                      </Link>
                      
                      <NotificationsDropdown />
                      
                      {/* Premium Badge & User Button */}
                      <div className="flex items-center gap-2 ml-1 sm:ml-2">
                        {isPremium && (
                          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg">
                            <Zap className="w-3 h-3 text-white fill-white" />
                            <span className="text-[10px] font-black text-white uppercase">PRO</span>
                          </div>
                        )}
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-slate-700/50 overflow-hidden">
                          <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>
          
          <Toaster theme="dark" position="bottom-right" richColors />
          <main className="flex-1 flex flex-col z-0">
            {children}
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}