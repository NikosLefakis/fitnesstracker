import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή στην Αρχική
        </Link>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Όροι Χρήσης</h1>
        <p className="text-sm text-slate-500 mb-10">Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')}</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Αποδοχή των Όρων</h2>
            <p>Με την εγγραφή και τη χρήση του Fitness Tracker, αποδέχεστε πλήρως τους παρόντες όρους. Εάν δεν συμφωνείτε, παρακαλούμε να μην χρησιμοποιήσετε την εφαρμογή.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-red-400 mb-4">2. Ιατρική Αποποίηση Ευθύνης (ΣΗΜΑΝΤΙΚΟ)</h2>
            <p>Το Fitness Tracker παρέχει εργαλεία καταγραφής και ενημερωτικό περιεχόμενο. <strong>Δεν αποτελεί ιατρική συμβουλή ούτε υποκαθιστά τον επαγγελματία υγείας ή γυμναστή.</strong> Πάντα να συμβουλεύεστε τον γιατρό σας πριν ξεκινήσετε οποιοδήποτε νέο πρόγραμμα γυμναστικής ή διατροφής.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Λογαριασμός Χρήστη</h2>
            <p>Είστε υπεύθυνοι για τη διατήρηση της ασφάλειας του λογαριασμού σας. Η πλατφόρμα διατηρεί το δικαίωμα να αναστείλει λογαριασμούς που παραβιάζουν την ασφάλεια ή κάνουν κακόβουλη χρήση του συστήματος.</p>
          </section>
        </div>
      </div>
    </div>
  );
}