import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.isPremium) return new NextResponse("Forbidden", { status: 403 });

    const { goal, experience, daysPerWeek, equipment } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Εφόσον η λίστα σου έβγαλε gemini-2.5-flash, χρησιμοποιούμε αυτό!
    // Χρησιμοποιούμε v1beta καθώς τα νέα μοντέλα εμφανίζονται πρώτα εκεί.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      Είσαι ένας κορυφαίος Personal Trainer. Φτιάξε ένα πλήρες εβδομαδιαίο πρόγραμμα γυμναστικής στα Ελληνικά.
      Στόχος: ${goal}
      Επίπεδο: ${experience}
      Ημέρες προπόνησης: ${daysPerWeek}
      Διαθέσιμος Εξοπλισμός: ${equipment}
      
      Μορφοποίηση: Markdown (## για τίτλους ημερών). Δώσε ασκήσεις, σετ και επαναλήψεις.
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error Details:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.error?.message || "API Error" }, 
        { status: response.status }
      );
    }

    if (!data.candidates || !data.candidates[0].content) {
      return NextResponse.json({ error: "Το AI δεν επέστρεψε αποτέλεσμα" }, { status: 500 });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ result: aiText });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}