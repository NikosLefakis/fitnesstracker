"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const weight = parseFloat(formData.get("weight") as string) || 0;
  const height = parseFloat(formData.get("height") as string) || 0;
  const age = parseInt(formData.get("age") as string) || 0;
  const daysPerWeek = parseInt(formData.get("daysPerWeek") as string) || 3;
  const trainingGoal = formData.get("trainingGoal") as string;
  const experience = formData.get("experience") as string;
  const gender = formData.get("gender") as string;

  await prisma.user.upsert({
    where: { id: userId },
    update: { weight, height, age, daysPerWeek, trainingGoal, experience, gender },
    create: { id: userId, weight, height, age, daysPerWeek, trainingGoal, experience, gender },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}