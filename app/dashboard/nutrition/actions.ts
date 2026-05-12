"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addMeal(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const foodName = formData.get("foodName") as string;
  const calories = parseInt(formData.get("calories") as string) || 0;
  const protein = parseInt(formData.get("protein") as string) || 0;
  const carbs = parseInt(formData.get("carbs") as string) || 0; // ΝΕΟ
  const fat = parseInt(formData.get("fat") as string) || 0;     // ΝΕΟ
  const mealType = formData.get("mealType") as string;

  try {
    await prisma.meal.create({
      data: { userId, foodName, calories, protein, carbs, fat, name: mealType },
    });
    revalidatePath("/dashboard/nutrition");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save meal" };
  }
}

export async function deleteMeal(mealId: string) {
  try {
    await prisma.meal.delete({
      where: { id: mealId },
    });
    revalidatePath("/dashboard/nutrition");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete meal" };
  }
}

export async function updateMeal(mealId: string, formData: FormData) {
  const foodName = formData.get("foodName") as string;
  const calories = parseInt(formData.get("calories") as string) || 0;
  const protein = parseInt(formData.get("protein") as string) || 0;
  const carbs = parseInt(formData.get("carbs") as string) || 0; // ΝΕΟ
  const fat = parseInt(formData.get("fat") as string) || 0;     // ΝΕΟ
  const mealType = formData.get("mealType") as string;

  try {
    await prisma.meal.update({
      where: { id: mealId },
      data: { foodName, calories, protein, carbs, fat, name: mealType },
    });
    revalidatePath("/dashboard/nutrition");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update meal" };
  }
}