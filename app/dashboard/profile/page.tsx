import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Τραβάμε τον χρήστη από τη βάση
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return <ProfileClient initialData={user} />;
}