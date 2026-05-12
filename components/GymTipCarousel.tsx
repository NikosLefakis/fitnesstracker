"use client";

import { useState, useEffect } from "react";
import { Activity, ChevronRight, ChevronLeft, Quote } from "lucide-react";

// Η βιβλιοθήκη με τα Tips. Μπορείς να προσθέσεις όσα θέλεις!
const TIPS = [
  "Η συνέπεια κερδίζει την ένταση. Μην ανησυχείς αν μια μέρα δεν είσαι στο 100%, σημασία έχει να εμφανιστείς.",
  "Η προοδευτική υπερφόρτωση (Progressive Overload) είναι το κλειδί. Προσπάθησε σε κάθε προπόνηση για 1 επανάληψη ή 1 κιλό παραπάνω.",
  "Ο ύπνος είναι το καλύτερο συμπλήρωμα. Οι μύες χτίζονται όταν ξεκουράζεσαι, όχι όταν προπονείσαι.",
  "Μην ξεχνάς την ενυδάτωση. Ακόμα και 2% αφυδάτωση μπορεί να ρίξει κατακόρυφα την απόδοσή σου και τη δύναμή σου.",
  "Η σωστή τεχνική είναι πιο σημαντική από τα πολλά κιλά. Άφησε τον εγωισμό σου στην πόρτα του γυμναστηρίου.",
  "Συμπληρώματα όπως η Κρεατίνη βοηθούν, αλλά η βάση είναι πάντα η σωστή διατροφή και η επαρκής πρωτεΐνη."
];

export default function GymTipCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Συνάρτηση για αλλαγή Tip με εφέ Fade
  const changeTip = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 300); // 300ms διάρκεια του fade-out
  };

  const nextTip = () => {
    changeTip((currentIndex + 1) % TIPS.length);
  };

  const prevTip = () => {
    changeTip(currentIndex === 0 ? TIPS.length - 1 : currentIndex - 1);
  };

  // Αυτόματη αλλαγή κάθε 10 δευτερόλεπτα
useEffect(() => {
    const interval = setInterval(nextTip, 4000); // Αλλαγή από 10000 σε 4000
    return () => clearInterval(interval);
  }, [currentIndex]);
  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 relative overflow-hidden group min-h-[220px] flex flex-col justify-between shadow-lg">
      
      {/* Το μπλε accent line αριστερά */}
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Διακοσμητικό εικονίδιο στο background */}
      <Quote className="absolute -right-4 -top-4 w-24 h-24 text-slate-800/20 rotate-12 pointer-events-none" />

      <div>
        {/* Header με Βελάκια */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h4 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider opacity-60">
            <Activity className="w-4 h-4 text-blue-500" />
            Gym Tip
          </h4>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={prevTip} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextTip} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Το κείμενο του Tip με Fade transition */}
        <div className={`transition-opacity duration-300 relative z-10 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-slate-300 text-sm leading-relaxed italic font-medium">
            "{TIPS[currentIndex]}"
          </p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-1.5 mt-6 relative z-10">
        {TIPS.map((_, i) => (
          <button
            key={i}
            onClick={() => changeTip(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Go to tip ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}