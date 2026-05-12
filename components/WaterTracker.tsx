"use client";

import { useState } from "react";
import { Droplets, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

interface WaterTrackerProps {
  userWeight: number;
}

export default function WaterTracker({ userWeight }: WaterTrackerProps) {
  const [water, setWater] = useState(0);
  
  // Δυναμικός Στόχος: 35ml ανά κιλό βάρους
  const goal = Math.round(userWeight * 35);
  const progress = Math.min((water / goal) * 100, 100);

  const addWater = (amount: number) => {
    // 1. Υπολογίζουμε τη νέα τιμή ΕΞΩ από το state setter
    const newValue = Math.min(water + amount, 5000);
    const halfGoal = goal / 2;

    // 2. Κάνουμε τους ελέγχους και πετάμε τα side-effects (ειδοποιήσεις)
    if (water < goal && newValue >= goal) {
      toast.success("Στόχος Ενυδάτωσης Επιτεύχθηκε! 💧", {
        description: `Ήπιες ${goal}ml νερό σήμερα. Εξαιρετική δουλειά!`,
        duration: 5000,
      });
      
      useNotificationStore.getState().addNotification({
        title: "Ενυδάτωση 100% 💧",
        message: `Συγχαρητήρια! Έπιασες τον ημερήσιο στόχο σου (${goal}ml).`,
        type: "SUCCESS",
      });
    } 
    else if (water < halfGoal && newValue >= halfGoal) {
      toast.info("Μισός δρόμος! 🌊", {
        description: `Έφτασες τα ${newValue}ml. Συνέχισε έτσι!`,
        duration: 4000,
      });

      useNotificationStore.getState().addNotification({
        title: "Μισός δρόμος! 🌊",
        message: `Έφτασες το 50% του ημερήσιου στόχου ενυδάτωσης. Καλή συνέχεια!`,
        type: "INFO",
      });
    }

    // 3. Στο τέλος, κάνουμε το απλό update στο React State
    setWater(newValue);
  };

  const resetWater = () => setWater(0);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Ενυδάτωση</span>
          </div>
          <button onClick={resetWater} className="text-[9px] font-black text-slate-600 hover:text-red-400 uppercase transition-colors">Reset</button>
        </div>

        <div className="flex items-center justify-between gap-6">
          {/* Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-950" />
              <motion.circle 
                cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * progress) / 100 }}
                className={`${progress >= 100 ? 'text-emerald-500' : 'text-blue-500'} transition-colors duration-500`} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
               <span className="text-lg font-black text-white">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
             <h4 className="text-2xl font-black text-white">{water} <span className="text-xs text-slate-500 font-bold ml-1">ml</span></h4>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter text-left">Στόχος: {goal}ml</p>
             <p className="text-[8px] text-blue-500/50 font-bold uppercase italic tracking-tighter text-left">Βάσει βάρους ({userWeight}kg)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            onClick={() => addWater(250)}
            className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-2xl text-[11px] font-black transition-all active:scale-95 border border-blue-500/20"
          >
            +250ml
          </button>
          <button 
            onClick={() => addWater(500)}
            className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl text-[11px] font-black transition-all border border-white/5 active:scale-95"
          >
            +500ml
          </button>
        </div>
      </div>
    </div>
  );
}