import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // Παίρνουμε το secret από το Vercel
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Παίρνουμε τα headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Αν λείπουν τα headers, πετάμε error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  // Παίρνουμε το body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Δημιουργούμε το Webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Επαληθεύουμε ότι το request ήρθε όντως από το Clerk
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 });
  }

  // Αν η επαλήθευση πέτυχε, αποθηκεύουμε τον χρήστη στη βάση δεδομένων!
  const eventType = evt.type;

  if (eventType === 'user.created') {
    // Κρατήσαμε μόνο το id, αφού αυτό θέλει η βάση μας
    const { id } = evt.data;

    try {
      await prisma.user.create({
        data: {
          id: id,
        }
      });
      console.log(`Ο χρήστης ${id} αποθηκεύτηκε στη βάση!`);
    } catch (error) {
      console.error("Σφάλμα κατά την αποθήκευση του χρήστη:", error);
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}