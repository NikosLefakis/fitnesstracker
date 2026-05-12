import Link from "next/link";
import { ChevronLeft, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#030712] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Επικοινωνία</h1>
            <p className="text-slate-400 mb-12">
              Έχετε απορίες, προτάσεις ή βρήκατε κάποιο πρόβλημα; Συμπληρώστε τη φόρμα και θα σας απαντήσουμε το συντομότερο δυνατό.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</p>
                  <a href="mailto:support@fitnesstracker.com" className="font-bold hover:text-blue-400 transition-colors">support@fitnesstracker.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Τοποθεσια</p>
                  <p className="font-bold">Ηράκλειο, Κρήτη, Ελλάδα</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ονοματεπώνυμο</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all text-white" placeholder="π.χ. Νίκος..." required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all text-white" placeholder="nikos@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Μήνυμα</label>
                <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all text-white resize-none" placeholder="Πώς μπορούμε να βοηθήσουμε;" required />
              </div>
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4">
                ΑΠΟΣΤΟΛΗ <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}