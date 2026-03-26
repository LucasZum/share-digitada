export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text(); // RAW body — necessário para verificação de assinatura
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Assinatura ausente", { status: 400 });
  }

  const stripe = getStripeServer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook: falha na verificação de assinatura:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`✅ Pagamento aprovado: ${paymentIntent.id} — R$ ${(paymentIntent.amount / 100).toFixed(2)}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const failureMessage = paymentIntent.last_payment_error?.message ?? "Motivo desconhecido";
      console.log(`❌ Pagamento recusado: ${paymentIntent.id} — ${failureMessage}`);
      break;
    }

    case "payment_intent.created": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`🔄 PaymentIntent criado: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
