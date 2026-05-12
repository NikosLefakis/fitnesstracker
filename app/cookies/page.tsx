import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή στην Αρχική
        </Link>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Πολιτική Cookies</h1>
        <p className="text-sm text-slate-500 mb-10">Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')}</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Τι είναι τα Cookies;</h2>
            <p>Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στον περιηγητή σας (browser) για να προσφέρουν μια ομαλή και ασφαλή εμπειρία χρήσης της εφαρμογής.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Πώς τα χρησιμοποιούμε</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Απολύτως Απαραίτητα:</strong> Χρησιμοποιούμε cookies για τη σύνδεσή σας (Authentication μέσω Clerk) και την ασφάλεια του λογαριασμού σας. Η εφαρμογή δεν μπορεί να λειτουργήσει χωρίς αυτά.</li>
              <li><strong className="text-slate-300">Λειτουργικότητας:</strong> Για να θυμόμαστε τις προτιμήσεις σας, όπως π.χ. αν έχετε ήδη δει ένα αναδυόμενο μήνυμα (retention alerts).</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}