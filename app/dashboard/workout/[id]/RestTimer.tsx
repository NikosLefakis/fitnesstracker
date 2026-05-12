"use client";

import { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function RestTimer() {
  // Ορίζουμε τον default χρόνο διαλείμματος (π.χ. 90 δευτερόλεπτα)
  const defaultTime = 90;
  const [seconds, setSeconds] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (isActive && seconds > 0) {
      // Όσο είναι ενεργό και ο χρόνος είναι πάνω από 0, μειώνουμε κατά 1
      interval = setInterval(() => {
        setSeconds((sec) => sec - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      // ΤΟ ΧΡΟΝΟΜΕΤΡΟ ΜΗΔΕΝΙΣΕ - FIRE NOTIFICATION!
      clearInterval(interval);
      setIsActive(false);

      // 1. Live Toast (Sonner) στο UI
      toast.success("Το διάλειμμα τελείωσε!", {
        description: "Ώρα για το επόμενο σετ. Πάμε δυνατά! 💪",
        duration: 5000,
      });

      // 2. Global Store Notification (Για να εμφανιστεί στο καμπανάκι του Navbar)
      useNotificationStore.getState().addNotification({
        title: "Τέλος Διαλείμματος",
        message: "Ολοκληρώθηκε ο χρόνος ξεκούρασης. Ώρα για το επόμενο σετ.",
        type: "SUCCESS",
      });
      
      // Επαναφορά του χρονομέτρου για το επόμενο σετ
      setSeconds(defaultTime); 
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  // Βοηθητική συνάρτηση για γρήγορη αλλαγή χρόνου
  const setQuickTime = (newTime: number) => {
    setSeconds(newTime);
    setIsActive(true); // Ξεκινάει αυτόματα μόλις πατήσεις την επιλογή
  };

  return (
    <div className="flex items-center gap-4 bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-2xl">
      
      {/* Quick Presets: Εμφανίζονται σε μεγαλύτερες οθόνες για γρήγορη επιλογή */}
      <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 pr-3 mr-1">
        <button onClick={() => setQuickTime(60)} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800">60s</button>
        <button onClick={() => setQuickTime(90)} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800">90s</button>
        <button onClick={() => setQuickTime(120)} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800">2m</button>
      </div>

      <div className="flex items-center gap-2">
        <Timer className={`w-4 h-4 ${isActive ? "text-blue-500 animate-pulse" : "text-slate-500"}`} />
        <span className={`font-mono font-bold tracking-wider ${
          isActive 
            ? (seconds <= 10 ? "text-red-400 animate-pulse" : "text-white") 
            : "text-slate-500"
        }`}>
          {formatTime(seconds)}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="p-1 hover:bg-slate-800 rounded-md transition-colors"
        >
          {isActive ? (
             <Pause className="w-4 h-4 text-amber-500" />
          ) : (
             <Play className="w-4 h-4 text-green-500" />
          )}
        </button>
        <button 
          onClick={() => { setSeconds(defaultTime); setIsActive(false); }}
          className="p-1 hover:bg-slate-800 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}