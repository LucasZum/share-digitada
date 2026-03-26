export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: "Valor inválido. Informe o valor em centavos (inteiro positivo)." },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: "Valor mínimo é R$ 1,00." },
        { status: 400 }
      );
    }

    const stripe = getStripeServer();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method_types: ["card"],
      capture_method: "automatic",
      metadata: {
        source: "share-venda-digitada",
        type: "moto",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
