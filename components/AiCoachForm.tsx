"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Download, Send, Bot, Dumbbell } from "lucide-react";

export default function AiCoachForm() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    goal: "Αύξηση Δύναμης (Strength/Hypertrophy)",
    experience: "Προχωρημένος",
    daysPerWeek: "3",
    equipment: "Πλήρης εξοπλισμός γυμναστηρίου",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Κάτι πήγε στραβά");
      
      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error(error);
      alert("Προέκυψε σφάλμα. Δοκίμασε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("ai-response-content");
    if (!element) return;

    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt : any =  {
      margin: [10, 10, 10, 10],
      filename: 'My_Workout_Plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        // Εδώ αναγκάζουμε το background να είναι λευκό για το PDF
        backgroundColor: "#ffffff" 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Προσωρινή αλλαγή στυλ για την εξαγωγή ώστε να φαίνονται μαύρα τα γράμματα στο λευκό χαρτί
    element.style.color = "#000000";
    element.style.padding = "20px";

    await html2pdf().set(opt).from(element).save();

    // Επαναφορά του στυλ για το dark mode του app
    element.style.color = "";
    element.style.padding = "";
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 shadow-xl shadow-blue-900/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-white">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Στόχος</label>
            <select 
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option>Αύξηση Δύναμης (Strength/Hypertrophy)</option>
              <option>Απώλεια Λίπους (Γράμμωση)</option>
              <option>Αντοχή & Κοντισιόνινγκ</option>
              <option>Συντήρηση & Υγεία</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Εμπειρία</label>
            <select 
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option>Αρχάριος (0-1 χρόνο)</option>
              <option>Μέσος (1-3 χρόνια)</option>
              <option>Προχωρημένος (3+ χρόνια)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ημέρες / Εβδομάδα</label>
            <select 
              value={formData.daysPerWeek}
              onChange={(e) => setFormData({...formData, daysPerWeek: e.target.value})}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Εξοπλισμός</label>
            <input 
              type="text"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="π.χ. Μόνο βαράκια, Λάστιχα..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-blue-900/40 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Φόρτωση AI...</>
          ) : (
            <><Send className="w-5 h-5" /> Δημιουργία Προγράμματος</>
          )}
        </button>
      </form>

      {response && (
        <div className="bg-slate-900/80 border border-blue-500/30 p-8 rounded-[2rem] shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-2 text-white">
              <Bot className="w-6 h-6 text-blue-400" /> Το Πρόγραμμά σου
            </h3>
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-sm transition-colors"
            >
              <Download className="w-4 h-4" /> PDF Export
            </button>
          </div>
          
          {/* Το περιεχόμενο που θα μετατραπεί σε PDF */}
          <div 
            id="ai-response-content" 
            className="prose prose-invert prose-blue max-w-none 
                       prose-headings:text-blue-400 prose-headings:font-black 
                       prose-p:text-slate-300 prose-li:text-slate-300
                       prose-strong:text-white prose-hr:border-slate-800"
          >
            <div className="mb-6 hidden pdf-only:block">
               <h1 className="text-3xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2">AI WORKOUT PLAN</h1>
               <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Generated by Fitness AI Coach</p>
            </div>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}