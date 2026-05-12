import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import NutritionClient from "./NutritionClient";
import { redirect } from "next/navigation";

export default async function NutritionPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Παίρνουμε τον χρήστη και τα σημερινά γεύματα
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      meals: {
        where: {
          createdAt: { gte: today }
        }
      }
    }
  });

  return <NutritionClient userData={user} initialMeals={user?.meals || []} />;
}