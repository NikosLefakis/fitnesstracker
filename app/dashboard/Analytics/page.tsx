import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ExerciseChart from "../../../components/ExerciseCharts";
import { getExerciseProgress } from "../actions";
import Link from "next/link";
import { ChevronLeft, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Ορίζουμε ποιες ασκήσεις θέλουμε να παρακολουθούμε (μπορείς να τις κάνεις δυναμικές αργότερα)
  const trackedExercises = ["Bench Press", "Squat", "Deadlift"];
  
  const chartsData = await Promise.all(
    trackedExercises.map(async (name) => ({
      name,
      data: await getExerciseProgress(name)
    }))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/dashboard" className="text-slate-500 hover:text-white flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Πίσω
          </Link>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <TrendingUp className="text-blue-500 w-8 h-8" />
            Analytics
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chartsData.map((chart) => (
          <ExerciseChart key={chart.name} name={chart.name} data={chart.data} />
        ))}
      </div>
    </div>
  );
}