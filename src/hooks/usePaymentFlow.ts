"use client";

import { useState, useCallback } from "react";
import { Stripe, StripeCardNumberElement } from "@stripe/stripe-js";
import { FlowStep, PaymentResult } from "@/types/payment";
import { stripeErrorToMessage } from "@/lib/formatters";

interface PaymentFlowState {
  step: FlowStep;
  amount: number | null; // centavos
  clientSecret: string | null;
  result: PaymentResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentFlowState = {
  step: "amount",
  amount: null,
  clientSecret: null,
  result: null,
  loading: false,
  error: null,
};

export function usePaymentFlow() {
  const [state, setState] = useState<PaymentFlowState>(initialState);

  const submitAmount = useCallback(async (amountInCentavos: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCentavos }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao iniciar pagamento.");
      }

      setState((s) => ({
        ...s,
        amount: amountInCentavos,
        clientSecret: data.clientSecret,
        step: "card-method",
        loading: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Erro inesperado.",
      }));
    }
  }, []);

  const confirmPayment = useCallback(
    async (stripe: Stripe, cardElement: StripeCardNumberElement) => {
      if (!state.clientSecret) return;

      setState((s) => ({ ...s, step: "processing", loading: true, error: null }));

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          state.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          setState((s) => ({
            ...s,
            step: "result",
            loading: false,
            result: {
              status: "failure",
              errorCode: error.code,
              errorMessage: stripeErrorToMessage(error.code, error.message),
              amount: state.amount ?? undefined,
            },
          }));
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          setState((s) => ({
            ...s,
            step: "result",
            loading: false,
            result: {
              status: "success",
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount,
            },
          }));
        } else {
          setState((s) => ({
            ...s,
            step: "result",
            loading: false,
            result: {
              status: "failure",
              errorMessage: "Pagamento não completado. Tente novamente.",
              amount: state.amount ?? undefined,
            },
          }));
        }
      } catch {
        setState((s) => ({
          ...s,
          step: "result",
          loading: false,
          result: {
            status: "failure",
            errorMessage: "Erro de conexão. Verifique sua rede e tente novamente.",
            amount: state.amount ?? undefined,
          },
        }));
      }
    },
    [state.clientSecret, state.amount]
  );

  const goToDigitado = useCallback(() => {
    setState((s) => ({ ...s, step: "card-details" }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    submitAmount,
    goToDigitado,
    confirmPayment,
    reset,
    clearError,
  };
}
