"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

interface RetentionGuardProps {
  lastWorkoutDate: Date | null;
}

export default function RetentionGuard({ lastWorkoutDate }: RetentionGuardProps) {
  useEffect(() => {
    // Αν δεν έχει κάνει ποτέ προπόνηση, αγνοούμε τον έλεγχο
    if (!lastWorkoutDate) return;

    const today = new Date();
    const lastWorkout = new Date(lastWorkoutDate);
    
    // Υπολογισμός διαφοράς σε ημέρες
    const diffTime = today.getTime() - lastWorkout.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Χρησιμοποιούμε το sessionStorage για να σκάσει ΜΟΝΟ μια φορά όταν ανοίξει το app 
    // και να μην τον πρήζει σε κάθε αλλαγή σελίδας (refresh).
    const hasSeenReminder = sessionStorage.getItem("retention_toast_shown");

    if (diffDays > 2 && !hasSeenReminder) {
      // Βάζουμε ένα μικρό delay 1.5 δευτερόλεπτο για να προλάβει να φορτώσει το UI του Dashboard
      setTimeout(() => {
        toast.warning("Μας έλειψες! 🛡️", {
          description: `Έχεις ${diffDays} μέρες να κάνεις προπόνηση. Ακόμα και 20 λεπτά σήμερα μετράνε!`,
          duration: 8000, // Να μείνει λίγο παραπάνω στην οθόνη
        });
        
        useNotificationStore.getState().addNotification({
          title: "Ώρα για δράση! 🏋️",
          message: `Το σερί σου κινδυνεύει! Έχεις να προπονηθείς ${diffDays} μέρες. Μην χάσεις τον ρυθμό σου.`,
          type: "WARNING",
        });
        
        sessionStorage.setItem("retention_toast_shown", "true");
      }, 1500);
    }
  }, [lastWorkoutDate]);

  // Το component δεν σχεδιάζει τίποτα στην οθόνη!
  return null; 
}