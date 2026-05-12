import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή στην Αρχική
        </Link>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Πολιτική Απορρήτου</h1>
        <p className="text-sm text-slate-500 mb-10">Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')}</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Εισαγωγή</h2>
            <p>Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Η παρούσα Πολιτική Απορρήτου εξηγεί πώς το Fitness Tracker συλλέγει, χρησιμοποιεί και προστατεύει τις πληροφορίες σας όταν χρησιμοποιείτε την εφαρμογή μας.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Δεδομένα που Συλλέγουμε</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Πληροφορίες Λογαριασμού:</strong> Email και όνομα (μέσω της υπηρεσίας αυθεντικοποίησης).</li>
              <li><strong className="text-slate-300">Σωματικά Δεδομένα:</strong> Ύψος, βάρος, ηλικία και στόχοι (μόνο εφόσον τα παρέχετε εθελοντικά) για τον υπολογισμό θερμίδων.</li>
              <li><strong className="text-slate-300">Δεδομένα Προπονήσεων & Διατροφής:</strong> Ασκήσεις, σετ, επαναλήψεις και γεύματα που καταγράφετε.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Πώς χρησιμοποιούμε τα δεδομένα σας</h2>
            <p>Χρησιμοποιούμε τα δεδομένα σας αποκλειστικά για να σας παρέχουμε την υπηρεσία: να υπολογίζουμε την πρόοδό σας, τα στατιστικά σας και τους στόχους ενυδάτωσης/διατροφής. Δεν πουλάμε και δεν μοιραζόμαστε τα δεδομένα σας με τρίτους για διαφημιστικούς σκοπούς.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Τα Δικαιώματά σας</h2>
            <p>Έχετε το δικαίωμα να ζητήσετε πρόσβαση, διόρθωση ή πλήρη διαγραφή του λογαριασμού και των δεδομένων σας ανά πάσα στιγμή μέσα από τις ρυθμίσεις του προφίλ σας.</p>
          </section>
        </div>
      </div>
    </div>
  );
}