import Link from "next/link";
import { Check, Zap, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function PricingPage() {
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
    <div className="min-h-screen bg-[#030712] py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-12 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή στο Dashboard
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Πήγαινε την προπόνησή σου στο <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Επόμενο Επίπεδο</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Επίλεξε το πλάνο που ταιριάζει στους στόχους σου. Ξεκλείδωσε τον AI Coach και εξατομικευμένα προγράμματα.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* FREE TIER */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col backdrop-blur-sm">
            <h3 className="text-2xl font-black text-white mb-2">Basic</h3>
            <p className="text-slate-400 text-sm mb-6">Ιδανικό για να ξεκινήσεις το ταξίδι σου.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">Δωρεάν</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Καταγραφή απεριόριστων προπονήσεων",
                "Βασικά στατιστικά και θερμίδες",
                "Tracker Ενυδάτωσης",
                "Πρόσβαση στη βάση τροφίμων"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-slate-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            {!isPremium ? (
              <button disabled className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm border border-slate-700 text-slate-300 bg-slate-900 cursor-default opacity-70 mt-auto">
                ΤΟ ΤΡΕΧΟΝ ΠΛΑΝΟ ΣΟΥ
              </button>
            ) : (
              <button disabled className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm border border-slate-800 text-slate-500 bg-slate-900/30 cursor-not-allowed mt-auto">
                ΒΑΣΙΚΟ ΠΛΑΝΟ
              </button>
            )}
          </div>

          {/* PRO TIER */}
          <div className={`bg-gradient-to-b from-slate-800/80 to-slate-900/80 border rounded-[2.5rem] p-8 md:p-10 flex flex-col relative shadow-2xl transition-all transform md:-translate-y-4 ${
            isPremium 
              ? "border-emerald-500/50 shadow-emerald-900/20" 
              : "border-blue-500/30 shadow-blue-900/20"
          }`}>
            
            {isPremium ? (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/25">
                <Check className="w-3 h-3" /> ΕΝΕΡΓΟ ΠΛΑΝΟ
              </div>
            ) : (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/25">
                <Zap className="w-3 h-3 fill-white" /> Πιο Δημοφιλες
              </div>
            )}

            <h3 className={`text-2xl font-black mb-2 flex items-center gap-2 ${isPremium ? "text-emerald-400" : "text-blue-400"}`}>
              Pro <Sparkles className="w-5 h-5" />
            </h3>
            <p className="text-slate-400 text-sm mb-6">Για αυτούς που θέλουν την απόλυτη εξατομίκευση.</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">€4.99</span>
              <span className="text-slate-500 font-bold">/ μήνα</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Όλα τα χαρακτηριστικά του Basic",
                "AI Personal Trainer (Βάσει Προφίλ)", 
                "Εξαγωγή Προγράμματος (PDF) & 1-Click Αποθήκευση",
                "Advanced Θερμιδομετρητής & Macro Analytics",
                "Δημιουργία Custom Templates",
                "Μηδενικές Διαφημίσεις & Priority Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-white font-bold">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    i === 1 || i === 2 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : (isPremium ? "bg-emerald-500/20" : "bg-blue-500/20")
                  }`}>
                    {i === 1 || i === 2 ? (
                      <Sparkles className="w-3 h-3 text-white" />
                    ) : (
                      <Check className={`w-3 h-3 ${isPremium ? "text-emerald-400" : "text-blue-400"}`} />
                    )}
                  </div>
                  <span className={i === 1 ? "text-blue-400 font-black tracking-wide" : ""}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            {isPremium ? (
              <button disabled className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default flex justify-center items-center gap-2 mt-auto">
                ΤΟ ΤΡΕΧΟΝ ΠΛΑΝΟ ΣΑΣ
              </button>
            ) : (
              <form action="/api/stripe/checkout" method="POST" className="mt-auto">
                <button type="submit" className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/40 active:scale-95 flex justify-center items-center gap-2">
                  ΑΝΑΒΑΘΜΙΣΗ ΣΕ PRO
                </button>
              </form>
            )}
            
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3 h-3" /> Ασφαλείς Πληρωμές μέσω Stripe
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}