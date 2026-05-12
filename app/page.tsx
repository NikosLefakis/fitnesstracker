import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"; 
import Link from "next/link";
import { ChevronRight, Dumbbell, TrendingUp, Zap, ChevronDown } from "lucide-react";

export default async function Home() {
  const user = await currentUser();

  return (
    // Αφαίρεσα το background color από εδώ γιατί το παίρνει πλέον από το layout!
    <div className="overflow-hidden">
      
      {/* =========================================
          SECTION 1: HERO (Flex Layout για τέλειο spacing)
          ========================================= */}
      <section className="relative flex flex-col items-center min-h-[90vh] px-6 pt-20 pb-10">
        
        {/* --- ΚΕΝΤΡΙΚΟ ΠΕΡΙΕΧΟΜΕΝΟ --- */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-sm font-medium text-slate-300 backdrop-blur-md shadow-lg mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></span>
            Το προσωπικό σου γυμναστήριο
          </div>

          {/* Τίτλος */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-8">
            Κατάγραψε την πρόοδο. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent pb-2">
              Σπάσε τα ρεκόρ σου.
            </span>
          </h1>

          {/* Υπότιτλος */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-medium mb-12">
            Η πιο έξυπνη εφαρμογή για να παρακολουθείς τις προπονήσεις σου, να βλέπεις την εξέλιξή σου με γραφήματα και να πετυχαίνεις τους στόχους σου πιο γρήγορα.
          </p>

          {/* --- ΚΑΤΑΣΤΑΣΗ ΣΥΝΔΕΣΗΣ --- */}
          <div className="w-full max-w-md">
            {!user ? (
              <SignInButton mode="modal">
                <button className="group relative inline-flex w-full items-center justify-center gap-2 px-8 py-4 text-base font-black text-white transition-all bg-blue-600 rounded-2xl hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]">
                  ΞΕΚΙΝΑ ΤΩΡΑ
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            ) : (
              <div className="flex flex-col items-center gap-6 p-8 rounded-[2rem] bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl transition-all hover:bg-slate-800/50 hover:border-slate-700">
                <div className="flex items-center gap-5 w-full">
                  <UserButton 
                    appearance={{ 
                      elements: { 
                        avatarBox: "w-14 h-14 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#0f172a] shadow-lg hover:scale-105 transition-transform" 
                      } 
                    }} 
                  />
                  <div className="text-left">
                    <p className="text-sm text-slate-400 font-medium">
                      Καλώς όρισες πίσω, <span className="text-slate-200 font-bold">{user.firstName}</span>!
                    </p>
                    <p className="text-lg font-bold text-white mt-0.5">Έτοιμος για Gym; 💪</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className="w-full group inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-white transition-all bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  Πάμε για προπόνηση
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-400" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* --- SCROLL INDICATOR --- */}
        <div className="mt-auto pt-12 flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity animate-bounce cursor-default z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
            ΑΝΑΚΑΛΥΨΕ ΠΕΡΙΣΣΟΤΕΡΑ
          </span>
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>

      </section>

      {/* =========================================
          SECTION 2: FEATURES
          ========================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Dumbbell className="text-blue-400 w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Smart Templates</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Έτοιμα προγράμματα Push, Pull, Legs για να ξεκινάς την προπόνηση με ένα μόνο κλικ, χωρίς χάσιμο χρόνου.</p>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-indigo-400 w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Live Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Παρακολούθησε την πρόοδο του 1RM σου με εντυπωσιακά, διαδραστικά γραφήματα και δες τη δύναμή σου να ανεβαίνει.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 backdrop-blur-md hover:bg-slate-800/60 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="text-emerald-400 w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Άμεση Καταγραφή</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Προσθήκη σετ και επαναλήψεων σε δευτερόλεπτα με έξυπνη συμπλήρωση δεδομένων από το προηγούμενο σετ.</p>
          </div>

        </div>
      </section>

    </div>
  );
}