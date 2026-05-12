"use client";

import { Plus, Trash2 } from "lucide-react";
import { addSet, updateSet, deleteSet } from "./actions";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

interface SetEditorProps {
  exercise: any;
  workoutId: string;
}

export default function SetEditor({ exercise, workoutId }: SetEditorProps) {
  
  const handleUpdateSet = async (setId: string, newWeight: number, newReps: number, oldWeight: number) => {
    // 1. Αποθήκευση στη βάση 
    await updateSet(setId, workoutId, newWeight, newReps);

    // 2. Υπολογισμός του μέγιστου βάρους στην άσκηση μέχρι εκείνη τη στιγμή
    const currentMaxWeight = exercise.sets.reduce((max: number, s: any) => Math.max(max, s.weight || 0), 0);

    // 3. GAMIFICATION LOGIC: 
    // Σκάει ΜΟΝΟ αν το νέο βάρος είναι > 0, ΜΕΓΑΛΥΤΕΡΟ από το προηγούμενο ρεκόρ,
    // ΚΑΙ αν όντως ο χρήστης άλλαξε το νούμερο (δεν έκανε απλά κλικ μέσα-έξω)
    if (newWeight > 0 && newWeight > currentMaxWeight && newWeight !== oldWeight) {
      
      toast.success("Νέο Personal Best! 🔥", {
        description: `Ανέβηκες στα ${newWeight}kg! Τρομερή δουλειά.`,
        duration: 5000,
      });

      useNotificationStore.getState().addNotification({
        title: "Νέο Personal Best! 🔥",
        message: `Έσπασες το ρεκόρ σου σηκώνοντας ${newWeight}kg στην άσκηση ${exercise.name}.`,
        type: "SUCCESS",
      });
    }
  };

  return (
    <div className="p-6 bg-slate-900/40">
      <div className="space-y-3 mb-4">
        {exercise.sets.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 text-sm">Δεν έχουν καταγραφεί σετ</p>
          </div>
        ) : (
          exercise.sets.map((set: any, index: number) => (
            <div key={set.id} className="flex items-center gap-4 group">
              <span className="text-slate-500 font-bold w-6">{index + 1}</span>
              
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="relative">
                  <input 
                    type="number"
                    placeholder="Kg"
                    defaultValue={set.weight || ""}
                    // Περνάμε και το παλιό βάρος (set.weight) για να γίνει η σύγκριση!
                    onBlur={(e) => handleUpdateSet(set.id, Number(e.target.value), set.reps, set.weight)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-center text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">kg</span>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    placeholder="Reps"
                    defaultValue={set.reps || ""}
                    onBlur={(e) => handleUpdateSet(set.id, set.weight, Number(e.target.value), set.weight)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-center text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">reps</span>
                </div>
              </div>

              <button 
                onClick={() => deleteSet(set.id, workoutId)}
                className="text-slate-600 hover:text-red-500 sm:opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => addSet(exercise.id, workoutId)}
        className="w-full py-3 rounded-xl border border-slate-700 border-dashed text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Προσθήκη Σετ
      </button>
    </div>
  );
}