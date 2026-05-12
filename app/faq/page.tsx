"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { 
    q: "Είναι το Fitness Tracker δωρεάν;", 
    a: "Ναι! Οι βασικές λειτουργίες (καταγραφή προπονήσεων, αναζήτηση τροφίμων, ενυδάτωση) είναι εντελώς δωρεάν. Υπάρχουν Premium πλάνα για πιο προχωρημένα αναλυτικά στατιστικά και λειτουργίες." 
  },
  { 
    q: "Πώς υπολογίζονται οι θερμίδες και τα Macros μου;", 
    a: "Το σύστημα χρησιμοποιεί το βάρος, το ύψος, την ηλικία και τον στόχο σας για να υπολογίσει δυναμικά τον Βασικό Μεταβολισμό (BMR) σας. Στη συνέχεια, προσαρμόζει τα Macros αυτόματα ανάλογα με το αν θέλετε Υπερτροφία (όγκο) ή Απώλεια Λίπους (γράμμωση)." 
  },
  { 
    q: "Πώς μπορώ να αλλάξω τον στόχο μου (π.χ. από Απώλεια Λίπους σε Υπερτροφία);", 
    a: "Μπορείτε να ενημερώσετε τον στόχο σας, το τρέχον βάρος σας ή τις ημέρες προπόνησης πηγαίνοντας στην ενότητα 'Το Προφίλ μου' (από το εικονίδιο ρυθμίσεων). Το σύστημα θα αναπροσαρμόσει αμέσως τις θερμίδες σας." 
  },
  { 
    q: "Τι είναι η πρόοδος 1RM που βλέπω στο Dashboard;", 
    a: "Το 1RM (One Rep Max) είναι μια επιστημονική εκτίμηση του μέγιστου βάρους που μπορείτε να σηκώσετε για μία μόνο επανάληψη σε μια άσκηση. Το app το υπολογίζει αυτόματα κάθε φορά που γράφετε τα κιλά και τις επαναλήψεις σας, ώστε να βλέπετε την πραγματική σας δύναμη να αυξάνεται." 
  },
  { 
    q: "Πώς λειτουργεί το χρονόμετρο (Rest Timer);", 
    a: "Μέσα στη σελίδα της προπόνησης, υπάρχει ενσωματωμένο χρονόμετρο (προεπιλογή στα 90 δευτερόλεπτα). Μόλις ολοκληρώσετε ένα σετ, πατήστε το Play. Θα λάβετε έξυπνη ειδοποίηση (notification) όταν έρθει η ώρα για το επόμενο σετ." 
  },
  { 
    q: "Τι γίνεται αν κάνω λάθος στην καταγραφή ενός γεύματος;", 
    a: "Στη σελίδα της Διατροφής, μπορείτε να πατήσετε το μπλε εικονίδιο του μολυβιού δίπλα από οποιοδήποτε γεύμα για να αλλάξετε την ποσότητα (γραμμάρια) ή το κόκκινο εικονίδιο για να το διαγράψετε τελείως." 
  },
  { 
    q: "Τι παραπάνω προσφέρει το Premium Πλάνο;", 
    a: "Το Premium ξεκλειδώνει προχωρημένα διαγράμματα αναλύσεων για όλες τις ασκήσεις, απεριόριστη δημιουργία custom προγραμμάτων (Templates), export των δεδομένων σας, και αφαίρεση όλων των διαφημίσεων." 
  },
  { 
    q: "Είναι τα προσωπικά μου δεδομένα ασφαλή;", 
    a: "Απόλυτα. Χρησιμοποιούμε τεχνολογίες κρυπτογράφησης αιχμής και το σύστημα αυθεντικοποίησης της Clerk. Τα δεδομένα σας είναι αυστηρά ιδιωτικά και δεν πωλούνται ποτέ σε τρίτους." 
  },
  { 
    q: "Μπορώ να χρησιμοποιήσω το app στο κινητό μου;", 
    a: "Φυσικά. Το Fitness Tracker είναι σχεδιασμένο ως Progressive Web App (PWA), που σημαίνει ότι προσαρμόζεται άψογα στην οθόνη του κινητού ή του tablet σας, δίνοντας την αίσθηση κανονικής εφαρμογής." 
  },
  { 
    q: "Πώς μπορώ να διαγράψω τον λογαριασμό μου;", 
    a: "Μπορείτε να διαγράψετε τον λογαριασμό σας και όλα τα σχετικά δεδομένα (ιστορικό, γεύματα, κλπ.) οριστικά, οποιαδήποτε στιγμή μέσα από τις ρυθμίσεις του λογαριασμού σας." 
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#030712] py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Επιστροφή
        </Link>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Συχνές Ερωτήσεις</h1>
        <p className="text-slate-400 mb-12">Βρείτε γρήγορες απαντήσεις στις πιο κοινές απορίες.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold hover:bg-slate-800/50 transition-colors"
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 text-blue-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}