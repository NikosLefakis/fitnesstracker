import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2026-04-22.dahlia", 
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 1. Περίπτωση: Ολοκλήρωση Πρώτης Πληρωμής
  if (event.type === "checkout.session.completed") {
    // ΒΑΛΑΜΕ ANY ΕΔΩ
    const session = event.data.object as any;

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string
    )) as any;

    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        isPremium: true,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // 2. Περίπτωση: Ανανέωση Συνδρομής (Invoice)
  if (event.type === "invoice.payment_succeeded") {
    // ΒΑΛΑΜΕ ANY ΚΑΙ ΕΔΩ
    const invoice = event.data.object as any;

    if (!invoice.subscription) {
        return new NextResponse(null, { status: 200 });
    }

    const subscription = (await stripe.subscriptions.retrieve(
      invoice.subscription as string
    )) as any;

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}