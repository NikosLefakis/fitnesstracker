import { ClerkProvider, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import { Activity, Settings, Zap , Sparkles} from "lucide-react"; // Προστέθηκε το Zap
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';
import NotificationsDropdown from "@/components/NotificationsDropdown";
import prisma from "@/lib/prisma"; // Απαραίτητο για τον έλεγχο του Premium

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

  // Έλεγχος Premium στη Βάση Δεδομένων
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
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight hidden sm:block">
                  Fitness<span className="text-blue-500">App</span>
                </span>
              </Link>

              <div className="flex items-center gap-3 sm:gap-6">
                {!userId ? (
                  <>
                    <SignInButton mode="modal">
                      <button className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors">Είσοδος</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="text-sm font-black bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95">Ξεκίνα δωρεάν</button>
                    </SignUpButton>
                  </>
                ) : (
                  <>
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
                    
                    <div className="flex items-center gap-2">
                      <Link href="/dashboard/profile" className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800/50 active:scale-95">
                        <Settings className="w-5 h-5" />
                      </Link>
                      
                      {/* ΤΟ COMPONENT ΤΩΝ ΕΙΔΟΠΟΙΗΣΕΩΝ */}
                      <NotificationsDropdown />
                      
                    </div>

                    <div className="flex items-center justify-center transition-transform duration-200 ml-2 gap-3">
                      
                      {/* ΤΟ PREMIUM BADGE */}
                      {/* ΑΥΤΟ ΕΙΝΑΙ ΤΟ PRO BADGE ΠΟΥ ΛΕΙΠΕΙ */}
                    {isPremium && (
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <Zap className="w-3 h-3 text-white fill-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">PRO</span>
                      </div>
                    )}

                      <div className="w-10 h-10 rounded-full border-2 border-slate-700/50 bg-slate-900 flex items-center justify-center overflow-hidden">
                        <UserButton 
                          fallbackRedirectUrl="/" 
                          appearance={{
                            elements: {
                              rootBox: "w-full h-full",
                              avatarBox: "w-full h-full rounded-full border-0"
                            }
                          }} 
                        />
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