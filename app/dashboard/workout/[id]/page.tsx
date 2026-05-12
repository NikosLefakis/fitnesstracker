import ExerciseSearch from "@/components/ExerciseSearch";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, Dumbbell } from "lucide-react";
import SetEditor from "./SetEditor";
import RestTimer from "./RestTimer"; // 1. Προσθήκη του Import
import { addExercise, deleteExercise } from "./actions";

export default async function WorkoutPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const resolvedParams = await params;
  const workoutId = resolvedParams.id;

  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: { sets: { orderBy: { id: 'asc' } } },
      },
    },
  });

  if (!workout || workout.userId !== userId) {
    redirect("/dashboard");
  }

  const addExerciseWithId = addExercise.bind(null, workoutId);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Πίσω στο Dashboard
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-extrabold text-white">{workout.name}</h1>
          <p className="text-slate-500 text-sm">{workout.date.toLocaleDateString('el-GR')}</p>
        </div>
      </div>

      {/* ΠΡΟΣΘΗΚΗ ΑΣΚΗΣΗΣ */}
      <section className="relative z-20 mb-10 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          Νέα Άσκηση
        </h2>
        <form action={addExerciseWithId} className="flex flex-col sm:flex-row gap-3">
  
          {/* Το νέο μας Component! */}
          <ExerciseSearch />

          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex-shrink-0">
            Προσθήκη
          </button>
        </form>
      </section>

      {/* ΛΙΣΤΑ ΑΣΚΗΣΕΩΝ */}
      <div className="space-y-6">
        {workout.exercises.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 bg-slate-900/20">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Πρόσθεσε μια άσκηση για να ξεκινήσεις!</p>
          </div>
        ) : (
          workout.exercises.map((exercise) => (
            <div key={exercise.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              
              {/* Header Άσκησης με RestTimer */}
              <div className="bg-slate-800/40 px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{exercise.name}</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* 2. Εμφάνιση του RestTimer */}
                  <RestTimer />

                  <form action={deleteExercise.bind(null, exercise.id, workoutId)}>
                    <button type="submit" className="text-slate-500 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Ο Editor των Σετ (Client Component) */}
              <SetEditor exercise={exercise} workoutId={workoutId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}