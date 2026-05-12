import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Sparkles, Brain } from "lucide-react";
import AiCoachForm from "@/components/AiCoachForm"; // Το διορθωμένο component

export default async function AICoachPage() {
  const { userId } = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: userId ?? "" }
  });

  // Ο ΠΟΡΤΙΕΡΗΣ: Αν δεν είναι premium, τρώει "πόρτα"
  if (!user?.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-slate-900/20 border border-dashed border-slate-800 rounded-[2.5rem] mt-8 max-w-4xl mx-auto">
        <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20 relative">
          <Brain className="w-10 h-10 text-slate-500 opacity-50" />
          <ShieldCheck className="w-6 h-6 text-blue-500 absolute bottom-2 right-2" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">AI Personal Trainer 🤖</h2>
        <p className="text-slate-400 mb-8 max-w-md text-lg leading-relaxed">
          Αυτό το χαρακτηριστικό είναι διαθέσιμο αποκλειστικά για τους Pro χρήστες. Αναβάθμισε τώρα για να αποκτήσεις τον δικό σου έξυπνο προπονητή!
        </p>
        <Link 
          href="/pricing" 
          className="bg-blue-600 px-8 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
        >
          Αναβαθμιση σε Pro
        </Link>
      </div>
    );
  }

  // ΑΝ ΕΙΝΑΙ PREMIUM: Δείχνουμε το "πρόσωπο" του AI Coach
  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-12 text-white">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">AI Personal Coach</h1>
          <p className="text-slate-400 mt-1">Δημιούργησε το τέλειο πρόγραμμα γυμναστικής με τη δύναμη του Gemini.</p>
        </div>
      </div>
      
      {/* Εδώ καλούμε τη φόρμα επικοινωνίας με το API */}
      <AiCoachForm />
      
    </div>
  );
}