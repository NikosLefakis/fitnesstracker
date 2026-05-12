import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma"; // Προσοχή: βεβαιώσου ότι αυτό το path είναι σωστό για το project σου

// Αρχικοποίηση του Stripe με το Secret Key μας
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2024-04-10", 
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    // Αν δεν είναι συνδεδεμένος, δεν μπορεί να αγοράσει!
    if (!userId) {
      return new NextResponse("Μη εξουσιοδοτημένη πρόσβαση", { status: 401 });
    }

    // Βρίσκουμε τον χρήστη στη βάση μας
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new NextResponse("Ο χρήστης δεν βρέθηκε", { status: 404 });
    }

    // Δημιουργία του Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      // Περνάμε το ID του χρήστη μας στα metadata για να ξέρουμε ποιος πλήρωσε 
      // όταν το Stripe μας στείλει την επιβεβαίωση αργότερα!
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
    });

    // Κάνουμε ανακατεύθυνση τον χρήστη στην ασφαλή σελίδα του Stripe (HTTP 303 Redirect)
    return NextResponse.redirect(stripeSession.url!, { status: 303 });
    
  } catch (error) {
    console.error("Σφάλμα στο Stripe Checkout:", error);
    return new NextResponse("Εσωτερικό Σφάλμα Server", { status: 500 });
  }
}