"use client";

import { useState, useEffect } from "react";
import { 
  Utensils, Plus, Flame, Beef, Zap, ChevronLeft, X, Save, 
  Coffee, Sun, Moon, Salad, Trash2, Pencil, Wheat, Droplets, 
  Search, Loader2 
} from "lucide-react";
import { addMeal, deleteMeal, updateMeal } from "./actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WaterTracker from "@/components/WaterTracker";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NutritionClient({ userData, initialMeals }: any) {
  const meals = initialMeals;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formValues, setFormValues] = useState({ foodName: "", calories: "", protein: "", carbs: "", fat: "" });
  const [quantity, setQuantity] = useState<string>("100");
  const [baseNutrients, setBaseNutrients] = useState<any>(null);

  useEffect(() => {
    if (searchQuery.length < 3 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&search_simple=1&action=process&json=1&page_size=10`);
        const data = await res.json();

        if (data.products) {
          const mappedData = data.products
            .filter((p: any) => p.product_name && p.nutriments && p.nutriments['energy-kcal_100g']) 
            .map((p: any) => ({
              name: p.product_name,
              calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
              protein: Math.round(p.nutriments.proteins_100g || 0),
              carbs: Math.round(p.nutriments.carbohydrates_100g || 0),
              fat: Math.round(p.nutriments.fat_100g || 0),
            }));

          const uniqueData = Array.from(new Map(mappedData.map((item: any) => [item.name, item])).values());
          setSuggestions(uniqueData.slice(0, 5));
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showSuggestions]);

  const handleAddNew = () => {
    setEditingMeal(null);
    setFormValues({ foodName: "", calories: "", protein: "", carbs: "", fat: "" });
    setSearchQuery("");
    setQuantity("100");
    setBaseNutrients(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το γεύμα;")) await deleteMeal(id);
  };

  const handleFoodSelect = (food: any) => {
    setBaseNutrients(food);
    setQuantity("100");
    setFormValues({
      foodName: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
    });
    setSearchQuery(food.name);
    setShowSuggestions(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    const numQ = Number(newQuantity);
    if (baseNutrients && numQ > 0) {
      setFormValues({
        ...formValues,
        calories: Math.round((baseNutrients.calories * numQ) / 100).toString(),
        protein: Math.round((baseNutrients.protein * numQ) / 100).toString(),
        carbs: Math.round((baseNutrients.carbs * numQ) / 100).toString(),
        fat: Math.round((baseNutrients.fat * numQ) / 100).toString(),
      });
    }
  };

  const weight = userData?.weight || 80;
  const age = userData?.age || 25;
  const gender = userData?.gender || "MALE";
  const goal = userData?.trainingGoal || "ΥΠΕΡΤΡΟΦΙΑ";
  const days = userData?.daysPerWeek || 3;

  let baseBmr = (10 * weight) + (6.25 * (userData?.height || 180)) - (5 * age);
  baseBmr = gender === "MALE" ? baseBmr + 5 : baseBmr - 161;
  const activityFactor = days <= 2 ? 1.375 : days <= 5 ? 1.55 : 1.725;
  
  let targetCalories = baseBmr * activityFactor;
  let targetProtein = weight * 2; 

  if (goal === "ΥΠΕΡΤΡΟΦΙΑ") { targetCalories += 300; targetProtein = weight * 2.2; }
  else if (goal === "ΑΠΩΛΕΙΑ ΛΙΠΟΥΣ") { targetCalories -= 500; targetProtein = weight * 2.4; }

  const calorieGoal = Math.round(targetCalories);
  const proteinGoal = Math.round(targetProtein);
  const fatGoal = Math.round(weight * 0.9);
  const carbsGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);

  const consumedCalories = meals.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
  const consumedProtein = meals.reduce((acc: number, m: any) => acc + (m.protein || 0), 0);
  const consumedCarbs = meals.reduce((acc: number, m: any) => acc + (m.carbs || 0), 0);
  const consumedFat = meals.reduce((acc: number, m: any) => acc + (m.fat || 0), 0);
  const remainingCalories = calorieGoal - consumedCalories;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white relative font-sans">
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Nutrition</h1>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 active:scale-95">
          <Plus className="w-4 h-4" /> ΠΡΟΣΘΗΚΗ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STATS & WATER */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md text-center relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Υπολειπόμενες</p>
            <h2 className={`text-5xl font-black mb-2 transition-colors ${remainingCalories < 0 ? 'text-red-500' : 'text-white'}`}>
              {remainingCalories}
            </h2>
            <p className="text-xs text-slate-500 font-bold italic">από {calorieGoal} kcal</p>
            <div className="mt-8 h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((consumedCalories / calorieGoal) * 100, 100)}%` }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Beef className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Πρωτεΐνη</span>
                </div>
                <span className="text-xs font-bold">{consumedProtein}g / {proteinGoal}g</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min((consumedProtein / proteinGoal) * 100, 100)}%` }} className="h-full bg-indigo-500" /></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Υδατάνθρακες</span>
                </div>
                <span className="text-xs font-bold">{consumedCarbs}g / {carbsGoal}g</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min((consumedCarbs / carbsGoal) * 100, 100)}%` }} className="h-full bg-amber-500" /></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Λιπαρά</span>
                </div>
                <span className="text-xs font-bold">{consumedFat}g / {fatGoal}g</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min((consumedFat / fatGoal) * 100, 100)}%` }} className="h-full bg-emerald-500" /></div>
            </div>
          </div>

          <WaterTracker userWeight={weight} />
        </div>

        {/* RIGHT COLUMN: MEALS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">Σημερινά Γεύματα</h3>
          {meals.length === 0 ? (
             <div className="p-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-center bg-slate-900/20">
               <p className="text-slate-500 font-bold">Καθόλου γεύματα ακόμα.</p>
             </div>
          ) : (
            meals.map((meal: any) => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={meal.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between group relative overflow-hidden gap-4 md:gap-0 transition-all hover:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800"><Flame className="w-5 h-5 text-orange-500" /></div>
                  <div>
                    <h4 className="font-black text-sm uppercase text-white">{meal.foodName}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase">{meal.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-4">
                  <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-400">{meal.protein || 0}g P</span>
                    <span className="text-amber-500">{meal.carbs || 0}g C</span>
                    <span className="text-emerald-500">{meal.fat || 0}g F</span>
                  </div>
                  <p className="text-lg font-black text-white">{meal.calories} <span className="text-[10px] text-slate-500 italic uppercase">kcal</span></p>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-slate-900/90 pl-4 py-2 rounded-l-2xl">
                  <button onClick={() => { 
                    setEditingMeal(meal); 
                    setFormValues({ foodName: meal.foodName, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat });
                    setQuantity(""); 
                    setBaseNutrients(null);
                    setIsModalOpen(true); 
                  }} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(meal.id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase italic text-white">{editingMeal ? "ΕΠΕΞΕΡΓΑΣΙΑ" : "ΝΕΟ ΓΕΥΜΑ"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              
              <form action={async (formData) => {
                const mealCalories = Number(formData.get("calories") || formValues.calories);
                let newTotalCalories = consumedCalories;

                if (editingMeal) {
                  await updateMeal(editingMeal.id, formData);
                  // Αν επεξεργαζόμαστε, αφαιρούμε τις παλιές θερμίδες του γεύματος και βάζουμε τις νέες
                  newTotalCalories = consumedCalories - (editingMeal.calories || 0) + mealCalories;
                  toast.success("Το γεύμα ενημερώθηκε");
                } else {
                  await addMeal(formData);
                  // Αν προσθέτουμε, απλά προσθέτουμε τις νέες θερμίδες
                  newTotalCalories = consumedCalories + mealCalories;
                  toast.success("Το γεύμα προστέθηκε!");
                }
                setIsModalOpen(false);

                // --- SMART CALORIE CLOSING NOTIFICATION ---
                // Ελέγχουμε αν ΠΡΙΝ το γεύμα ήταν ΕΚΤΟΣ στόχου (> 50 θερμίδες διαφορά)
                const wasInGoal = Math.abs(calorieGoal - consumedCalories) <= 50;
                // Ελέγχουμε αν ΜΕΤΑ το γεύμα μπήκε ΣΤΟΝ στόχο (<= 50 θερμίδες διαφορά)
                const isNowInGoal = Math.abs(calorieGoal - newTotalCalories) <= 50;

                // Πετάμε την ειδοποίηση ΜΟΝΟ αν μόλις τώρα έπιασε τον στόχο
                if (!wasInGoal && isNowInGoal) {
                  toast.success("Τέλειος Υπολογισμός! 🎯", {
                    description: `Μόλις έπιασες τον θερμιδικό σου στόχο (${calorieGoal} kcal) με ακρίβεια!`,
                    duration: 6000,
                  });

                  useNotificationStore.getState().addNotification({
                    title: "Τέλειος Υπολογισμός! 🎯",
                    message: `Συγχαρητήρια! Έπιασες τον θερμιδικό σου στόχο (${calorieGoal} kcal) με απόλυτη ακρίβεια. Καλή χώνεψη!`,
                    type: "SUCCESS",
                  });
                }
              }} className="space-y-6">
                
                <div className="grid grid-cols-4 gap-2">
                  {[ { id: 'Breakfast', icon: Coffee, label: 'Πρωινό' }, { id: 'Lunch', icon: Sun, label: 'Μεσημ.' }, { id: 'Dinner', icon: Moon, label: 'Βραδινό' }, { id: 'Snack', icon: Salad, label: 'Snack' } ].map((type) => (
                    <label key={type.id} className="cursor-pointer group">
                      <input type="radio" name="mealType" value={type.label} className="hidden peer" required defaultChecked={editingMeal?.name === type.label} />
                      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-slate-800 bg-slate-950 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 text-slate-400 peer-checked:text-white"><type.icon className="w-5 h-5" /><span className="text-[9px] font-black uppercase">{type.label}</span></div>
                    </label>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Αναζήτηση Φαγητού</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input name="foodName" value={formValues.foodName || searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setFormValues({...formValues, foodName: e.target.value}); setShowSuggestions(true); }} onFocus={() => { if(searchQuery.length > 2) setShowSuggestions(true); }} placeholder="π.χ. Banana ή Κοτόπουλο..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all text-white" required autoComplete="off" />
                    </div>
                    {showSuggestions && searchQuery.length > 2 && (isSearching || suggestions.length > 0) && (
                      <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 flex justify-center items-center gap-2 text-slate-400 text-sm font-bold"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Αναζήτηση...</div>
                        ) : (
                          suggestions.map((food, i) => (
                            <div key={i} onClick={() => handleFoodSelect(food)} className="p-4 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-700/50 last:border-0 text-white">
                              <span className="text-sm font-bold truncate max-w-[70%]">{food.name}</span>
                              <div className="text-right"><span className="block text-xs font-black text-white">{food.calories} kcal</span><span className="block text-[9px] text-slate-400 uppercase tracking-widest">{food.protein}g P | {food.carbs}g C | {food.fat}g F</span></div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ποσότητα (g / ml)</label>
                      <input value={quantity} onChange={handleQuantityChange} type="number" placeholder="π.χ. 150" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all font-bold text-white" />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 ml-2">Συνολικές Θερμίδες</label>
                      <input name="calories" value={formValues.calories} onChange={e => setFormValues({...formValues, calories: e.target.value})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all font-bold text-white" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Πρωτεΐνη</label>
                      <input name="protein" value={formValues.protein} onChange={e => setFormValues({...formValues, protein: e.target.value})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm focus:border-indigo-500 outline-none font-bold text-white" required />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Υδατ/κες</label>
                      <input name="carbs" value={formValues.carbs} onChange={e => setFormValues({...formValues, carbs: e.target.value})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm focus:border-amber-500 outline-none font-bold text-white" required />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Λιπαρά</label>
                      <input name="fat" value={formValues.fat} onChange={e => setFormValues({...formValues, fat: e.target.value})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm focus:border-emerald-500 outline-none font-bold text-white" required />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Save className="w-5 h-5" /> {editingMeal ? "ΑΠΟΘΗΚΕΥΣΗ ΑΛΛΑΓΩΝ" : "ΑΠΟΘΗΚΕΥΣΗ"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}