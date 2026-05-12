import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Plus, Dumbbell, History, ChevronRight, Activity, Trash2, Calendar, TrendingUp, Clock } from "lucide-react";
import { getExerciseProgress } from "./actions"; 
import ExerciseChart from "../../components/ExerciseCharts";
import { deleteWorkout, createTemplateWorkout } from "./actions";
import GymTipCarousel from "@/components/GymTipCarousel";
import RetentionGuard from "@/components/RetentionGuard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 1. Φέρνουμε όλες τις προπονήσεις του χρήστη, ταξινομημένες από την πιο πρόσφατη
  const workouts = await prisma.workout.findMany({
    where: { userId },
    include: {
      _count: {
        select: { exercises: true },
      },
    },
    orderBy: { date: "desc" },
  });

  // Βρίσκουμε την τελευταία ημερομηνία προπόνησης (αν υπάρχει) για το Retention Guard
  const lastWorkoutDate = workouts.length > 0 ? workouts[0].date : null;

  // 2. Υπολογισμός Stats Εβδομάδας
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Φέρνουμε το προφίλ του χρήστη (user settings)
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Φιλτράρουμε τις προπονήσεις που έγιναν τις τελευταίες 7 ημέρες από τα data που ήδη έχουμε (για οικονομία στη βάση)
  const recentWorkouts = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);

  // Υπολογίζουμε τις μοναδικές μέρες που έκανε προπόνηση την τελευταία εβδομάδα
  const activeDaysCount = new Set(
    recentWorkouts.map((w) => new Date(w.date).toDateString())
  ).size;

  const goalDays = user?.daysPerWeek || 3; 
  const progressPercentage = (activeDaysCount / goalDays) * 100;

  const chartData = await getExerciseProgress("Bench Press");

  async function createWorkout(formData: FormData) {
    "use server";
    const { userId } = await auth();
    if (!userId) return;
    const workoutName = formData.get("workoutName")?.toString() || "Νέα Προπόνηση";
    await prisma.workout.create({
      data: { userId, name: workoutName },
    });
    revalidatePath("/dashboard");
  }

  // Ημερομηνία για το Header
  const today = new Date().toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="max-w-6xl w-full mx-auto px-6 pt-6 pb-12 text-white relative">
      
      {/* ΕΔΩ ΜΠΑΙΝΕΙ ΤΟ ΑΟΡΑΤΟ RETENTION GUARD COMPONENT */}
      <RetentionGuard lastWorkoutDate={lastWorkoutDate} />

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">{today}</p>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Γεια σου και πάλι! 👋
          </h1>
          <p className="text-slate-400 text-lg mt-1">
            Είσαι έτοιμος να σπάσεις τα προσωπικά σου ρεκόρ σήμερα;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: CREATE & HISTORY */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* CREATE WORKOUT CARD & TEMPLATES */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 bg-blue-600/10 w-40 h-40 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Plus className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Ξεκίνα Προπόνηση</h2>
            </div>

            <form action={createWorkout} className="space-y-4 mb-10">
              <div className="relative">
                <Dumbbell className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="text" 
                  name="workoutName"
                  placeholder="Όνομα προπόνησης (π.χ. Chest Focus)..."
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                ΕΝΑΡΞΗ  ΠΡΟΠΟΝΗΣΗΣ
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* QUICK TEMPLATES */}
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> QUICK START TEMPLATES
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <form action={createTemplateWorkout.bind(null, "Push Day", ["Bench Press", "Overhead Press", "Incline Bench Press", "Tricep Extension"])}>
                  <button type="submit" className="w-full group bg-slate-950/40 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl transition-all text-left active:scale-[0.98]">
                    <span className="block font-bold text-indigo-400 mb-1 group-hover:text-white transition-colors">Push Day</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4 Ασκήσεις</span>
                  </button>
                </form>

                <form action={createTemplateWorkout.bind(null, "Pull Day", ["Deadlift", "Pull Up", "Barbell Row", "Bicep Curl"])}>
                  <button type="submit" className="w-full group bg-slate-950/40 hover:bg-emerald-600/10 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition-all text-left active:scale-[0.98]">
                    <span className="block font-bold text-emerald-400 mb-1 group-hover:text-white transition-colors">Pull Day</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4 Ασκήσεις</span>
                  </button>
                </form>

                <form action={createTemplateWorkout.bind(null, "Leg Day", ["Squat", "Leg Press", "Leg Extension", "Calf Raise"])}>
                  <button type="submit" className="w-full group bg-slate-950/40 hover:bg-rose-600/10 border border-slate-800 hover:border-rose-500/50 p-4 rounded-2xl transition-all text-left active:scale-[0.98]">
                    <span className="block font-bold text-rose-400 mb-1 group-hover:text-white transition-colors">Leg Day</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4 Ασκήσεις</span>
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* WORKOUT HISTORY */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-blue-500" />
                Ιστορικό Προπονήσεων
              </h3>
            </div>

            <div className="space-y-4">
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <div key={workout.id} className="group relative bg-slate-900/30 hover:bg-slate-800/40 border border-slate-800/60 hover:border-blue-500/30 rounded-[2rem] transition-all duration-300 overflow-hidden">
                    <div className="p-6 flex items-center justify-between">
                      <Link href={`/dashboard/workout/${workout.id}`} className="flex-1 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-blue-500/20 group-hover:scale-105 transition-all">
                          <Clock className="text-slate-600 group-hover:text-blue-500 w-6 h-6 transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{workout.name}</h4>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                              <Calendar className="w-3.5 h-3.5" />
                              {workout.date.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                              {workout._count.exercises} ΑΣΚΗΣΕΙΣ
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="flex items-center gap-2">
                         <form action={deleteWorkout.bind(null, workout.id)}>
                          <button type="submit" className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[2rem]">
                  <Dumbbell className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Δεν έχεις καταγράψει ακόμα κάποια προπόνηση.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* WEEKLY GOAL */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <Activity className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="text-white/60 font-black mb-1 uppercase text-[10px] tracking-[0.2em]">ΣΤΟΧΟΣ ΕΒΔΟΜΑΔΑΣ</h4>
            <p className="text-3xl font-black text-white italic">{activeDaysCount} / {goalDays} <span className="text-sm font-normal not-italic opacity-70 ml-1 text-blue-100">ημέρες</span></p>
            <div className="mt-6 h-2.5 w-full bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* ANALYTICS PREVIEW */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-6 backdrop-blur-sm flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-6 px-2">
              <h4 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                ΠΡΟΟΔΟΣ 1RM
              </h4>
              <Link href="/dashboard/analytics" className="text-[10px] bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-black uppercase tracking-tighter">
                VIEW ALL
              </Link>
            </div>
            
            <div className="flex-1 w-full min-h-[250px] max-h-[250px] overflow-hidden">
              <ExerciseChart name="Bench Press" data={chartData} />
            </div>
          </div>

          {/* GYM TIP CAROUSEL */}
          <GymTipCarousel />
        </div>

      </div>
    </div>
  );
}