"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Ελέγχουμε αν υπάρχει το workout και αν ανήκει στον χρήστη
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
  });

  if (!workout || workout.userId !== userId) {
    throw new Error("Δεν βρέθηκε η προπόνηση ή δεν έχεις δικαίωμα.");
  }

  // 2. Βρίσκουμε όλες τις ασκήσεις αυτής της προπόνησης
  const exercises = await prisma.exerciseInstance.findMany({
    where: { workoutId: workoutId }
  });
  
  // Φτιάχνουμε μια λίστα με τα ID των ασκήσεων
  const exerciseIds = exercises.map(ex => ex.id);

  // 3. Διαγράφουμε ΠΡΩΤΑ όλα τα σετ που ανήκουν σε αυτές τις ασκήσεις
  if (exerciseIds.length > 0) {
    await prisma.set.deleteMany({
      where: { exerciseInstanceId: { in: exerciseIds } }
    });
  }

  // 4. Διαγράφουμε τις Ασκήσεις
  await prisma.exerciseInstance.deleteMany({
    where: { workoutId: workoutId }
  });

  // 5. ΤΕΛΟΣ: Διαγράφουμε την προπόνηση (τώρα που είναι άδεια, δεν θα χτυπήσει error!)
  await prisma.workout.delete({
    where: { id: workoutId },
  });

  revalidatePath("/dashboard");
}
export async function getExerciseProgress(exerciseName: string) {
  const { userId } = await auth();
  if (!userId) return [];

  const exercises = await prisma.exerciseInstance.findMany({
    where: {
      name: exerciseName,
      workout: { userId: userId }
    },
    include: {
      workout: true,
      sets: true
    },
    orderBy: { workout: { date: 'asc' } }
  });

  return exercises.map(ex => {
    // Υπολογισμός του καλύτερου 1RM για αυτή την προπόνηση
    const best1RM = ex.sets.reduce((max, set) => {
      // Τύπος Brzycki: Weight * (36 / (37 - Reps))
      const current1RM = set.reps > 0 ? set.weight * (36 / (37 - set.reps)) : 0;
      return Math.max(max, current1RM);
    }, 0);

    return {
      date: ex.workout.date.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' }),
      oneRM: Math.round(best1RM)
    };
  });
}


export async function createTemplateWorkout(templateName: string, exerciseNames: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Φτιάχνουμε την Προπόνηση
  const workout = await prisma.workout.create({
    data: {
      userId,
      name: templateName,
    },
  });

  // 2. Προσθέτουμε όλες τις ασκήσεις του Template στην προπόνηση
  // Χρησιμοποιούμε Promise.all για να εκτελεστούν όλα τα creates ταυτόχρονα
  if (exerciseNames.length > 0) {
    await Promise.all(
      exerciseNames.map((name) =>
        prisma.exerciseInstance.create({
          data: {
            workoutId: workout.id,
            name: name,
          },
        })
      )
    );
  }

  // 3. Αφού δημιουργηθούν όλα, στέλνουμε τον χρήστη κατευθείαν μέσα στην προπόνηση!
  redirect(`/dashboard/workout/${workout.id}`);
}