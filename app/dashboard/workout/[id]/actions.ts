"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Προσθήκη νέας άσκησης στην προπόνηση
 */
export async function addExercise(workoutId: string, formData: FormData) {
  const name = formData.get("exerciseName")?.toString();
  if (!name) return;

  try {
    // Χρησιμοποιούμε exerciseInstance όπως φαίνεται στο Prisma Studio
    await prisma.exerciseInstance.create({
      data: {
        workoutId: workoutId,
        name: name,
      },
    });

    revalidatePath(`/dashboard/workout/${workoutId}`);
  } catch (error) {
    console.error("Σφάλμα κατά τη δημιουργία άσκησης:", error);
  }
}

/**
 * Προσθήκη νέου σετ σε μια άσκηση
 */
export async function addSet(exerciseId: string, workoutId: string) {
  try {
    // 1. Βρίσκουμε το τελευταίο σετ αυτής της άσκησης
    const lastSet = await prisma.set.findFirst({
      where: { exerciseInstanceId: exerciseId },
      orderBy: { id: 'desc' }, // Παίρνουμε το πιο πρόσφατο
    });

    // 2. Δημιουργούμε το νέο σετ με τις τιμές του προηγούμενου (ή 0 αν είναι το πρώτο)
    await prisma.set.create({
      data: {
        exerciseInstance: {
          connect: { id: exerciseId }
        },
        weight: lastSet ? lastSet.weight : 0,
        reps: lastSet ? lastSet.reps : 0,
      },
    });

    revalidatePath(`/dashboard/workout/${workoutId}`);
  } catch (error) {
    console.error("Σφάλμα κατά την προσθήκη έξυπνου σετ:", error);
  }
}
/**
 * Ενημέρωση των τιμών ενός σετ (Auto-save)
 */
export async function updateSet(setId: string, workoutId: string, weight: number, reps: number) {
  try {
    await prisma.set.update({
      where: { id: setId },
      data: { weight, reps },
    });

    revalidatePath(`/dashboard/workout/${workoutId}`);
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση σετ:", error);
  }
}

/**
 * Διαγραφή ενός συγκεκριμένου σετ
 */
export async function deleteSet(setId: string, workoutId: string) {
  try {
    await prisma.set.delete({
      where: { id: setId },
    });

    revalidatePath(`/dashboard/workout/${workoutId}`);
  } catch (error) {
    console.error("Σφάλμα κατά τη διαγραφή σετ:", error);
  }
}

/**
 * Διαγραφή ολόκληρης της άσκησης
 */
export async function deleteExercise(exerciseId: string, workoutId: string) {
  try {
    // Χρησιμοποιούμε exerciseInstance για τη διαγραφή
    await prisma.exerciseInstance.delete({
      where: { id: exerciseId },
    });

    revalidatePath(`/dashboard/workout/${workoutId}`);
  } catch (error) {
    console.error("Σφάλμα κατά τη διαγραφή άσκησης:", error);
  }
}