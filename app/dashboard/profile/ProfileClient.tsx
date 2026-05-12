"use client";

import { useState, useEffect } from "react";
import { User, Weight, Ruler, Target, Calendar, Save, ChevronLeft, Activity, UserCircle, Zap, Beef, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { updateProfile } from "./actions";

export default function ProfileClient({ initialData }: { initialData: any }) {
  // States από τη βάση
  const [weight, setWeight] = useState<number | "">(initialData?.weight || 80);
  const [height, setHeight] = useState<number | "">(initialData?.height || 180);
  const [age, setAge] = useState<number | "">(initialData?.age || 25);
  const [gender, setGender] = useState<string>(initialData?.gender || "MALE");
  const [experience, setExperience] = useState<string>(initialData?.experience || "INTERMEDIATE");
  const [goal, setGoal] = useState<string>(initialData?.trainingGoal || "ΥΠΕΡΤΡΟΦΙΑ");
  const [days, setDays] = useState<number>(initialData?.daysPerWeek || 3);

  // States για υπολογισμούς & UI
  const [bmi, setBmi] = useState<number>(0);
  const [bmr, setBmr] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);

  // Live υπολογισμοί βασισμένοι στη στρατηγική του στόχου
  useEffect(() => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const d = Number(days);

    if (w > 0 && h > 0 && a > 0) {
      // 1. BMI
      setBmi(parseFloat((w / ((h / 100) ** 2)).toFixed(1)));

      // 2. BMR & TDEE Logic
      let baseBmr = (10 * w) + (6.25 * h) - (5 * a);
      baseBmr = gender === "MALE" ? baseBmr + 5 : baseBmr - 161;

      const activityFactor = d <= 2 ? 1.375 : d <= 5 ? 1.55 : 1.725;
      let targetCalories = baseBmr * activityFactor;
      let targetProtein = w * 2;

      // 3. Goal Customization
      if (goal === "ΥΠΕΡΤΡΟΦΙΑ") {
        targetCalories += 300;
        targetProtein = w * 2.2;
      } else if (goal === "ΑΠΩΛΕΙΑ ΛΙΠΟΥΣ") {
        targetCalories -= 500;
        targetProtein = w * 2.4;
      } else if (goal === "ΔΥΝΑΜΗ") {
        targetCalories += 150;
        targetProtein = w * 2;
      } else if (goal === "ΑΝΤΟΧΗ") {
        targetCalories += 200;
        targetProtein = w * 1.6;
      }

      setBmr(Math.round(targetCalories));
      setProtein(Math.round(targetProtein));
    }
  }, [weight, height, age, gender, goal, days]);

  // Handle Submit με Toast
  async function handleSubmit(formData: FormData) {
    const result = await updateProfile(formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-white relative">
      
      {/* --- PROFESSIONAL TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 border border-emerald-400/50">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Το προφίλ ενημερώθηκε επιτυχώς!</span>
          </div>
        </div>
      )}

      <form action={handleSubmit}>
        <input type="hidden" name="trainingGoal" value={goal} />
        <input type="hidden" name="experience" value={experience} />
        <input type="hidden" name="gender" value={gender} />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <h1 className="text-3xl font-black tracking-tight italic">PROFILE</h1>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/40 active:scale-95 group">
            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" /> ΑΠΟΘΗΚΕΥΣΗ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMN 1: BODY DATA */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> ΣΩΜΑΤΙΚΑ ΣΤΟΙΧΕΙΑ
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">ΒΑΡΟΣ (kg)</label>
                  <input 
                    name="weight" type="number" value={weight} onFocus={(e) => e.target.select()}
                    onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))} 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">ΥΨΟΣ (cm)</label>
                  <input 
                    name="height" type="number" value={height} onFocus={(e) => e.target.select()}
                    onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold text-slate-500 ml-1">ΗΛΙΚΙΑ</label>
                <input 
                  name="age" type="number" value={age} onFocus={(e) => e.target.select()}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1">ΦΥΛΟ</label>
                <div className="flex gap-2 p-1 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  {['MALE', 'FEMALE'].map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${gender === g ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                      {g === 'MALE' ? 'ΑΝΔΡΑΣ' : 'ΓΥΝΑΙΚΑ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: TRAINING GOALS */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md h-full">
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Target className="w-4 h-4" /> ΣΤΟΧΟΙ & ΕΜΠΕΙΡΙΑ
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">ΕΠΙΠΕΔΟ ΕΜΠΕΙΡΙΑΣ</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['BEGINNER', 'INTERMEDIATE', 'PRO'].map((lvl) => (
                      <button key={lvl} type="button" onClick={() => setExperience(lvl)} className={`py-3 rounded-xl text-[9px] font-black border transition-all ${experience === lvl ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">ΚΥΡΙΟΣ ΣΤΟΧΟΣ</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["ΥΠΕΡΤΡΟΦΙΑ", "ΔΥΝΑΜΗ", "ΑΠΩΛΕΙΑ ΛΙΠΟΥΣ", "ΑΝΤΟΧΗ"].map((g) => (
                      <button key={g} type="button" onClick={() => setGoal(g)} className={`py-3 px-2 rounded-xl text-[9px] font-black border transition-all ${goal === g ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">ΠΡΟΠΟΝΗΣΕΙΣ / ΕΒΔΟΜΑΔΑ</label>
                  <select 
                    name="daysPerWeek" 
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold appearance-none cursor-pointer text-sm"
                  >
                   {[2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d} className="bg-slate-900">
                        {d} φορές την εβδομάδα
                    </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">BMI</p>
              <h5 className={`text-2xl font-black ${bmi > 25 ? 'text-orange-500' : 'text-emerald-500'}`}>{bmi}</h5>
            </div>
            <Activity className={`w-5 h-5 ${bmi > 25 ? 'text-orange-500' : 'text-emerald-500'}`} />
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Στόχος Θερμίδων</p>
              <h5 className="text-2xl font-black text-white">{bmr} <span className="text-[10px] text-slate-500 font-normal italic">kcal</span></h5>
            </div>
            <Zap className="w-5 h-5 text-orange-400" />
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Πρωτεΐνη</p>
              <h5 className="text-2xl font-black text-white">{protein} <span className="text-[10px] text-slate-500 font-normal italic">g</span></h5>
            </div>
            <Beef className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* --- SMART COACH FOOTER --- */}
        <div className="mt-8 p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 rounded-[2.5rem] relative overflow-hidden group">
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">Η Στρατηγική σου για {goal}</h4>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xl italic">
                {goal === "ΥΠΕΡΤΡΟΦΙΑ" && `Έχουμε προσθέσει θερμίδες στο πλάνο σου για μυϊκή ανάπτυξη. Στόχος: ${protein}g πρωτεΐνης.`}
                {goal === "ΑΠΩΛΕΙΑ ΛΙΠΟΥΣ" && `Έχουμε δημιουργήσει θερμιδικό έλλειμμα. Η πρωτεΐνη παραμένει υψηλή (${protein}g) για προστασία των μυών.`}
                {goal === "ΔΥΝΑΜΗ" && "Εστιάζουμε σε θερμίδες συντήρησης με boost για ενέργεια στα βαριά sets."}
                {goal === "ΑΝΤΟΧΗ" && "Το πλάνο δίνει έμφαση στην αναπλήρωση ενέργειας και τη μέση πρόσληψη πρωτεΐνης."}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] -mr-16 -mt-16"></div>
        </div>
      </form>
    </div>
  );
}