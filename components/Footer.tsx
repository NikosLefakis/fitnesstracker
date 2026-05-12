import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/60 bg-[#030712] pt-16 pb-8 relative z-20">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600/30 transition-colors">
                <Dumbbell className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Fitness Tracker</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Η απόλυτη πλατφόρμα για να καταγράφεις τις προπονήσεις σου, να αναλύεις τα δεδομένα σου και να γίνεσαι η καλύτερη εκδοχή του εαυτού σου.
            </p>
          </div>

          {/* Navigation & Premium (Πρώην "Προϊόν") */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Πλοηγηση</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/profile" className="hover:text-blue-400 transition-colors">Το Προφίλ μου</Link></li>
              <li>
                <Link href="/pricing" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-300 hover:to-indigo-300 transition-all flex items-center gap-2 w-max mt-4">
                  Premium Πλάνα <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support (Πρώην "Νομικά") */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Υποστηριξη</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">Συχνές Ερωτήσεις</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Επικοινωνία</Link></li>
              <li>
                {/* Mailto link για να δείχνεις ότι δέχεσαι feedback */}
                <a href="mailto:support@fitnesstracker.com?subject=Bug Report" className="hover:text-blue-400 transition-colors">
                  Αναφορά Σφάλματος
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links & Developer Signature */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium text-center lg:text-left">
            © {currentYear} Fitness Tracker. All rights reserved.
          </p>
          
          {/* Τα Νομικά μεταφέρθηκαν εδώ κάτω */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Πολιτική Απορρήτου </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Όροι Χρήσης</Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">Πολιτική Cookies</Link>
          </div>
          
          <div className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
            <span>Designed & Built by</span>
            <a 
              href="https://nikoslefakis.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Nikos Lefakis Dev
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}