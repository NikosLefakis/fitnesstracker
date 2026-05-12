"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

const EXERCISE_LIBRARY = [
  "Bench Press", "Incline Bench Press", "Decline Bench Press",
  "Squat", "Front Squat", "Bulgarian Split Squat",
  "Deadlift", "Romanian Deadlift",
  "Pull Up", "Lat Pulldown", "Barbell Row", "Dumbbell Row",
  "Overhead Press", "Lateral Raise", "Front Raise",
  "Bicep Curl", "Hammer Curl", "Tricep Extension", "Tricep Pushdown",
  "Leg Press", "Leg Extension", "Leg Curl", "Calf Raise", "Crunch"
];

export default function ExerciseSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Κλείνει το dropdown αν κάνεις κλικ οπουδήποτε αλλού
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => 
    ex.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div 
        className="relative cursor-pointer"
        onClick={() => setIsOpen(true)} // Σιγουρεύουμε ότι ανοίγει με το κλικ στο div
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
        
        <input 
          type="text" 
          placeholder="Αναζήτηση ή πληκτρολόγηση..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelected(""); 
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-10 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner relative z-10"
          autoComplete="off"
        />

        {/* Εικονίδιο βέλους για να καταλαβαίνει ο χρήστης ότι είναι dropdown */}
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Το κρυφό input που διαβάζει η φόρμα */}
      <input 
        type="hidden" 
        name="exerciseName" 
        value={selected || query} 
        required 
      />

      {/* Το Dropdown Menu */}
      {isOpen && filteredExercises.length > 0 && (
        <ul className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filteredExercises.map((ex) => (
            <li 
              key={ex}
              // Χρησιμοποιούμε onMouseDown αντί για onClick γιατί το onMouseDown εκτελείται πριν χαθεί το focus από το input
              onMouseDown={(e) => {
                e.preventDefault(); // Αποτρέπει το input από το να χάσει το focus
                setQuery(ex);
                setSelected(ex);
                setIsOpen(false);
              }}
              className="px-5 py-3 hover:bg-blue-600 text-slate-200 hover:text-white cursor-pointer transition-colors border-b border-slate-700/50 last:border-0"
            >
              {ex}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}